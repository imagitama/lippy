const esbuild = require('esbuild')
const svgrPlugin = require('esbuild-plugin-svgr')
const fs = require('fs/promises')
const fsSync = require('fs')
const dotenv = require('dotenv')
const path = require('path')

dotenv.config();

const WEB_ROOT = __dirname;

const rawPlugin = {
  name: 'raw-json',
  setup(build) {
    build.onResolve({ filter: /\?raw$/ }, args => ({
      path: path.resolve(args.resolveDir, args.path.replace(/\?raw$/, '')),
      namespace: 'raw',
    }))
    build.onLoad({ filter: /.*/, namespace: 'raw' }, async args => ({
      contents: await fs.readFile(args.path, 'utf8'),
      loader: 'text',
    }))
  },
}

const urlPlugin = {
  name: 'url',
  setup(build) {
    build.onResolve({ filter: /\?url$/ }, async (args) => {
      const result = await build.resolve(args.path.replace(/\?url$/, ''), {
        kind: args.kind,
        resolveDir: args.resolveDir,
      })
      if (result.errors.length) return { errors: result.errors }
      return { path: result.path, namespace: 'url' }
    })

    build.onLoad({ filter: /.*/, namespace: 'url' }, async (args) => ({
      contents: await fs.readFile(args.path),
      loader: 'file',
      watchFiles: [args.path],
    }))
  },
};

(async () => {
  const define = {}

  for (const envVarName in process.env) {
    if (envVarName.startsWith('REACT_APP_') || envVarName === 'NODE_ENV') {
      define[`process.env.${envVarName}`] = JSON.stringify(
        process.env[envVarName]
      )
    }
  }

  const isProd = process.env.NODE_ENV === 'production'

  const config = {
    jsx: 'automatic',
    entryPoints: [path.resolve(WEB_ROOT, './src/index.tsx')],
    bundle: true,
    outdir: path.resolve(WEB_ROOT, './build'),
    sourcemap: true,
    target: ['esnext'],
    plugins: [
      urlPlugin,
      rawPlugin,
      svgrPlugin({
        exportType: 'named',
      }),
    ],
    loader: {
      '.js': 'jsx',
      '.ts': 'ts',
      '.tsx': 'tsx',
      '.webp': 'file',
      '.png': 'file',
    },
    define,
    publicPath: '/', // fix webp etc
    splitting: true,
    format: 'esm',
    minify: isProd,
    metafile: true
  }

  try {
    if (fsSync.existsSync(path.resolve(WEB_ROOT, './build'))) {
      await fs.rm(path.resolve(WEB_ROOT, './build'), { recursive: true, force: true })
    }

    await fs.cp(path.resolve(WEB_ROOT, './public'), path.resolve(WEB_ROOT, './build'), { recursive: true })

    console.debug(`build files:`)

    for (const fileName of await fs.readdir(path.resolve(WEB_ROOT, './build'))) {
      console.debug(`  ${fileName}`)
    }

    const context = await esbuild.context(config)

    if (process.env.NODE_ENV === 'development') {
      console.log('Serving...')

      const { port, hosts } = await context.serve({
        servedir: path.resolve(WEB_ROOT, './build'),
        port: 3000,
        fallback: path.resolve(WEB_ROOT, './build/index.html'),
      })

      console.log(`${hosts} :${port}`)

      console.log('Watching...')

      context.watch()

      await new Promise(() => { })
    } else {
      const result = await context.rebuild()

      await fs.writeFile(path.resolve(WEB_ROOT, './meta.json'), JSON.stringify(result.metafile))

      console.log('Build success!')
      console.log('Errors:', result.errors)
      console.log('Warnings:', result.warnings)
    }

    await context.dispose()

    console.log('Done')
    process.exit(0)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
})()

import { handleError } from '@/error-handling'
import { client } from '@/supabase'
import { useEffect, useState } from 'react'

const FUNCTION_URL = `${process.env.REACT_APP_SUPABASE_URL}/functions/v1/downloadExternalImage`

export async function downloadExternalImageToUrl(url: string): Promise<string> {
  const {
    data: { session },
  } = await client.auth.getSession()
  if (!session) throw new Error('NotAuthenticated')

  console.debug(`downloading external image "${url}"...`)

  const res = await fetch(FUNCTION_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
      apikey: process.env.REACT_APP_SUPABASE_API_KEY!,
    },
    body: JSON.stringify({ url }),
  })

  // Success -> image bytes. Failure -> JSON { error: 'SomeErrorClassName' }
  const contentType = res.headers.get('content-type') ?? ''
  if (!res.ok || !contentType.startsWith('image/')) {
    console.debug(`download failed`, res.status, res.statusText)
    const body = await res.json().catch(() => null)
    throw new Error(body?.error ?? `HTTP_${res.status}`)
  }

  console.debug(`download success`)

  const blob = await res.blob()
  return URL.createObjectURL(blob)
}

const useDownloadExternalImage = (
  externalUrl: string | false
): [boolean, string | null, string | null, () => Promise<string | null>] => {
  const [result, setResult] = useState<null | string>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [lastErrorCode, setLastErrorCode] = useState<null | string>(null)

  const performDownload = async (): Promise<string | null> => {
    try {
      if (!externalUrl) return null
      setIsLoading(true)
      const localUrl = await downloadExternalImageToUrl(externalUrl)
      setIsLoading(false)
      setResult(localUrl)
      return localUrl
    } catch (err) {
      console.error(err)
      handleError(err)
      setIsLoading(false)
      setLastErrorCode((err as Error).constructor.name)
      return null
    }
  }

  useEffect(() => {
    if (!externalUrl) return
    performDownload()
  }, [externalUrl])

  return [isLoading, lastErrorCode, result, performDownload]
}

export default useDownloadExternalImage

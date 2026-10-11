export const cleanupTags = (tags?: string[]): string[] =>
  tags
    ? tags
        .filter((tag) => /^[a-z0-9_]+$/g.test(tag))
        .map((tag) => tag.trim().toLowerCase().replaceAll(' ', '_'))
    : []

export const getTagFromUserInput = (userInput: string): string =>
  userInput
    .trim()
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-_]/g, '')
    .replace(/-/g, '_')

export const getTagsFromUserInput = (userInput: string): string[] =>
  userInput
    .split(/\s+/)
    .map((tag) => getTagFromUserInput(tag))
    .filter((tag) => tag.length > 0)

export const removeDuplicates = (tags: string[]): string[] =>
  tags.filter((value, index, array) => array.indexOf(value) === index)

export const categories = {
  General: 'General',
  Modelling: 'Modelling',
  Cost: 'Cost',
  Compatibility: 'Compatibility',
  Features: 'Features',
  Textures: 'Textures',
  Avatars: 'Avatars',
  License: 'License',
  Performance: 'Performance',
  PC_Rank: 'PC_Rank',
  Quest_Rank: 'Quest_Rank',
}

export const getLabelForTag = (tag: string): string =>
  tag
    .split('_')
    .map((chunk) => `${chunk[0].toUpperCase()}${chunk.slice(1)}`)
    .join(' ')

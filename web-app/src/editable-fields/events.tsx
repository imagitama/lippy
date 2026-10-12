import { fieldTypes } from '@/generic-forms'
import { CustomEditableField, EditableField } from '.'
import { BucketNames, EventCategory, type Event } from 'shared/modules/events'
import { ViewNames as ClubsViewNames, FullClub } from 'shared/modules/clubs'
import { nsfwRules } from '@/config'
import ClubResultsItem from '@/components/club-results-item'
import PerformancesEditor from '@/components/performances-editor'
import { commonGenres, eventTags, lessCommonGenres, worldTags } from '@/tags'
import VrchatInstanceIdInput from '@/components/vrchat-instance-id-input'

export const POSTER_WIDTH = 300 * 2
export const POSTER_HEIGHT = 400 * 2

const editableFields: EditableField<Event>[] = [
  {
    name: 'clubid',
    label: 'Club',
    type: fieldTypes.searchable,
    collectionName: ClubsViewNames.GetFullClubs,
    fieldAsLabel: 'name',
    renderer: ({ item }) => <ClubResultsItem club={item as FullClub} />,
    isRequired: true,
    hint: 'The club this event is for.',
  },
  {
    name: 'name',
    label: 'Name',
    type: fieldTypes.text,
    hint: 'The name of the event. Keep it short and simple - it is shown in the timeline/calendar.',
    isRequired: true,
  },
  {
    name: 'category',
    label: 'Category',
    type: fieldTypes.dropdown,
    options: Object.entries(EventCategory).map(([type, val]) => ({
      label: type,
      value: val,
    })),
    hint: 'The event category. Non-music events will NOT be shown in the VRChat world and will be de-prioritized in the timeline.',
  },
  {
    name: 'description',
    label: 'Description',
    type: fieldTypes.textMarkdown,
    hint: 'Explain what your event is, who can come, how to join.',
    isRequired: true,
  },
  {
    name: 'genres',
    label: 'Genres',
    type: fieldTypes.tags,
    showRecommendedTags: false,
    showSuggestButton: false, // TODO: finish this
    suggestedTags: commonGenres.concat(lessCommonGenres),
    default: [],
    isRequired: true,
    hint: 'Help people find and filter your event.',
  },
  {
    name: 'tags',
    label: 'Tags',
    type: fieldTypes.tags,
    showRecommendedTags: false,
    showSuggestButton: false, // TODO: finish this
    suggestedTags: eventTags.concat(worldTags),
    default: [],
    isRequired: true,
    hint: 'Help people find and filter your event. Indicate to people what they might expect like flashing lights.',
  },
  // {
  //   name: 'sourceurl',
  //   label: 'URL',
  //   type: fieldTypes.url,
  //   hint: 'The URL to the website for the event. Must contain https://',
  // },
  // {
  //   name: 'thumbnailurl',
  //   label: 'Thumbnail',
  //   type: fieldTypes.imageUpload,
  //   requiredWidth: THUMBNAIL_WIDTH,
  //   requiredHeight: THUMBNAIL_HEIGHT,
  //   bucketName: BucketNames.EventThumbnails,
  //   hint: 'A thumbnail used for your event. Used when viewing the event details and in search results. Can be NSFW if the checkbox is checked below.',
  // },
  {
    name: 'isadult',
    label: 'Is Adult',
    type: fieldTypes.checkbox,
    default: false,
    hint: `If the event is adult (NSFW). If enabled the event will never be shown to users unless they opt-in to see adult content and it will NEVER be shown in the VRChat world (that is against VRChat TOS).
    
${nsfwRules}`,
  },
  {
    // @ts-ignore
    name: 'startsat_endsat',
    label: 'Date/Time',
    type: fieldTypes.dateRange,
    hint: 'When the event starts and ends. All dates and times are shown in your local timezone and automatically converted.',
    isRequired: false, // perform validation at startsat/endsat
    startsAtFieldName: 'startsat',
    endsAtFieldName: 'endsat',
  },
  {
    name: 'startsat',
    label: 'Starts At',
    type: fieldTypes.hidden,
    isRequired: true,
    isEditable: false, // needed so formFields is populated for startsat.endsAtFieldName
  },
  {
    name: 'endsat',
    label: 'Ends At',
    type: fieldTypes.hidden,
    isRequired: true,
    isEditable: false, // needed so formFields is populated for startsat.endsAtFieldName
  },
  {
    name: 'posterurl',
    label: 'Poster',
    type: fieldTypes.imageUpload,
    requiredWidth: POSTER_WIDTH,
    requiredHeight: POSTER_HEIGHT,
    bucketName: BucketNames.EventPosters,
    hint: `Standard movie poster size. Shown in the VRChat world and when you view the event details. Do not use adult content:
    
${nsfwRules}`,
  },
  {
    name: 'performances',
    label: 'Performances',
    type: fieldTypes.custom,
    renderer: ({ value, onChange, formFields }) => (
      <PerformancesEditor
        value={value || []}
        onChange={onChange}
        eventStartAt={formFields.startsat}
        eventEndAt={formFields.endsat}
      />
    ),
  } as CustomEditableField<Event, 'performances'>,
  {
    name: 'vrchatinstanceid',
    label: 'VRChat Instance ID',
    type: fieldTypes.custom,
    renderer: ({ value, onChange }) => (
      <VrchatInstanceIdInput value={value} onChange={onChange} />
    ),
    hint: `Force a specific VRChat instance ID here. Leave blank to automatically search for the first VRChat group instance.`,
    // Note: The VRChat world shows cached data. It will take some time for VRC players to see your new instance ID.
  } as CustomEditableField<Event, 'vrchatinstanceid'>,
]

export default editableFields

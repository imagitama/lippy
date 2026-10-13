import { fieldTypes } from '@/generic-forms'
import { CustomEditableField, EditableField } from '.'
import { BucketNames, EventCategory, type Event } from 'shared/modules/events'
import {
  Club,
  ViewNames as ClubsViewNames,
  CollectionNames,
  FullClub,
  ViewNames,
} from 'shared/modules/clubs'
import { nsfwRules } from '@/config'
import ClubResultsItem from '@/components/club-results-item'
import PerformancesEditor from '@/components/performances-editor'
import { commonGenres, eventTags, lessCommonGenres, worldTags } from '@/tags'
import VrchatInstanceIdInput from '@/components/vrchat-instance-id-input'
import useDataStoreItem from '@/hooks/useDataStoreItem'
import LoadingIndicator from '@/components/loading-indicator'
import ErrorMessage from '@/components/error-message'
import NoResultsMessage from '@/components/no-results-message'

// 2:3 standard movie size
// NOTE: atlassing is configured for 2:3
export const POSTER_WIDTH = 1000
export const POSTER_HEIGHT = 1500

const ClubOutput = ({ clubId }: { clubId: string }) => {
  const [isLoading, lastErrorCode, club] = useDataStoreItem<FullClub>(
    ViewNames.GetFullClubs,
    clubId
  )
  if (isLoading) return <LoadingIndicator message="Loading club..." />
  if (lastErrorCode !== null)
    return (
      <ErrorMessage errorCode={lastErrorCode}>Failed to load club</ErrorMessage>
    )
  if (!club)
    return <NoResultsMessage>No club found with ID '{clubId}'</NoResultsMessage>
  return <ClubResultsItem club={club} />
}

const editableFields: EditableField<Event>[] = [
  {
    name: 'clubid',
    label: 'Club',
    type: fieldTypes.custom,
    renderer: ({ value }) => <ClubOutput clubId={value} />,
  } as CustomEditableField<Event, 'clubid'>,
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
    suggestedTags: {
      Common: commonGenres,
      'Less Common': lessCommonGenres,
    },
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
    suggestedTags: {
      Events: eventTags,
      World: worldTags,
    },
    default: [],
    isRequired: true,
    hint: 'Help people find and filter your event. Indicate to people what they might expect like flashing lights.',
  },
  {
    name: 'isadult',
    label: 'Is Adult',
    type: fieldTypes.checkbox,
    default: false,
    hint: `If the event is adult (NSFW). If enabled the event will never be shown to users unless they opt-in to see adult content and it will NEVER be shown in the VRChat world (that is against VRChat TOS).
    
${nsfwRules}`,
  },
  {
    name: 'startsat',
    label: 'Starts At',
    type: fieldTypes.date,
    isRequired: true,
  },
  {
    name: 'endsat',
    label: 'Ends At',
    type: fieldTypes.date,
    isRequired: true,
  },
  {
    name: 'posterurl',
    label: 'Poster',
    type: fieldTypes.imageUpload,
    requiredWidth: POSTER_WIDTH,
    requiredHeight: POSTER_HEIGHT,
    bucketName: BucketNames.EventPosters,
    hint: `Standard movie poster size. Shown in the VRChat world and when you view the event details (only if not adult).
    
Adult posters can only be uploaded if the event is flagged as adult.`,
  },
  {
    name: 'performances',
    label: 'Performances',
    type: fieldTypes.custom,
    renderer: ({ value, onChange, formFields }) => (
      <PerformancesEditor
        value={value || []}
        onChange={onChange}
        eventStartsAt={formFields.startsat}
        eventEndsAt={formFields.endsat}
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

import { fieldTypes } from '@/generic-forms'
import { THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT } from '@/config'
import type { CustomEditableField, EditableField } from './'
import { type Club, BucketNames } from 'shared/modules/clubs'
import { socialEditableFields } from './common'
import ClubPermissionsEditor from '@/components/club-permissions-editor'
import ImportVrchatGroupRolesForm, {
  RoleType,
} from '@/components/import-vrchat-group-roles-form'
import InfoMessage from '@/components/info-message'
import VrchatRoleIdsEditor from '@/components/vrchat-role-ids-editor'
import ErrorMessage from '@/components/error-message'

export enum SectionNames {
  Basic = 'Basic',
  Perms = 'Perms',
}

const ignoreFieldNames = ['vrchatuserid', 'vrchatusername', 'vrchatgroupid']
const filterSocialEditableField = (field: EditableField<any>): boolean =>
  !ignoreFieldNames.includes(field.name as string)

const fields: EditableField<Club>[] = [
  {
    name: 'vrchatgroupid',
    label: 'VRChat Group ID',
    type: fieldTypes.text,
    isEditable: false,
    section: SectionNames.Basic,
  },
  {
    name: 'name',
    label: 'Name',
    type: fieldTypes.text,
    isRequired: true,
    section: SectionNames.Basic,
  },
  {
    name: 'description',
    label: 'Description',
    type: fieldTypes.textMarkdown,
    default: '',
    section: SectionNames.Basic,
    hint: 'Explain a little about the club.',
  },
  {
    name: 'color',
    label: 'Color',
    type: fieldTypes.color,
    default: null,
    section: SectionNames.Basic,
    hint: 'Used in the VRChat world as the "accent" color.',
  },
  {
    name: 'thumbnailurl',
    label: 'Thumbnail',
    type: fieldTypes.imageUpload,
    requiredWidth: THUMBNAIL_WIDTH,
    requiredHeight: THUMBNAIL_HEIGHT,
    bucketName: BucketNames.ClubThumbnails,
    default: null,
    section: SectionNames.Basic,
  },
  {
    name: 'websiteurl',
    label: 'Website URL',
    type: fieldTypes.text,
    default: null,
    section: SectionNames.Basic,
  },
  {
    name: 'email',
    label: 'Email',
    type: fieldTypes.text,
    default: null,
    hint: 'Warning: Bots can find this URL so your spam inbox might get spammed!',
    section: SectionNames.Basic,
  },
  {
    name: 'perms-info',
    label: '',
    type: fieldTypes.custom,
    renderer: () => (
      <InfoMessage title="How permissions work">
        You can sync your club with your VRChat group roles. Anyone on this site
        who has that VRChat role will have permissions here too.
        <br />
        <br />
        You can also manually assign users at the end if they don't have a
        VRChat account.
      </InfoMessage>
    ),
    section: SectionNames.Perms,
  },
  {
    name: 'vrchatownerroleids',
    label: 'Owner Roles',
    type: fieldTypes.custom,
    renderer: ({ value, formFields, setFieldsValues, extraFormData }) =>
      extraFormData.isManagement ? (
        <ErrorMessage>
          You do not have permission to edit this field
        </ErrorMessage>
      ) : (
        <VrchatRoleIdsEditor
          roleIdsWithMemberIds={
            value?.map((roleId) => {
              return {
                roleId,
                memberIds: formFields.vrchatowneruserids,
              }
            }) || []
          }
          onChange={(roleIdsWithMemberIds) => {
            setFieldsValues({
              vrchatownerroleids: roleIdsWithMemberIds.map(
                (item) => item.roleId
              ),
              vrchatowneruserids: roleIdsWithMemberIds.flatMap(
                (item) => item.memberIds
              ),
            })
          }}
          roleType={RoleType.Owner}
          vrchatGroupId={formFields.vrchatgroupid}
        />
      ),
    default: [],
    hint: 'VRC group roles that are considered owners and can edit the club.',
    section: SectionNames.Perms,
  } as CustomEditableField<Club, 'vrchatownerroleids'>,
  {
    name: 'vrchatowneruserids',
    type: fieldTypes.hidden,
    isEditable: false,
    section: SectionNames.Perms,
  },
  {
    name: 'vrchatmodroleids',
    label: 'Event Organizer Roles',
    type: fieldTypes.custom,
    renderer: ({ value, formFields, setFieldsValues, extraFormData }) =>
      extraFormData.isManagement ? (
        <ErrorMessage>
          You do not have permission to edit this field
        </ErrorMessage>
      ) : (
        <VrchatRoleIdsEditor
          roleIdsWithMemberIds={
            value?.map((roleId) => {
              return {
                roleId,
                memberIds: formFields.vrchatmoduserids,
              }
            }) || []
          }
          onChange={(roleIdsWithMemberIds) => {
            setFieldsValues({
              vrchatmodroleids: roleIdsWithMemberIds.map((item) => item.roleId),
              vrchatmoduserids: roleIdsWithMemberIds.flatMap(
                (item) => item.memberIds
              ),
            })
          }}
          roleType={RoleType.Mod}
          vrchatGroupId={formFields.vrchatgroupid}
        />
      ),
    default: [],
    hint: 'VRC group roles that can create/manage events.',
    section: SectionNames.Perms,
  } as CustomEditableField<Club, 'vrchatmodroleids'>,
  {
    name: 'vrchatmoduserids',
    type: fieldTypes.hidden,
    isEditable: false,
    section: SectionNames.Perms,
  },
  {
    name: 'owneruserids',
    label: 'Owner Users',
    type: fieldTypes.custom,
    renderer: ({ value, onChange, formFields, extraFormData }) =>
      extraFormData.isManagement ? (
        <ErrorMessage>
          You do not have permission to edit this field
        </ErrorMessage>
      ) : (
        <ClubPermissionsEditor
          value={value || []}
          onChange={onChange}
          vrchatGroupId={formFields.vrchatgroupid}
        />
      ),
    default: [],
    hint: `Users on this site who can edit the club (and create/manage events).`,
    section: SectionNames.Perms,
  } as CustomEditableField<Club, 'owneruserids'>,
  {
    name: 'moduserids',
    label: 'Event Organizer Users',
    type: fieldTypes.custom,
    renderer: ({ value, onChange, formFields, extraFormData }) =>
      extraFormData.isManagement ? (
        <ErrorMessage>
          You do not have permission to edit this field
        </ErrorMessage>
      ) : (
        <ClubPermissionsEditor
          value={value || []}
          onChange={onChange}
          vrchatGroupId={formFields.vrchatgroupid}
        />
      ),
    default: [],
    hint: `Users on this site who can create/manage events.`,
    section: SectionNames.Perms,
  } as CustomEditableField<Club, 'moduserids'>,
  ...socialEditableFields.filter(filterSocialEditableField),
]

export default fields

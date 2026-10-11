import React from 'react'

import { Club } from 'shared/modules/clubs'
import { FullComment } from 'shared/modules/comments'

import Link from '@/components/link'

const GenericOutputLabel = ({
  type,
  id,
  data,
}: {
  type: string
  id: string
  data?: FullComment | Club
}) => {
  if (!data) return null
  // if (!data) {
  //   return (
  //     <Link to={getUrlForParent(type, id)}>
  //       View {type.substring(0, type.length - 1)}
  //     </Link>
  //   )
  // }
  switch (type) {
    // case CommentsCollectionNames.Comments:
    //   return (
    //     <Link to={getUrlForParent(type, id)}>{data.createdbyusername}</Link>
    //   )
    default:
      return <>Invalid type "{type}"</>
  }
}

export default GenericOutputLabel

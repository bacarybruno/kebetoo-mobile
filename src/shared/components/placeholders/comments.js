import React from 'react'
import {
  Placeholder, PlaceholderMedia, PlaceholderLine, Fade,
} from 'rn-placeholder'

const PlaceholderIcon = () => (
  <PlaceholderMedia size={15} style={{ marginLeft: 10 }} />
)

const PlaceholderAvatar = () => (
  <PlaceholderMedia isRound style={{ marginRight: 10 }} />
)

const CommentPlaceholder = () => (
  <Placeholder Animation={Fade} Left={PlaceholderAvatar} Right={PlaceholderIcon}>
    <PlaceholderLine height={8} width={50} />
    <PlaceholderLine height={10} style={{ marginBottom: 5 }} />
    <PlaceholderLine height={10} />
  </Placeholder>
)

export default React.memo(CommentPlaceholder)

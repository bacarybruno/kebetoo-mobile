import { memo, useEffect, useState, useMemo } from 'react'
import { View } from 'react-native'

import BaseReactions from '@app/features/post/containers/reactions'
import { Typography, Avatar } from '@app/shared/components'
import { useAppStyles, usePosts } from '@app/shared/hooks'
import { strings } from '@app/config'
import { readableNumber } from '@app/shared/helpers/strings'

import DraggableIndicator from '../draggable-indicator'
import createThemedStyles, { reactionsHeight, summaryHeight } from './styles'

export const SummaryAuthor = ({ author }) => {
  const styles = useAppStyles(createThemedStyles)
  if (!author) return <View style={styles.img} />
  return (
    <Avatar src={author.photoURL} text={author.displayName} style={styles.img} />
  )
}

const Summary = memo(({ comments }) => {
  const [authors, setAuthors] = useState({})
  const [reactionsMap, setReactionsMap] = useState({})

  const { getAuthors } = usePosts()
  const styles = useAppStyles(createThemedStyles)

  useEffect(() => {
    const reactionsMapData = {}
    comments.flatMap((comment) => comment.reactions).forEach((reaction) => {
      const currentCount = reactionsMapData[reaction.author]
      if (currentCount === undefined) {
        reactionsMapData[reaction.author] = 0
      } else {
        reactionsMapData[reaction.author] = currentCount + 1
      }
    })
    setReactionsMap(reactionsMapData)
  }, [comments])

  useEffect(() => {
    const fetchAuthors = async () => {
      const authorsToFetch = Object.keys(reactionsMap)
      const data = await getAuthors(authorsToFetch)
      setAuthors(data)
    }
    fetchAuthors()
  }, [getAuthors, reactionsMap])

  const reactors = Object.keys(reactionsMap)
  if (reactors.length === 0) return null

  // eslint-disable-next-line no-return-assign
  const sortedReactors = reactors.sort((a, b) => reactionsMap[b] - reactionsMap[a])

  return (
    <View style={styles.summary}>
      <View style={styles.imgs}>
        {sortedReactors[0] && (
          <View style={styles.imgWrapper}>
            <SummaryAuthor author={authors[sortedReactors[0]]} />
          </View>
        )}
        {sortedReactors[1] && (
          <View style={[styles.imgWrapper, styles.img2Wrapper]}>
            <SummaryAuthor author={authors[sortedReactors[1]]} />
          </View>
        )}
      </View>
      <Typography
        type={Typography.types.headline5}
        text={strings.formatString(
          strings.comments.people_reacted,
          readableNumber(reactors.length),
        )}
      />
    </View>
  )
})

const Reactions = ({
  post, author, comments, ...reactionProps
}) => {
  const styles = useAppStyles(createThemedStyles)

  const hasReactions = comments.flatMap((comment) => comment.reactions).length > 0
  const getContainerStyle = useMemo(() => () => {
    let height = reactionsHeight
    if (hasReactions) height += summaryHeight
    return { ...styles.reactionsContainer, height }
  }, [hasReactions, styles.reactionsContainer])

  return (
    <View style={getContainerStyle()}>
      <DraggableIndicator />
      <View style={styles.reactions}>
        <BaseReactions post={post} author={author} comments={comments} {...reactionProps} />
        {hasReactions && <Summary comments={comments} />}
      </View>
    </View>
  )
}

export default memo(Reactions)

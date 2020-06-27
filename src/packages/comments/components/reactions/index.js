import React, { useEffect, useState, useMemo } from 'react'
import { View, Image } from 'react-native'

import ReactionsOnline from 'Kebetoo/src/packages/post/containers/reactions'
import Text from 'Kebetoo/src/shared/components/text'
import { getUsers } from 'Kebetoo/src/shared/helpers/users'
import strings from 'Kebetoo/src/config/strings'

import DraggableIndicator from '../draggable-indicator'

import styles, { reactionsHeight, summaryHeight } from './styles'

const Summary = React.memo(({ comments }) => {
  const [authors, setAuthors] = useState({})
  const [reactionsMap, setReactionsMap] = useState({})

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
      const data = {}
      const authorsToFetch = Object.keys(reactionsMap)
      if (authorsToFetch.length > 0) {
        const ids = [...new Set(authorsToFetch)]
        if (ids.length === 0) return
        const { docs } = await getUsers(ids)
        docs.forEach((doc) => {
          const { photoURL } = doc.data()
          data[doc.id] = photoURL
        })
        setAuthors(data)
      }
    }
    fetchAuthors()
  }, [comments, reactionsMap])

  const reactors = Object.keys(reactionsMap)
  if (reactors.length === 0) return null

  // eslint-disable-next-line no-return-assign
  const sortedReactors = reactors.sort((a, b) => reactionsMap[b] - reactionsMap[a])

  return (
    <View style={styles.summary}>
      <View style={styles.imgs}>
        {sortedReactors[0] && (
          <View style={styles.imgWrapper}>
            <Image style={styles.img} source={{ uri: authors[sortedReactors[0]] }} />
          </View>
        )}
        {sortedReactors[1] && (
          <View style={[styles.imgWrapper, styles.img2Wrapper]}>
            <Image style={styles.img} source={{ uri: authors[sortedReactors[1]] }} />
          </View>
        )}
      </View>
      <Text size="sm" text={strings.formatString(strings.comments.people_reacted, reactors.length)} />
    </View>
  )
})

const Reactions = ({
  post, author, comments, ...reactionProps
}) => {
  const hasReactions = comments.flatMap((comment) => comment.reactions).length > 0
  const getContainerStyle = useMemo(() => () => {
    let height = reactionsHeight
    if (hasReactions) height += summaryHeight
    return { ...styles.reactionsContainer, height }
  }, [hasReactions])

  return (
    <View style={getContainerStyle()}>
      <DraggableIndicator />
      <View style={styles.reactions}>
        <ReactionsOnline post={post} author={author} comments={comments} {...reactionProps} />
        {hasReactions && <Summary comments={comments} />}
      </View>
    </View>
  )
}

export default React.memo(Reactions)

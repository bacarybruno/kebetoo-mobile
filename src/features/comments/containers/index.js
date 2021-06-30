import { memo, useRef } from 'react'
import { View } from 'react-native'
import { HeaderBackButton } from '@react-navigation/stack'

import { Content, Header } from '@app/features/post/containers/basic-post'
import { HeaderBack } from '@app/shared/components'
import { useAppColors, useAppStyles, useUser } from '@app/shared/hooks'
import CommentsView from '@app/features/comments/components/comments-view'
import Reactions from '@app/features/comments/components/reactions'
import { useNavigation } from '@react-navigation/native'

import createThemedStyles from './styles'
import useComments from './hook'

const ListHeaderLeft = () => {
  const styles = useAppStyles(createThemedStyles)
  const { colors } = useAppColors()

  const { goBack } = useNavigation()

  return (
    <HeaderBackButton
      onPress={goBack}
      labelVisible={false}
      backImage={() => (
        <HeaderBack tintColor={colors.textPrimary} style={styles.headerBackButton} />
      )}
    />
  )
}

const ListHeader = ({
  post, comments, authors, onComment, onCommentPress,
}) => {
  const styles = useAppStyles(createThemedStyles)
  const { profile } = useUser()

  return (
    <View style={styles.post}>
      <View style={styles.postHeader}>
        <Header
          Left={ListHeaderLeft}
          author={post.author}
          post={post}
          size={35}
        />
        <Content
          post={post}
          style={styles.content}
          mode="comments"
          onPress={onCommentPress}
          originalAuthor={
            post.repost
              ? authors[post.repost.author]
              : post.author
          }
        />
      </View>
      <Reactions
        post={post}
        author={profile.uid}
        comments={comments}
        onComment={onComment}
      />
    </View>
  )
}

const Comments = ({ route, navigation }) => {
  const { post } = route.params

  const commentInput = useRef()
  const scrollView = useRef()

  const commentHelpers = useComments(
    post,
    commentInput,
    scrollView,
    navigation,
  )

  const renderHeader = (
    <ListHeader post={post} {...commentHelpers} />
  )

  return (
    <CommentsView
      {...commentHelpers}
      scrollView={scrollView}
      commentInput={commentInput}
      renderHeader={renderHeader}
    />
  )
}

export default memo(Comments)

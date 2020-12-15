import { useEffect, useCallback, useReducer } from 'react'

import { getPostType, POST_TYPES } from '@app/features/post/containers/basic-post'
import { useAudioRecorder, useUser, usePosts } from '@app/shared/hooks'
import { api } from '@app/shared/services'
import routes from '@app/navigation/routes'
import { getSource } from '@app/features/post/components/image-content'

import reducer, { initialState, actionTypes } from './reducer'

/**
 * Hackernews' hot sort
 * https://medium.com/hacking-and-gonzo/how-hacker-news-ranking-algorithm-works-1d9b0cf2c08d
 */
export const scoreComment = (votes, itemDate, gravity = 1.8) => {
  const hourAge = (Date.now() - itemDate.getTime()) / (1000 * 3600)
  return (votes - 1) / (hourAge + 2 ** gravity)
}

export const sortComments = (comments) => (
  comments
    .map((comment) => ({
      ...comment,
      score: scoreComment(
        comment.reactions.length + comment.replies.length,
        new Date(comment.createdAt),
      ),
    }))
    .sort((a, b) => {
      if (a.score < b.score) return 1
      if (b.score < a.score) return -1
      return 0
    })
)

const mapComments = (comment) => ({
  id: comment.id,
  author: {
    id: comment.author,
    displayName: ' ',
    photoURL: null,
  },
  reactions: [],
})

// TODO: paginate comments
const useComments = ({ navigate }, post, commentInput, scrollView) => {
  const audioRecorder = useAudioRecorder()

  const initialComments = post.comments?.map(mapComments)
  if (initialComments) {
    initialState.comments = initialComments
  }

  const [state, dispatch] = useReducer(reducer, initialState)

  const {
    authors, comment, toReply, comments, replies, isLoading,
  } = state

  const { profile } = useUser()

  const { getRepostAuthors } = usePosts()

  useEffect(() => {
    const fetchComments = async () => {
      const result = await api.comments.getByPostId(post.id)
      dispatch({ type: actionTypes.SET_COMMENTS, payload: sortComments(result) })
    }
    fetchComments()
  }, [post.id])

  useEffect(() => {
    const fetchRepostAuthors = async () => {
      const data = await getRepostAuthors(post)
      dispatch({ type: actionTypes.SET_AUTHORS, payload: data })
    }
    fetchRepostAuthors()
  }, [post, getRepostAuthors])

  const startLoading = useCallback(() => {
    dispatch({ type: actionTypes.START_LOADING })
  }, [])

  const endLoading = useCallback(() => {
    dispatch({ type: actionTypes.START_LOADING })
  }, [])

  const setLoading = useCallback((loading) => {
    if (loading) startLoading()
    else endLoading()
  }, [endLoading, startLoading])

  const onSend = useCallback(async () => {
    let result = null
    setLoading(true)

    let replyThread = null
    if (toReply) {
      // use the comment reply thread or the base comment
      replyThread = toReply.thread || toReply
    }

    if (audioRecorder.hasRecording) {
      result = await audioRecorder.saveComment(post.id, profile.uid, replyThread)
    } else if (comment.length > 0) {
      result = await api.comments.create({
        author: profile.uid,
        content: comment,
        thread: replyThread ? replyThread.id : null,
        post: replyThread ? null : post.id,
      })
      commentInput.current?.clear()
      dispatch({ type: actionTypes.CLEAR_COMMENT })
    }
    if (replyThread) {
      dispatch({
        type: actionTypes.ADD_REPLIES,
        payload: { threadId: replyThread.id, replies: result },
      })
      dispatch({ type: actionTypes.CLEAR_TO_REPLY })
    } else {
      dispatch({ type: actionTypes.ADD_COMMENT, payload: result })
      setTimeout(() => scrollView.current?.scrollToEnd(), 200)
    }
    setLoading(false)
  }, [setLoading, toReply, audioRecorder, comment, post.id, profile.uid, commentInput, scrollView])

  const onSetReply = useCallback((item) => {
    commentInput.current?.focus()
    dispatch({ type: actionTypes.SET_TO_REPLY, payload: item })
  }, [commentInput])

  const loadReplies = useCallback(async (thread) => {
    if (!replies[thread.id]) {
      dispatch({
        type: actionTypes.SET_REPLIES,
        payload: { threadId: thread.id, replies: thread.replies.map(mapComments) },
      })
    }
    const loadedReplies = await api.comments.getReplies(thread.id)
    dispatch({
      type: actionTypes.SET_REPLIES,
      payload: { threadId: thread.id, replies: loadedReplies },
    })
  }, [replies])

  const onComment = useCallback(() => commentInput.current?.focus(), [])

  const onCommentContentPress = useCallback(() => {
    const type = getPostType(post)
    if (type === POST_TYPES.IMAGE) {
      navigate(routes.MODAL_IMAGE, {
        ...post.image,
        source: getSource(post.image.url),
      })
      return false
    }
    return true
  }, [navigate, post])

  const clearToReply = useCallback(() => {
    dispatch({ type: actionTypes.CLEAR_TO_REPLY })
  }, [])

  const setComment = useCallback((payload) => {
    dispatch({ type: actionTypes.SET_COMMENT, payload })
  }, [])

  return {
    onSend,
    onSetReply,
    loadReplies,
    onComment,
    onCommentContentPress,
    clearToReply,
    setComment,
    isLoading,
    authors,
    comments,
    toReply,
    replies,
    comment,
  }
}

export default useComments

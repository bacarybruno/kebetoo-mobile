import reducer, { actionTypes, initialState } from '../reducer'

describe('comments reducer', () => {
  it('sets comments', () => {
    const comments = [1, 2, 3]
    expect(
      reducer(initialState, { type: actionTypes.SET_COMMENTS, payload: comments }).comments,
    ).toEqual(comments)
  })
  it('sets comment', () => {
    const comment = 'Its working'
    expect(
      reducer(initialState, { type: actionTypes.SET_COMMENT, payload: comment }).comment,
    ).toBe(comment)
  })
  it('sets authors', () => {
    const authors = [1, 2, 3]
    const result = reducer(initialState, { type: actionTypes.SET_AUTHORS, payload: authors })
    expect(result.authors).toEqual(authors)
  })
  it('clears comment', () => {
    const clearCommentState = { comment: 'Its working' }
    expect(
      reducer(clearCommentState, { type: actionTypes.CLEAR_COMMENT }).comment,
    ).toBe('')
  })
  it('clears comment to reply', () => {
    const clearCommentToReplyState = { id: 1 }
    expect(
      reducer(clearCommentToReplyState, { type: actionTypes.CLEAR_TO_REPLY }).toReply,
    ).toBeNull()
  })
  it('adds comment', () => {
    const comment = 'Its working'
    const state = reducer(initialState, { type: actionTypes.ADD_COMMENT, payload: comment })
    expect(state.comments.length).toBe(1)
    expect(state.comments[0]).toBe(comment)
  })
  it('sets comment to reply', () => {
    const commentToReply = { id: 1 }
    expect(
      reducer(initialState, { type: actionTypes.SET_TO_REPLY, payload: commentToReply }).toReply,
    ).toEqual(commentToReply)
  })
  it('add replies to empty thread id', () => {
    const reply = { content: 'Its great' }
    const threadId = 'reply-1'
    const initialRepliesState = { replies: {} }

    const result = reducer(initialRepliesState, {
      type: actionTypes.ADD_REPLIES,
      payload: { threadId, replies: reply },
    })
    expect(result.replies['reply-1'].length).toBe(1)
    expect(result.replies['reply-1'][0]).toEqual(reply)
  })
  it('add replies to existing thread id', () => {
    const reply = { content: 'Its great' }
    const threadId = 'reply-1'
    const initialRepliesState = { replies: { [threadId]: [{ content: 'First reply' }] } }

    const result = reducer(initialRepliesState, {
      type: actionTypes.ADD_REPLIES,
      payload: { threadId, replies: [reply] },
    })
    expect(result.replies['reply-1'].length).toBe(2)
    expect(result.replies['reply-1'][1]).toEqual(reply)
  })
  it('starts loading', () => {
    expect(
      reducer({ isLoading: false }, { type: actionTypes.START_LOADING }),
    ).toEqual({ isLoading: true })
    expect(
      reducer({ isLoading: true }, { type: actionTypes.START_LOADING }),
    ).toEqual({ isLoading: true })
  })
  it('ends loading', () => {
    expect(
      reducer({ isLoading: true }, { type: actionTypes.END_LOADING }),
    ).toEqual({ isLoading: false })
    expect(
      reducer({ isLoading: false }, { type: actionTypes.END_LOADING }),
    ).toEqual({ isLoading: false })
  })
  it('throws error if action type is unknown', () => {
    expect(() => {
      reducer(initialState, { type: 'UNKNOWN' })
    }).toThrowError()
    expect(() => {
      reducer(initialState, { type: actionTypes.ADD_COMMENT })
    }).not.toThrowError()
  })
})

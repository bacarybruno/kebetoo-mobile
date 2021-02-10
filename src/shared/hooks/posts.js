import { useCallback } from 'react'

import { getUsers } from '@app/shared/services'

const usePosts = () => {
  const getAuthors = useCallback(async (authorsToFetch) => {
    const data = {}
    if (authorsToFetch.length > 0) {
      const ids = Array.from(new Set(authorsToFetch))
      if (ids.length === 0) return data
      const docs = await getUsers(ids)
      docs.forEach((doc) => {
        data[doc.id] = {
          displayName: doc.displayName,
          photoURL: doc.photoURL,
          id: doc.id,
        }
      })
    }
    return data
  }, [])

  const getRepostAuthors = useCallback(async (p) => {
    let posts = p
    if (!Array.isArray(p)) {
      posts = [p]
    }
    const authorsToFetch = posts.flatMap((post) => {
      if (!post.repost) return []
      return post.repost.author
    })
    const data = await getAuthors(authorsToFetch)
    return data
  }, [getAuthors])

  return {
    getAuthors,
    getRepostAuthors,
  }
}

export default usePosts

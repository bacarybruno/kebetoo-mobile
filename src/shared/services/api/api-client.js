import HttpClient from './http-client'

class ApiClient extends HttpClient {
  constructor(baseURL, langCode) {
    super({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': langCode,
      },
    })
  }

  get authors() {
    const pageSize = 30
    return {
      search: (query) => this.get(`/authors?displayName_contains=${query}&_limit=${pageSize}`),
      create: (author) => this.post('/authors', author),
      getByUid: (uid) => this.get(`/authors?uid=${uid}`),
      getById: (id) => this.get(`/authors/${id}`),
      update: (id, data) => this.put(`/authors/${id}`, data),
      batchGetById: (ids) => {
        const queryString = ids.map((id) => `id_eq=${id}`).join('&')
        return this.get(`/authors?${queryString}`)
      },
    }
  }

  get posts() {
    const pageSize = 20
    return {
      getByAuthor: (authorId) => this.get(`/posts?author.id=${authorId}&_sort=updatedAt:desc`),
      getById: (id) => this.get(`/posts/${id}`),
      get: ({ page, sort = 'score' }) => this.get(`/posts?_sort=${sort}:desc&_start=${page * pageSize}&_limit=${pageSize}`),
      create: (post) => this.post('/posts', post),
      createAudio: ({ audio, ...payload }) => this.postAsset('/posts', 'audio', audio, payload),
      createImage: ({ image, ...payload }) => this.postAsset('/posts', 'image', image, payload),
      createVideo: ({ video, ...payload }) => this.postAsset('/posts', 'video', video, payload),
      update: ({ id, content }) => this.put(`/posts/${id}`, { content }),
      delete: (id) => this.delete(`/posts/${id}`),
      search: (query) => this.get(`/posts?content_contains=${query}&_limit=${pageSize}`),
      countByAuthor: (author) => this.get(`/posts/count?author.id=${author}`),
    }
  }

  get comments() {
    const pageSize = -1
    return {
      getByPostId: (postId) => this.get(`/comments?post.id=${postId}&_limit=${pageSize}`),
      getReplies: (commentId) => this.get(`/comments?thread=${commentId}&_sort=createdAt`),
      create: (comment) => this.post('/comments', comment),
      createAudio: ({ audio, ...payload }) => this.postAsset('/comments', 'audio', audio, payload),
      delete: (id) => this.delete(`/comments/${id}`),
      countByAuthor: (author) => this.get(`/comments/count?author.id=${author}`),
    }
  }

  get reactions() {
    return {
      create: (type, post, author) => this.post('/reactions', { type, post, author }),
      createCommentReaction: (type, comment, author) => this.post('/reactions', { type, comment, author }),
      update: (id, type) => this.put(`/reactions/${id}`, { type }),
      delete: (id) => this.delete(`/reactions/${id}`),
      countByAuthor: (author) => this.get(`/reactions/count?author.id=${author}`),
    }
  }

  get feedbacks() {
    return {
      create: (feedback) => this.post('/feedbacks', feedback),
      createImage: ({ image, ...payload }) => this.postAsset('/feedbacks', 'image', image, payload),
    }
  }

  get assets() {
    return {
      createAudio: ({ audio, ...payload }) => this.postAsset('/upload', 'audio', audio, payload),
      createImage: ({ image, ...payload }) => this.postAsset('/upload', 'image', image, payload),
    }
  }
}


export default ApiClient

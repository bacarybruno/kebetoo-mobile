import HttpClient from './http-client';

class ApiClient extends HttpClient {
  constructor(baseURL, langCode) {
    super({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': langCode,
      },
    });
  }

  get authors() {
    const pageSize = 30;
    return {
      search: (query) => this.get(`/authors?displayName_contains=${query}&_limit=${pageSize}`),
      getByUsername: (username) => this.get(`/authors?username=${username}&_limit=1`),
      create: (author) => this.post('/authors', author),
      getByUid: (uid) => this.get(`/authors?uid=${uid}`),
      getById: (id) => this.get(`/authors/${id}`),
      update: (id, data) => this.put(`/authors/${id}`, data),
      countActivities: (id) => this.get(`/authors/${id}/activities/count`),
      getActivities: (id, from = new Date().toISOString()) => (
        this.get(`/authors/${id}/activities?_from=${from}&_limit=10`)
      ),
      batchGetById: (ids) => {
        const queryString = ids.map((id) => `id_eq=${id}`).join('&');
        return this.get(`/authors?${queryString}`);
      },
    };
  }

  get stories() {
    const pageSize = 10;
    return {
      createVideo: ({ video, ...payload }) => this.postAsset('/stories', 'video', video, payload),
      get: ({ page = 0, filter = 'updatedAt' }) => this.get(`/stories?_sort=${filter}:desc&_start=${page * pageSize}&_limit=${pageSize}`),
      delete: (id) => this.delete(`/stories/${id}`),
    };
  }

  get posts() {
    const pageSize = 20;
    return {
      getByAuthor: (authorId) => this.get(`/posts?author.id=${authorId}&_sort=updatedAt:desc`),
      getById: (id) => this.get(`/posts/${id}`),
      get: ({ page = 0, filter = 'score' }) => this.get(`/posts?_sort=${filter}:desc&_start=${page * pageSize}&_limit=${pageSize}`),
      create: (post) => this.post('/posts', post),
      createAudio: ({ audio, ...payload }) => this.postAsset('/posts', 'audio', audio, payload),
      createImage: ({ image, ...payload }) => this.postAsset('/posts', 'image', image, payload),
      createVideo: ({ video, ...payload }) => this.postAsset('/posts', 'video', video, payload),
      update: ({ id, content }) => this.put(`/posts/${id}`, { content }),
      delete: (id) => this.delete(`/posts/${id}`),
      search: (query) => this.get(`/posts?content_contains=${query}&_limit=${pageSize}`),
      q: (queryParams) => this.get(`/posts?${queryParams}`),
    };
  }

  get comments() {
    const pageSize = -1;
    return {
      getByPostId: (postId) => this.get(`/comments?post.id=${postId}&_limit=${pageSize}`),
      getByStoryId: (storyId) => this.get(`/comments?story.id=${storyId}&_limit=${pageSize}`),
      getReplies: (commentId) => this.get(`/comments?thread=${commentId}&_sort=createdAt`),
      create: (comment) => this.post('/comments', comment),
      createAudio: ({ audio, ...payload }) => this.postAsset('/comments', 'audio', audio, payload),
      delete: (id) => this.delete(`/comments/${id}`),
    };
  }

  get reactions() {
    return {
      create: (type, post, author) => this.post('/reactions', { type, post, author }),
      createCommentReaction: (type, comment, author) => this.post('/reactions', { type, comment, author }),
      createStoryReaction: (type, story, author) => this.post('/reactions', { type, story, author }),
      update: (id, type) => this.put(`/reactions/${id}`, { type }),
      delete: (id) => this.delete(`/reactions/${id}`),
    };
  }

  get feedbacks() {
    return {
      create: (feedback) => this.post('/feedbacks', feedback),
      createImage: ({ image, ...payload }) => this.postAsset('/feedbacks', 'image', image, payload),
    };
  }

  get assets() {
    return {
      createAudio: ({ audio }) => this.postAsset('/upload', null, audio),
      createImage: ({ image }) => this.postAsset('/upload', null, image),
      findByUrl: (url) => this.get(`/upload/files?url=${url}`),
      delete: (id) => this.get(`/upload/delete/${id}`),
    };
  }
}


export default ApiClient;

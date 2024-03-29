import posts, { postsList } from '@fixtures/posts';
import authors from '@fixtures/authors';
import comments from '@fixtures/comments';

// eslint-disable-next-line radix
const createRandomId = () => parseInt(Math.random() * 10000000).toString();

const api = {
  authors: {
    search: jest.fn().mockResolvedValue([]),
    getByUsername: jest.fn().mockResolvedValue([]),
    create: jest.fn().mockResolvedValue({}),
    getByUid: jest.fn()
      .mockImplementation((uid) => authors.filter((author) => author.uid === uid)),
    getById: jest.fn(),
    update: jest.fn().mockResolvedValue(true),
    batchGetById: jest.fn().mockResolvedValue(authors),
    countActivities: jest.fn().mockResolvedValue({ posts: 0, comments: 0, reactions: 0 }),
    getActivities: jest.fn().mockResolvedValue({
      metadata: {
        count: {
          posts: 0,
          comments: 0,
          reactions: 0,
          pageSize: 0,
        },
        next: '2021-01-11T17:39:03.701Z',
      },
      items: [
        {
          type: 'post',
          data: {},
        },
      ],
    }),
  },

  posts: {
    getByAuthor: jest.fn().mockImplementation((userId) => Promise.resolve(
      postsList.filter((post) => post.author.id === userId),
    )),
    getById: jest.fn().mockImplementation((postId) => Promise.resolve(
      postsList.find((post) => post.id === postId),
    )),
    get: jest.fn().mockResolvedValue([]),
    create: jest.fn().mockResolvedValue(posts.text),
    createAudio: jest.fn().mockResolvedValue(posts.audio),
    createImage: jest.fn().mockResolvedValue(posts.image),
    update: jest.fn().mockResolvedValue({}),
    delete: jest.fn().mockResolvedValue(true),
    search: jest.fn().mockImplementation((query) => Promise.resolve((
      postsList.filter((post) => post.content?.toLowerCase().includes(query.toLowerCase()))
    ))),
  },

  comments: {
    getByPostId: jest.fn().mockImplementation((postId) => Promise.resolve(
      comments.filter((comment) => comment.post.id === postId),
    )),
    getReplies: jest.fn().mockResolvedValue([]),
    create: jest.fn().mockImplementation((data) => Promise.resolve({
      author: {
        id: data.author,
        displayName: ' ',
        photoURL: null,
      },
      content: data.content,
      post: {
        id: data.post,
      },
      reactions: [],
      id: createRandomId(),
    })),
    createAudio: jest.fn().mockResolvedValue({}),
    delete: jest.fn().mockResolvedValue(true),
  },

  reactions: {
    create: jest.fn().mockImplementation(
      (type, postId, author) => (
        Promise.resolve({
          id: createRandomId(),
          type,
          author: {
            id: author,
          },
          post: { id: postId },
        })
      ),
    ),
    createCommentReaction: jest.fn().mockImplementation(
      (type, commentId, author) => (
        Promise.resolve({
          id: createRandomId(),
          type,
          author: {
            id: author,
          },
          comment: { id: commentId },
        })
      ),
    ),
    update: jest.fn().mockResolvedValue(true),
    delete: jest.fn().mockResolvedValue(true),
  },
};

export default api;

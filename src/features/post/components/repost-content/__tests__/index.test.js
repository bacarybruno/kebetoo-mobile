import setupTest from '@app/config/jest-setup';
import posts from '@fixtures/posts';
import authors from '@fixtures/authors';

import RepostContent from '../index';

const givenRepostContent = setupTest(RepostContent)({
  post: posts.repost,
  originalAuthor: authors[0],
  style: { elevation: 1 },
  onPress: jest.fn(),
});

it('renders RepostContent', () => {
  const { wrapper } = givenRepostContent();
  expect(wrapper.toJSON()).toMatchSnapshot();
});

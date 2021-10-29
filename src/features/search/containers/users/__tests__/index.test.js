import * as redux from 'react-redux';
import { act } from 'react-test-renderer';

import setupTest from '@app/config/jest-setup';
import { api } from '@app/shared/services';
import NoResult from '@app/features/search/components/no-result';
import HistoryItem from '@app/features/search/components/history-item';
import * as types from '@app/redux/types';

import SearchUsers, { SearchHistoryHeader, SearchResult } from '../index';

const users = [{
  id: 1,
  uid: 1,
  displayName: 'Bacary Bruno',
  photoURL: 'https://avatars1.githubusercontent.com/u/14147533',
  posts: Array(4),
  comments: Array(10),
}, {
  id: 2,
  uid: 2,
  displayName: 'Bruno Bodian',
  photoURL: null,
  posts: Array(2),
  comments: Array(8),
}, {
  id: 3,
  uid: 3,
  displayName: 'John Doe',
  photoURL: null,
  posts: Array(3),
  comments: Array(40),
}];

api.authors.search = jest.fn().mockImplementation(async (query) => {
  const results = users.filter((user) => (
    user.displayName.toLowerCase().includes(query.toLowerCase())
  ));
  return results;
});

const givenSearchUsers = setupTest(SearchUsers)({
  __storeState__: {
    userReducer: {
      searchHistory: {
        users: ['john', 'doe'],
      },
    },
  },
  searchQuery: '',
  onSearch: jest.fn(),
  onRecentSearch: jest.fn(),
});

it('renders SearchUsers history', async () => {
  let wrapper;
  let props;

  const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
  const mockDispatchFn = jest.fn();
  useDispatchSpy.mockReturnValue(mockDispatchFn);

  await act(async () => {
    const { wrapper: asyncWrapper, props: asyncProps } = await givenSearchUsers();
    wrapper = asyncWrapper;
    props = asyncProps;
  });

  expect(wrapper.toJSON()).toMatchSnapshot();
  expect(wrapper.root.findAllByType(SearchResult).length).toBe(0);
  expect(wrapper.root.findAllByType(HistoryItem).length).toBe(2);

  act(() => {
    wrapper.root.findAllByType(HistoryItem)[0].props.onPress();
  });

  expect(props.onRecentSearch).toBeCalledTimes(1);

  act(() => {
    wrapper.root.findAllByType(HistoryItem)[0].props.onDelete('user-to-delete');
  });

  expect(mockDispatchFn).toBeCalledTimes(1);
  expect(mockDispatchFn).toBeCalledWith({ type: types.REMOVE_USER_HISTORY, payload: 'user-to-delete' });

  act(() => {
    wrapper.root.findAllByType(SearchHistoryHeader)[0].props.onClear();
  });

  expect(mockDispatchFn).toBeCalledWith({ type: types.CLEAR_USER_HISTORY });

  useDispatchSpy.mockClear();
});

it('renders SearchUsers results', async () => {
  let wrapper;
  await act(async () => {
    const { wrapper: asyncWrapper } = await givenSearchUsers({
      searchQuery: ' bruno ',
    });
    wrapper = asyncWrapper;
  });

  expect(wrapper.toJSON()).toMatchSnapshot();
  expect(wrapper.root.findAllByType(SearchResult).length).toBe(2);
});

it('renders SearchUsers empty results', async () => {
  let wrapper;
  await act(async () => {
    const { wrapper: asyncWrapper } = await givenSearchUsers({
      searchQuery: 'Kebetoo',
    });
    wrapper = asyncWrapper;
  });

  expect(wrapper.root.findAllByType(SearchResult).length).toBe(0);
  expect(wrapper.root.findAllByType(NoResult).length).toBe(1);
});

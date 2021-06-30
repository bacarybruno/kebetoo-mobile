import { api } from '@app/shared/services';

import * as users from '../users';

beforeEach(jest.clearAllMocks);

it('creates user', async () => {
  const userData = { id: 'uid', displayName: 'user-1', photoURL: 'jest://kebetoo/user-1.png' };
  api.authors.getByUid.mockResolvedValue([]);
  await users.createOrUpdateUser(userData);
  expect(api.authors.create).toBeCalledTimes(1);
  expect(api.authors.create).toBeCalledWith({
    uid: userData.id,
    displayName: userData.displayName,
    photoURL: userData.photoURL,
  });
});


it('updates user', async () => {
  const author = {
    id: 'author-0',
  };
  const userData = { displayName: 'user-1', photoURL: 'jest://kebetoo/user-1.png' };
  api.authors.getByUid.mockResolvedValue([author]);
  const result = await users.createOrUpdateUser(userData);
  expect(api.authors.update).toBeCalledTimes(1);
  expect(api.authors.update).toBeCalledWith(author.id, userData);
  expect(result.id).toBe(author.id);
});

it('gets notification token', async () => {
  const token = await users.getNotificationToken();
  expect(token).not.toBeNull();
});

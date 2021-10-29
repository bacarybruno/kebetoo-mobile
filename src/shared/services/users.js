import messaging from '@react-native-firebase/messaging';

import { api } from '@app/shared/services';

export const getUser = async (uid) => {
  const [author] = await api.authors.getByUid(uid);
  return author;
};

export const createOrUpdateUser = async ({ id, displayName, photoURL }) => {
  let author = await getUser(id);
  if (author) {
    await api.authors.update(author.id, { displayName, photoURL });
  } else {
    author = await api.authors.create({ uid: id, displayName, photoURL });
  }
  return author;
};

export const getNotificationToken = async () => {
  if (messaging().isDeviceRegisteredForRemoteMessages) {
    const token = await messaging().getToken();
    return token;
  }
  return null;
};

export const getUsers = (ids) => api.authors.batchGetById(ids);

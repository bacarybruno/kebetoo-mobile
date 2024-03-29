import { useEffect, useState, useCallback } from 'react';
import { View, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Ionicon from 'react-native-vector-icons/Ionicons';

import { api } from '@app/shared/services';
import { NoContent, Typography } from '@app/shared/components';
import BasicPost from '@app/features/post/containers/basic-post';
import * as types from '@app/redux/types';
import { recentSearchHistory } from '@app/redux/selectors';
import { strings } from '@app/config';
import { useAppColors, useAppStyles, usePosts } from '@app/shared/hooks';
import HistoryItem from '@app/features/search/components/history-item';
import NoResult from '@app/features/search/components/no-result';

import createThemedStyles from './styles';

export const SearchHistoryHeader = ({ onClear }) => {
  const styles = useAppStyles(createThemedStyles);
  const { colors } = useAppColors();
  return (
    <View style={[styles.historyHeader, styles.paddingHorizontal]}>
      <View style={styles.container}>
        <Ionicon name="md-time" size={18} style={styles.icon} color={colors.textPrimary} />
        <Typography
          type={Typography.types.subheading}
          systemWeight={Typography.weights.semibold}
          systemColor={Typography.colors.tertiary}
          style={styles.sectionHeader}
          text={strings.search.recent_searches}
        />
      </View>
      <Typography
        type={Typography.types.textButton}
        style={[styles.sectionHeader, styles.sectionHeaderLink]}
        onPress={onClear}
        text={strings.search.clear_all}
      />
    </View>
  );
};

const SearchPosts = ({ searchQuery, onSearch, onRecentSearch }) => {
  const [posts, setPosts] = useState([]);
  const [authors, setAuthors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const styles = useAppStyles(createThemedStyles);

  const { posts: postsHistory } = useSelector(recentSearchHistory);
  const dispatch = useDispatch();

  const { getRepostAuthors } = usePosts();

  useEffect(() => {
    const query = searchQuery.trim();
    if (query.length > 0) {
      setIsLoading(true);
      api.posts.search(query)
        .then((data) => {
          setPosts(data);
          dispatch({ type: types.ADD_POST_HISTORY, payload: query });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setPosts([]);
    }
  }, [dispatch, onSearch, searchQuery]);

  useEffect(() => {
    onSearch(isLoading);
  }, [isLoading, onSearch]);

  useEffect(() => {
    const fetchRepostAuthors = async () => {
      const data = await getRepostAuthors(posts);
      setAuthors(data);
    };
    fetchRepostAuthors();
  }, [posts, getRepostAuthors]);

  const createKey = useCallback((item, index) => `basic-post-${item.id}-${index}`, []);

  const renderBasicPost = useCallback(({ item }) => (
    <BasicPost
      post={item}
      author={item.author}
      originalAuthor={
        item.repost
          ? authors[item.repost.author]
          : item.author
      }
    />
  ), [authors]);

  const renderSearchResultsHeader = useCallback(() => (
    <Typography
      type={Typography.types.subheading}
      systemWeight={Typography.weights.semibold}
      systemColor={Typography.colors.tertiary}
      style={styles.sectionHeader}
      text={strings.search.results}
    />
  ), [styles.sectionHeader]);

  const onClearAllRecentSearches = useCallback(() => {
    dispatch({ type: types.CLEAR_POST_HISTORY });
  }, [dispatch]);

  const onClearRecentSearch = useCallback((payload) => {
    dispatch({ type: types.REMOVE_POST_HISTORY, payload });
  }, [dispatch]);

  const renderSearchHistoryHeader = useCallback(() => (
    <SearchHistoryHeader onClear={onClearAllRecentSearches} />
  ), [onClearAllRecentSearches]);

  const renderSearchHistory = useCallback(({ item }) => (
    <HistoryItem onPress={onRecentSearch} onDelete={onClearRecentSearch} item={item} />
  ), [onClearRecentSearch, onRecentSearch]);

  return (
    <View style={styles.wrapper}>
      {searchQuery.length === 0 && (
        <FlatList
          data={postsHistory}
          contentContainerStyle={styles.flatlistContent}
          keyExtractor={createKey}
          ListHeaderComponent={renderSearchHistoryHeader}
          renderItem={renderSearchHistory}
          removeClippedSubviews
        />
      )}
      {posts.length === 0 && searchQuery.length > 0 && !isLoading && (
        <NoResult query={searchQuery} />
      )}
      {posts.length === 0 && postsHistory.length === 0 && (
        <View style={styles.noContent}>
          <NoContent text={strings.search.no_content} title={strings.general.no_content} />
        </View>
      )}
      {posts.length > 0 && (
        <FlatList
          data={posts}
          contentContainerStyle={[styles.flatlistContent, styles.paddingHorizontal]}
          keyExtractor={createKey}
          ListHeaderComponent={renderSearchResultsHeader}
          renderItem={renderBasicPost}
          removeClippedSubviews
        />
      )}
    </View>
  );
};

export default SearchPosts;

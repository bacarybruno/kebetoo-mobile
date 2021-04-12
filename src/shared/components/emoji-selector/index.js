import { memo, useCallback, useRef, useState } from 'react'
import { FlatList, View, Text } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import rawEmojis from 'emoji-datasource'
import { KeyboardRegistry } from 'react-native-ui-lib/keyboard'

import { metrics } from '@app/theme'
import { ADD_EMOJI_HISTORY } from '@app/redux/types'
import { emojiHistorySelector } from '@app/redux/selectors'
import { useAppStyles } from '@app/shared/hooks'

import categories, { categoryNames, categoryIcons } from './categories'
import helpers from './helpers'
import createThemedStyles, { numColumns, emojiSize } from './styles'
import Pressable from '../buttons/pressable'

export const keyboardName = 'EmojiKeyboard'

export const emojisByCategory = helpers.groupByCategory(
  rawEmojis
    .filter(helpers.filterSupported)
    .sort(helpers.sortByCategoryAndOrder)
    .map(helpers.mapEmojis),
)

export const Emoji = memo(({ item, onPress }) => {
  const styles = useAppStyles(createThemedStyles)
  return (
    <Pressable style={styles.emoji} onPress={() => onPress(item)}>
      <Text style={styles.emojiSymbol}>{item}</Text>
    </Pressable>
  )
}, () => true)

export const EmojiTab = memo(({
  item, active, onPress, ...otherProps
}) => {
  const styles = useAppStyles(createThemedStyles)
  return (
    <Pressable style={[styles.tab, active && styles.activeTab]} onPress={onPress} {...otherProps}>
      <Text style={styles.tabEmojiSymbol}>{item}</Text>
    </Pressable>
  )
}, (prevProps, nextProps) => prevProps.active === nextProps.active)


export const EmojisTabs = memo(({ items, activeTab, onTabPress }) => {
  const styles = useAppStyles(createThemedStyles)
  return (
    <View style={styles.emojiTabs}>
      {items.map((item, index) => (
        <EmojiTab
          testID={`emoji-tab-${index}`}
          key={`emoji-tab-${index}`}
          onPress={() => onTabPress(index)}
          item={item}
          active={index === activeTab}
        />
      ))}
    </View>
  )
})

const EmptyEmojiTabContent = memo(() => {
  const styles = useAppStyles(createThemedStyles)
  return <View style={styles.tabContent} />
})

const EmojiSelector = ({ onSelectItem, style }) => {
  const historyItems = useSelector(emojiHistorySelector)
  const flatlistRef = useRef(null)
  const dispatch = useDispatch()

  const styles = useAppStyles(createThemedStyles)

  const defaultActiveTab = historyItems.length > 0 ? 0 : 1
  const [activeTab, setActiveTab] = useState((state) => state || defaultActiveTab)

  const emojiListKeyExtractor = useCallback((item, index) => `emoji-list-${item}-${index}`, [])

  const emojiItemsKeyExtractor = useCallback((item, index) => `emoji-item-${item}-${index}`, [])

  const getEmojiListLayout = useCallback((_, index) => ({
    length: metrics.screenWidth, offset: metrics.screenWidth * index, index,
  }), [])

  const getEmojiItemsLayout = useCallback((_, index) => ({
    length: emojiSize, offset: emojiSize * index, index,
  }), [])

  const onChangeActiveTab = useCallback((index) => {
    setActiveTab(index)
    flatlistRef.current.scrollToIndex({ animated: true, index })
  }, [])

  const onScrollEnd = useCallback((event) => {
    const { contentOffset } = event.nativeEvent
    const pageNum = Math.floor(Math.round(contentOffset.x) / metrics.screenWidth)
    setActiveTab(pageNum)
  }, [])

  const onSelectEmoji = useCallback((item) => {
    KeyboardRegistry.onItemSelected(keyboardName, item)
    dispatch({ type: ADD_EMOJI_HISTORY, payload: item })
    onSelectItem(item)
  }, [dispatch, onSelectItem])

  const renderEmoji = useCallback(({ item }) => (
    <Emoji item={item.symbol} onPress={onSelectEmoji} />
  ), [onSelectEmoji])

  const renderEmojis = useCallback(({ item }) => (
    <FlatList
      horizontal={false}
      removeClippedSubviews
      numColumns={numColumns}
      windowSize={numColumns}
      renderItem={renderEmoji}
      getItemLayout={getEmojiItemsLayout}
      keyboardShouldPersistTaps="handled"
      keyExtractor={emojiItemsKeyExtractor}
      columnWrapperStyle={styles.tabContent}
      ListEmptyComponent={EmptyEmojiTabContent}
      data={item === categories.history.name ? historyItems : emojisByCategory[item]}
    />
  ), [renderEmoji, getEmojiItemsLayout, emojiItemsKeyExtractor, styles.tabContent, historyItems])

  return (
    <View style={[styles.wrapper, style]}>
      <EmojisTabs
        items={categoryIcons}
        activeTab={activeTab}
        onTabPress={onChangeActiveTab}
      />
      <FlatList
        horizontal
        pagingEnabled
        ref={flatlistRef}
        testID="emoji-list"
        data={categoryNames}
        removeClippedSubviews
        initialNumToRender={1}
        renderItem={renderEmojis}
        initialScrollIndex={activeTab}
        onMomentumScrollEnd={onScrollEnd}
        getItemLayout={getEmojiListLayout}
        keyboardShouldPersistTaps="handled"
        keyExtractor={emojiListKeyExtractor}
        windowSize={Math.ceil(numColumns / 3)}
      />
    </View>
  )
}

EmojiSelector.defaultProps = {
  onSelectItem: () => { },
  height: 250,
}

export default memo(EmojiSelector)

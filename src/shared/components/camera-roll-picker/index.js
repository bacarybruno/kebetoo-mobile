import {
  memo, useCallback, useEffect, useLayoutEffect, useMemo, useState,
} from 'react'
import {
  FlatList, Image, Platform, View, Animated,
} from 'react-native'
import { useRoute } from '@react-navigation/native'
import { useHeaderHeight } from '@react-navigation/stack'
import Ionicon from 'react-native-vector-icons/Ionicons'
import CameraRoll from '@react-native-community/cameraroll'
import RNCameraRollPicker from '@kebetoo/camera-roll-picker'
import ActionButton from 'react-native-action-button'
import ImageCropPicker from 'react-native-image-crop-picker'
import RNConvertPhAsset from 'react-native-convert-ph-asset'

import { useAppColors, useAppStyles } from '@app/shared/hooks'
import { elevation, metrics } from '@app/theme'
import { strings } from '@app/config'
import { rgbaToHex } from '@app/theme/colors'
import iosColors from '@app/theme/ios-colors'
import { getMimeType } from '@app/shared/helpers/file'

import createThemedStyles from './styles'
import HeaderBack from '../header-back'
import { Pressable, Typography } from '../index'

const AssetTypes = {
  Photos: 'Photos',
  Videos: 'Videos',
  All: 'All',
}

const routeOptions = (title, colors) => ({
  title,
  headerShown: true,
  headerBackImage: () => (
    <HeaderBack.Close tintColor={colors.textPrimary} />
  ),
  headerStyle: {
    backgroundColor: colors.background,
  },
})

const isVideo = (type) => type.startsWith('video')

const ImagePreview = memo(({ item }) => {
  const styles = useAppStyles(createThemedStyles)
  return (
    <>
      <Image source={{ uri: item.preview }} style={styles.preview} />
      <View style={styles.previewDesc}>
        <Typography
          type={Typography.types.body}
          text={item.title}
          color={Typography.colors.primary}
        />
        {item.count > 0 && (
          <Typography
            type={Typography.types.caption}
            text={item.count}
            color={Typography.colors.tertiary}
          />
        )}
      </View>
    </>
  )
})

const Albums = memo(({ previews, onSelect }) => {
  const numColumns = 2
  const imageMargin = metrics.spacing.xs
  const itemSize = (metrics.screenWidth - (numColumns - 1) * imageMargin) / numColumns

  const { colors } = useAppColors()
  const styles = useAppStyles(createThemedStyles)

  const pressableStyle = useMemo(() => ({
    flexDirection: 'column',
    height: itemSize,
    width: itemSize,
    marginBottom: imageMargin,
    backgroundColor: colors.backgroundSecondary,
    ...elevation(3),
  }), [colors.backgroundSecondary, imageMargin, itemSize])

  const renderItem = useCallback(({ item }) => (
    <Pressable testID={item.title} onPress={() => onSelect(item)} style={pressableStyle}>
      <ImagePreview item={item} />
    </Pressable>
  ), [onSelect, pressableStyle])

  const keyExtractor = useCallback((item, index) => item.preview + index, [])

  return (
    <FlatList
      renderItem={renderItem}
      data={previews}
      numColumns={numColumns}
      keyExtractor={keyExtractor}
      columnWrapperStyle={styles.flatlistColumn}
      contentContainerStyle={styles.albumsContent}
    />
  )
})

const headerTitles = {
  [AssetTypes.Videos]: strings.create_post.all_videos,
  [AssetTypes.Photos]: strings.create_post.all_photos,
  [AssetTypes.All]: strings.create_post.all_videos,
}

export const VideoMarker = ({ style }) => (
  <Ionicon
    name={Platform.select({ android: 'md-videocam', ios: 'md-videocam' })}
    size={15}
    color={iosColors.systemGrey4.light}
    style={style}
  />
)

const CameraRollPicker = ({ navigation }) => {
  const styles = useAppStyles(createThemedStyles)
  const { colors } = useAppColors()

  const groupTypes = 'All'

  const cropperThemeOptions = useMemo(() => ({
    cropperActiveWidgetColor: rgbaToHex(colors.pink),
    cropperStatusBarColor: rgbaToHex(iosColors.secondarySystemBackground.dark),
    cropperToolbarColor: rgbaToHex(colors.backgroundSecondary),
    cropperToolbarWidgetColor: rgbaToHex(colors.textPrimary),
    cropperToolbarTitle: strings.create_post.edit_photo,
    cropperCancelText: strings.general.cancel,
    cropperChooseText: strings.general.confirm,
    compressImageQuality: 1,
    ...Platform.select({
      ios: {
        width: 1200,
        height: 1500,
      },
      default: {},
    }),
    enableRotationGesture: true,
  }), [colors])

  const [selected, setSelected] = useState([])
  const [groupName, setGroupName] = useState()
  const [pageTitle, setPageTitle] = useState()
  const [previews, setPreviews] = useState({})
  const [modalVisible, setModalVisible] = useState(false)
  const headerHeight = useHeaderHeight()
  const { params } = useRoute()

  const { assetType = AssetTypes.All, maximum = 1, onSelectedItem: onSubmit } = params

  const viewport = metrics.screenHeight - headerHeight
  const [modalPosition] = useState(new Animated.Value(-viewport))
  const [includeFields] = useState(['playableDuration'])

  useEffect(() => {
    const title = headerTitles[assetType]
    setPageTitle(title)
    navigation.setOptions(routeOptions(title, colors))
  }, [colors, navigation, assetType])

  useEffect(() => {
    const getAlbums = async () => {
      const fetchPreview = async (album) => {
        const photos = await CameraRoll.getPhotos({ first: 1, groupName: album.value, groupTypes })
        return {
          ...album,
          preview: photos.edges[0].node.image.uri,
        }
      }

      let albums = await CameraRoll.getAlbums({ assetType })
      albums = albums.map((album) => ({ ...album, value: album.title }))
      const totalCount = albums.reduce((acc, curr) => acc + curr.count, 0)
      albums.unshift({ title: headerTitles[assetType], value: undefined, count: totalCount })
      const promises = albums.map(fetchPreview)
      const results = await Promise.all(promises)
      setPreviews(results)
    }

    getAlbums()
  }, [groupName, assetType])

  const toggleModalPicker = useCallback((title) => {
    let toValue = 0
    if (modalVisible) {
      setModalVisible(false)
      toValue = -viewport
      navigation.setOptions({ title: title || pageTitle })
    } else {
      setModalVisible(true)
      navigation.setOptions({ title: strings.create_post.albums })
      toValue = 0
    }
    Animated.timing(modalPosition, { toValue, useNativeDriver: false }).start()
  }, [viewport, modalPosition, modalVisible, navigation, pageTitle])

  const onSelectedItem = useCallback(async (items, item) => {
    setSelected([...items])
    if (maximum === 1) {
      setSelected([])
      try {
        let payload = {}
        if (isVideo(item.type)) {
          let videoUri = item.uri
          if (Platform.OS === 'ios' && videoUri.startsWith('ph://')) {
            // received video is a ph asset
            // we should convert it back to mp4
            const converted = await RNConvertPhAsset.convertVideoFromUrl({
              url: videoUri,
              convertTo: 'mpeg4',
              quality: 'medium',
            })
            videoUri = converted.path.replace('file://', '')
          }
          // videos does not need image crop picker
          payload = {
            uri: videoUri,
            originalUri: item.uri,
            type: getMimeType(videoUri),
            duration: item.playableDuration,
          }
        } else {
          const croppedImage = await ImageCropPicker.openCropper({
            path: item.uri,
            ...cropperThemeOptions,
          })
          payload = { uri: croppedImage.path, type: croppedImage.mime }
        }
        onSubmit(payload)
        navigation.goBack()
      } catch (error) {
        console.log(error)
        onSubmit(null)
      }
    }
  }, [maximum, navigation, onSubmit, cropperThemeOptions])

  const onShowCamera = useCallback(async () => {
    const mediaTypes = {
      [AssetTypes.Videos]: 'video',
      [AssetTypes.Photos]: 'photos',
      [AssetTypes.All]: 'any',
    }
    try {
      const videoRecord = await ImageCropPicker.openCamera({
        cropping: assetType === AssetTypes.Photos,
        mediaType: mediaTypes[assetType],
        ...cropperThemeOptions,
      })
      onSubmit({
        uri: videoRecord.path,
        type: videoRecord.mime,
        duration: videoRecord.duration / 1000,
      })
      navigation.goBack()
    } catch (error) {
      console.log(error)
      onSubmit(null)
    }
  }, [assetType, navigation, onSubmit, cropperThemeOptions])

  const submitSelection = useCallback(() => {
    // TODO: map selected values to only send uri and path
    onSubmit(selected)
    navigation.goBack()
  }, [navigation, selected, onSubmit])

  useLayoutEffect(() => {
    let iconName = 'chevron-down'
    if (modalVisible) iconName = 'chevron-up'
    else if (selected.length > 0) iconName = 'md-send'

    const onPress = selected.length > 0 ? submitSelection : toggleModalPicker

    navigation.setOptions({
      headerRight: () => (
        <Pressable borderless foreground onPress={() => onPress()}>
          <Ionicon
            name={iconName}
            size={25}
            color={colors.textPrimary}
            style={styles.saveButton}
          />
        </Pressable>
      ),
    })
  }, [colors, modalVisible, navigation, toggleModalPicker, styles, selected, submitSelection])

  const onSelectAlbum = useCallback((album) => {
    setGroupName(album.value)
    const title = album.title + (album.count > 0 ? ` (${album.count})` : '')
    setPageTitle(title)
    toggleModalPicker(title)
  }, [toggleModalPicker])

  const SelectedMarker = useMemo(() => (
    <Ionicon
      size={25}
      color={colors.primary}
      name={Platform.select({ android: 'md-checkmark-circle', ios: 'ios-checkmark-circle' })}
    />
  ), [colors.primary])

  const VideoMarkerIcon = useMemo(() => (
    <VideoMarker />
  ), [])

  const renderFABIcon = useCallback(() => {
    const icons = {
      [AssetTypes.Videos]: { name: 'ios-videocam', size: 30 },
      [AssetTypes.Photos]: { name: 'md-camera', size: 30 },
    }
    return (
      <Ionicon
        size={icons[assetType].size}
        color={colors.white}
        name={icons[assetType].name}
      />
    )
  }, [assetType, colors.white])

  return (
    <>
      <View style={styles.wrapper} key={groupName}>
        <RNCameraRollPicker
          maximum={maximum}
          callback={onSelectedItem}
          assetType={assetType}
          groupTypes={groupTypes}
          groupName={groupName}
          selected={selected}
          loaderColor={colors.textPrimary}
          backgroundColor={colors.background}
          emptyText={strings.create_post.album_empty}
          emptyTextStyle={styles.emptyText}
          selectedMarker={SelectedMarker}
          videoMarker={VideoMarkerIcon}
          include={includeFields}
        />
        <Animated.View style={[styles.modal, { marginTop: modalPosition, height: viewport }]}>
          <Albums previews={previews} onSelect={onSelectAlbum} />
        </Animated.View>
        {[AssetTypes.Photos, AssetTypes.Videos].includes(assetType) && (
          <ActionButton
            buttonColor={colors.primary}
            onPress={onShowCamera}
            buttonTextStyle={styles.fab}
            offsetX={0}
            position="center"
            renderIcon={renderFABIcon}
            fixNativeFeedbackRadius
          />
        )}
      </View>
    </>
  )
}

CameraRollPicker.AssetTypes = AssetTypes

export default CameraRollPicker

import { useCallback, useEffect, useState } from 'react';
import {
  View, Image, StatusBar, TouchableWithoutFeedback,
} from 'react-native';
import { TransitionPresets } from '@react-navigation/stack';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import ImageZoom from 'react-native-image-pan-zoom';

import { metrics } from '@app/theme';
import { HeaderBack } from '@app/shared/components';
import { useAppColors, useAppStyles } from '@app/shared/hooks';
import { rgbaToHex } from '@app/theme/colors';

import createThemedStyles from './styles';

export const routeOptions = (colors) => ({
  title: '',
  headerShown: true,
  headerBackImage: () => (
    <HeaderBack tintColor={colors.white} />
  ),
  headerTransparent: true,
  ...TransitionPresets.ScaleFromCenterAndroid,
});

const isGoogleImageUrl = (url) => url.includes('googleusercontent.com');

const ImageModal = ({ route, navigation }) => {
  const styles = useAppStyles(createThemedStyles);
  const { colors, resetAppBars } = useAppColors();
  navigation.setOptions(routeOptions(colors));

  const [controlsHidden, setControlsHidden] = useState(true);

  const { source, width, height } = route.params;
  const [dimensions, setDimensions] = useState({ width, height });
  const [aspectRatio, setAspectRatio] = useState(parseInt(width, 10) / parseInt(height, 10));
  const sourceUri = isGoogleImageUrl(source.uri) ? source.uri.replace('s96-c', 's400-c') : source.uri;

  const showControls = useCallback(() => {
    StatusBar.setBarStyle('light-content', true);
  }, []);

  const hideControls = useCallback(() => {
    StatusBar.setBackgroundColor(colors.black);
    StatusBar.setBarStyle('dark-content', true);
    changeNavigationBarColor(rgbaToHex(colors.black));
  }, [colors.black]);

  const onShowControls = useCallback(() => {
    if (controlsHidden) {
      showControls();
    } else {
      hideControls();
    }
    setControlsHidden((state) => !state);
  }, [controlsHidden, hideControls, showControls]);

  useEffect(() => {
    hideControls();
  }, [hideControls]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => resetAppBars, []);

  useEffect(() => {
    if (Number.isNaN(aspectRatio)) {
      Image.getSize(sourceUri, (w, h) => {
        // set aspect ratio based on react native image size
        setDimensions({ width: w, height: h });
        setAspectRatio(w / h);
      }, () => {
        // on error
        setAspectRatio(0);
      });
    }
  }, [aspectRatio, sourceUri]);

  let imageHeight = (dimensions.height * metrics.screenWidth) / dimensions.width;
  if (Number.isNaN(imageHeight)) {
    imageHeight = metrics.screenHeight;
  }
  return (
    <TouchableWithoutFeedback onPress={onShowControls} testID="pressable">
      <View style={styles.wrapper}>
        <ImageZoom
          cropWidth={metrics.screenWidth}
          cropHeight={metrics.screenHeight}
          imageWidth={metrics.screenWidth}
          imageHeight={imageHeight}
        >
          <Image
            source={{ uri: sourceUri }}
            style={{ aspectRatio: aspectRatio || metrics.aspectRatio.vertical }}
          />
        </ImageZoom>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ImageModal;

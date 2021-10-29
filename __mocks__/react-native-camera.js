import { View } from 'react-native';

const Camera = ({ ...props }) => (
  <View key="react-native-camera" {...props} />
);

Camera.Constants = {
  VideoQuality: {
    '480p': 'VideoQuality.480p',
  },
  VideoCodec: {
    H264: 'VideoCodec.H264',
  },
  Type: {
    front: 'Type.front',
    back: 'Type.back',
  },
  FlashMode: {
    on: 'FlashMode.on',
    off: 'FlashMode.off',
    torch: 'FlashMode.torch',
    auto: 'FlashMode.auto',
  },
};

module.exports = {
  RNCamera: Camera,
};

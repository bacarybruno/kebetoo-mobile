export const VideoModes = {
  Normal: 'Normal',
  Boomerang: 'Boomerang',
  Reverse: 'Reverse',
  Slowmo: 'Slowmo',
};

export const initialState = {
  videoIndex: 0,
  mergedVideo: null,
  processing: false,
  boomerangVideo: null,
  reversedVideo: null,
  slowMoVideo: null,
  videoMode: VideoModes.Normal,
  showActions: true,
  stickers: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'setVideoIndex':
      return { ...state, videoIndex: action.payload };
    case 'setMergedVideo':
      return { ...state, mergedVideo: action.payload };
    case 'setProcessing':
      return { ...state, processing: action.payload };
    case 'setBoomerangVideo':
      return { ...state, boomerangVideo: action.payload };
    case 'setReversedVideo':
      return { ...state, reversedVideo: action.payload };
    case 'setSlowMoVideo':
      return { ...state, slowMoVideo: action.payload };
    case 'setVideoMode':
      return { ...state, videoMode: action.payload };
    case 'setShowActions':
      return { ...state, showActions: action.payload };
    case 'setStickers':
      return { ...state, stickers: action.payload };
    default:
      return state;
  }
};

export default reducer;

/* eslint-disable no-case-declarations */
const maxVideoDurationInSeconds = 15

export const initialState = {
  flashOn: false,
  frontCamera: true,
  mute: false,
  speed: 1,
  elapsedTime: 0,
  isRecording: false,
  preparing: false,
  progress: 0,
  records: [],
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'toggleFlash':
      return { ...state, flashOn: !state.flashOn }
    case 'flipCamera':
      return { ...state, frontCamera: !state.frontCamera }
    case 'toggleMute':
      return { ...state, mute: !state.mute }
    case 'setSpeed':
      return { ...state, speed: action.payload }
    case 'incElapsedTime':
      const elapsedTime = state.elapsedTime + action.payload
      const progress = elapsedTime / maxVideoDurationInSeconds
      return {
        ...state,
        elapsedTime,
        progress,
      }
    case 'resetElapsedTime':
      return { ...state, elapsedTime: 0 }
    case 'setIsRecording':
      return { ...state, isRecording: action.payload }
    case 'setProgress':
      return { ...state, progress: action.payload }
    case 'addRecord':
      return { ...state, records: state.records.concat(action.payload) }
    case 'updateRecord':
      return {
        ...state,
        records: state.records.map((record) => {
          if (record.recordedAt === action.payload.recordedAt) {
            return { ...record, ...action.payload }
          }
          return record
        }),
      }
    case 'resetRecords':
      return { ...state, records: [] }
    case 'endRecord':
      return { ...state, isRecording: false, flashOn: false }
    case 'reset':
      return initialState
    case 'startPreparing':
      return { ...state, preparing: true }
    case 'finishPreparing':
      return { ...state, preparing: false }
    default:
      return state
  }
}

export default reducer

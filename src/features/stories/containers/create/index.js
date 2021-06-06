
import { useEffect, useState } from 'react'
import { BackHandler } from 'react-native'

import { strings } from '@app/config'

import StoryPreview from '../preview'
import StoryDesigner from '../designer'

const routeOptions = { title: strings.tabs.stories }

const CreateStoryPage = ({
  onGoBack,
  isFocused,
  pickedFile,
  pickVideoFile,
  resetVideoFile,
  onFinish,
}) => {
  if (!isFocused) return null

  const [records, setRecords] = useState([])
  const [finishRecording, setFinishRecording] = useState(false)

  const onRecordVideoFinish = (videos) => {
    setRecords(videos)
    setFinishRecording(true)
  }

  useEffect(() => {
    const onGoBackHandler = () => {
      onGoBack()
      return true
    }

    if (isFocused) {
      BackHandler.addEventListener('hardwareBackPress', onGoBackHandler)
    }

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onGoBackHandler)
    }
  }, [isFocused])

  

  if (finishRecording) {
    return (
      <StoryPreview
        records={records}
        onGoBack={() => setFinishRecording(false)}
        onFinish={onFinish}
      />
    )
  }

  return (
    <StoryDesigner
      onFinish={onRecordVideoFinish}
      onGoBack={onGoBack}
      pickVideoFile={pickVideoFile}
      pickedVideoFile={pickedFile}
      resetVideoFile={resetVideoFile}
    />
  )
}

CreateStoryPage.routeOptions = routeOptions

export default CreateStoryPage

import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { render, act } from 'react-native-testing-library'
import RNFetchBlob from 'rn-fetch-blob'

import routes from '@app/navigation/routes'
import { CameraRollPicker } from '@app/shared/components'

import useFilePicker from '../file-picker'

beforeEach(jest.clearAllMocks)

const createImagePicker = (...props) => {
  const returnVal = {}
  const TestComponent = () => {
    Object.assign(returnVal, useFilePicker(...props))
    return null
  }
  render(<TestComponent />)
  return returnVal
}

it('is defined', () => {
  const imagePicker = createImagePicker()
  // props
  expect(imagePicker.file).toBeDefined()
  expect(imagePicker.hasFile).toBeDefined()
  // mutators
  expect(imagePicker.pickImage).toBeDefined()
  expect(imagePicker.reset).toBeDefined()
  expect(imagePicker.savePost).toBeDefined()
})

describe('mutators', () => {
  it('picks image', async () => {
    const imagePicker = createImagePicker()
    const fileData = { uri: 'jest://selected-file.png' }
    useNavigation().navigate.mockImplementation((route, params) => {
      params.onSelectedItem(fileData)
    })
    await act(async () => {
      await imagePicker.pickImage()
    })
    expect(useNavigation().navigate).toBeCalledTimes(1)
    expect(useNavigation().navigate).toBeCalledWith(routes.CAMERA_ROLL_PICKER, {
      assetType: CameraRollPicker.AssetTypes.Photos,
      onSelectedItem: expect.any(Function),
    })
    expect(imagePicker.file).toEqual(fileData)
  })
  it('picks video', async () => {
    const imagePicker = createImagePicker()
    const fileData = { uri: 'jest://selected-video.mp4' }
    useNavigation().navigate.mockImplementation((route, params) => {
      params.onSelectedItem(fileData)
    })
    await act(async () => {
      await imagePicker.pickVideo()
    })
    expect(useNavigation().navigate).toBeCalledTimes(1)
    expect(useNavigation().navigate).toBeCalledWith(routes.CAMERA_ROLL_PICKER, {
      assetType: CameraRollPicker.AssetTypes.Videos,
      onSelectedItem: expect.any(Function),
    })
    expect(imagePicker.file).toEqual(fileData)
  })
  it('fails picking image', async () => {
    const imagePicker = createImagePicker()
    useNavigation().navigate.mockImplementation((route, params) => {
      params.onSelectedItem(null)
    })
    await act(async () => {
      await imagePicker.pickImage()
    })
    expect(useNavigation().navigate).toBeCalledTimes(1)
    expect(useNavigation().navigate).toBeCalledWith(routes.CAMERA_ROLL_PICKER, {
      assetType: CameraRollPicker.AssetTypes.Photos,
      onSelectedItem: expect.any(Function),
    })
    expect(imagePicker.file).toBeNull()
  })
  it('fails picking video', async () => {
    const imagePicker = createImagePicker()
    useNavigation().navigate.mockImplementation((route, params) => {
      params.onSelectedItem(null)
    })
    await act(async () => {
      await imagePicker.pickVideo()
    })
    expect(useNavigation().navigate).toBeCalledTimes(1)
    expect(useNavigation().navigate).toBeCalledWith(routes.CAMERA_ROLL_PICKER, {
      assetType: CameraRollPicker.AssetTypes.Videos,
      onSelectedItem: expect.any(Function),
    })
    expect(imagePicker.file).toBeNull()
  })
  it('resets image picker', async () => {
    const path = 'file://image-picker/shared-file.png'
    const imagePicker = createImagePicker(path)
    expect(imagePicker.file).not.toBeNull()
    await act(async () => {
      await imagePicker.reset()
    })
    expect(RNFetchBlob.fs.unlink).toBeCalledTimes(1)
    expect(RNFetchBlob.fs.unlink).toBeCalledWith(path)
    expect(imagePicker.file).toBeNull()
  })
})

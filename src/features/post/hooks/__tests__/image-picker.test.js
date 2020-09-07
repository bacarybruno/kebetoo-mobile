import React from 'react'
import { render, act } from 'react-native-testing-library'
import RNFetchBlob from 'rn-fetch-blob'
import ImagePicker from 'react-native-image-picker'

import useImagePicker from '../image-picker'

const createImagePicker = (...props) => {
  const returnVal = {}
  const TestComponent = () => {
    Object.assign(returnVal, useImagePicker(...props))
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
    await act(async () => {
      await imagePicker.pickImage()
    })
    expect(imagePicker.file).not.toBeNull()
  })
  it('fails picking image', async () => {
    const imagePicker = createImagePicker()
    ImagePicker.launchImageLibrary = jest.fn().mockImplementation((config, cb) => {
      cb({ didCancel: true, error: 'cancelled' })
    })
    await act(async () => {
      await imagePicker.pickImage()
    })
    expect(imagePicker.file).toBeNull()
  })
  it('resets image picker', async () => {
    const path = 'jest://image-picker/shared-file.png'
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

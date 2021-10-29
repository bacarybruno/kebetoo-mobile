import { fireEvent } from 'react-native-testing-library';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { ActivityIndicator } from 'react-native';

import setupTest from '@app/config/jest-setup';
import { readableSeconds } from '@app/shared/helpers/dates';

import AudioPlayer, { PlayButton, DeleteIconButton } from '../index';

jest.useFakeTimers();

const givenAudioPlayer = setupTest(AudioPlayer)({
  source: 'http://localhost:1337/uploads/PTT_20200618_4_77ef44ec7b.mp3',
  style: {
    height: 20,
  },
});

it('renders AudioPlayer', () => {
  const { wrapper } = givenAudioPlayer();
  expect(wrapper.toJSON()).toMatchSnapshot();
});

it('renders AudioPlayer with delete icon', () => {
  const { wrapper } = givenAudioPlayer({
    onDelete: jest.fn(),
  });
  expect(wrapper.toJSON()).toMatchSnapshot();
});

it('renders round AudioPlayer', () => {
  const { wrapper } = givenAudioPlayer({
    round: true,
  });
  expect(wrapper.toJSON()).toMatchSnapshot();
});

describe('player states', () => {
  it('shows default state on render', () => {
    const { wrapper } = givenAudioPlayer();
    expect(wrapper.root.findByProps({ text: readableSeconds(0) })).toBeTruthy();
    expect(wrapper.root.findByProps({ testID: 'progress' }).props.style).toMatchObject({ width: '0%' });
    expect(wrapper.root.findByType(Ionicon).props.name).toBe('ios-play');
  });
  it('initialize player', () => {
    const { wrapper } = givenAudioPlayer();
    fireEvent.press(wrapper.root.findByType(PlayButton));
    wrapper.root.findByProps({ testID: 'audio-player' }).props.onLoadStart();
    expect(wrapper.root.findAllByType(ActivityIndicator).length).toBe(1);
  });
  it('play pause audio', () => {
    const { wrapper } = givenAudioPlayer();
    fireEvent.press(wrapper.root.findByType(PlayButton));
    expect(wrapper.root.findByProps({ testID: 'audio-player' }).props.paused).toBe(false);
    expect(wrapper.root.findByType(Ionicon).props.name).toBe('ios-pause');
    fireEvent.press(wrapper.root.findByType(PlayButton));
    expect(wrapper.root.findByProps({ testID: 'audio-player' }).props.paused).toBe(true);
    expect(wrapper.root.findByType(Ionicon).props.name).toBe('ios-play');
  });
  it('end playing', () => {
    const { wrapper } = givenAudioPlayer();
    fireEvent.press(wrapper.root.findByType(PlayButton));
    expect(wrapper.root.findByProps({ testID: 'audio-player' }).props.paused).toBe(false);
    expect(wrapper.root.findByType(Ionicon).props.name).toBe('ios-pause');
    wrapper.root.findByProps({ testID: 'audio-player' }).props.onEnd();
    expect(wrapper.root.findByProps({ text: readableSeconds(0) })).toBeTruthy();
    expect(wrapper.root.findByProps({ testID: 'progress' }).props.style).toMatchObject({ width: '0%' });
  });
});

describe('player wrapper', () => {
  it('handles player press', () => {
    const { wrapper, props } = givenAudioPlayer({
      onPress: jest.fn(),
    });
    const playerWrapper = wrapper.root.findByProps({ testID: 'player-wrapper' });
    playerWrapper.props.onPress();
    expect(props.onPress).toBeCalledTimes(1);
  });
  it('toggle player if no custom onPress handler', () => {
    const { wrapper } = givenAudioPlayer();
    fireEvent.press(wrapper.root.findByProps({ testID: 'player-wrapper' }));
    expect(wrapper.root.findByProps({ testID: 'audio-player' }).props.paused).toBe(false);
  });
});
it('handles delete button', () => {
  const { wrapper, props } = givenAudioPlayer({
    onDelete: jest.fn(),
  });
  const deleteButton = wrapper.root.findByType(DeleteIconButton);
  expect(deleteButton).toBeTruthy();
  fireEvent.press(deleteButton);
  expect(props.onDelete).toBeCalledTimes(1);
});

import { useEffect, useRef } from 'react';
import {
  TextInput, Keyboard, Animated, View,
} from 'react-native';
import {
  PanGestureHandler, PinchGestureHandler, RotationGestureHandler, State,
} from 'react-native-gesture-handler';

import { useKeyboard } from '@app/shared/hooks';
import { colors, edgeInsets } from '@app/theme';
import { Typography } from '@app/shared/components';

import StoryViewActionBar from '../actions-bar';
import styles from './styles';

const createBox = (name, boxColor = 'transparent', textColor = colors.white) => ({
  name,
  style: {
    text: { color: textColor },
    box: { backgroundColor: boxColor },
  },
});

export const nodeModes = [
  createBox('Classic'),
  createBox('BoxWhite', colors.white, colors.black),
  createBox('BoxBlack', colors.black, colors.white),
  createBox('BoxBlue', colors.blue),
  createBox('BoxOrange', colors.orange),
  createBox('BoxYellow', colors.yellow),
  createBox('BoxGreen', colors.green),
  createBox('BoxPink', colors.pink),
  createBox('BoxTeal', colors.teal),
  createBox('BoxRed', colors.red),
];

const transform = (rotate, scale) => ({ transform: [{ rotate }, { scale }] });
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const hitSlop = edgeInsets.symmetric({ horizontal: 50, vertical: 20 });

const TextNode = ({
  top,
  left,
  mode,
  scale,
  value,
  focused,
  rotation,
  fontStyle,
  onBlur,
  onFocus,
  setValue,
  removeNode,
  switchMode,
  updateFontStyle,
}) => {
  const bounds = { top, left };

  const input = useRef();
  const lastTapRef = useRef(0);
  const panRef = useRef();
  const rotationRef = useRef();
  const pinchRef = useRef();
  const movableRef = useRef();

  const { keyboardHeight, keyboardShown } = useKeyboard();

  useEffect(() => {
    const hideEvent = Keyboard.addListener('keyboardDidHide', onBlur);

    return () => {
      hideEvent.remove();
    };
  }, [onBlur]);

  useEffect(() => {
    if (focused) {
      input.current?.focus();
    } else {
      input.current?.blur();
    }
  }, [focused, input]);

  const actions = [{
    icon: 'color-palette',
    text: 'Theme',
    onPress: switchMode,
  }, {
    icon: 'resize',
    text: 'Size',
    onPress: updateFontStyle,
  }, {
    icon: 'trash',
    text: 'Delete',
    onPress: removeNode,
  }, {
    icon: 'checkmark-circle',
    text: 'Done',
    onPress: onBlur,
  }];

  const onScaleGestureEvent = Animated.event(
    [{ nativeEvent: { scale } }],
    { useNativeDriver: false },
  );

  const onRotateGestureEvent = Animated.event(
    [{ nativeEvent: { rotation } }],
    { useNativeDriver: false },
  );

  const onMoveGestureEvent = (event) => {
    const { absoluteX, absoluteY } = event.nativeEvent;
    movableRef.current.measure((x, y, width, height) => {
      const scaleFactor = Math.max(scale._value, 1);
      top.setValue(absoluteY - height / scaleFactor);
      left.setValue(absoluteX - width / 2 / scaleFactor);
    });
  };

  const onMoveHandlerStateChange = (event) => {
    const { oldState, state } = event.nativeEvent;
    const currentTapTs = Date.now();

    const isPressIn = oldState === State.UNDETERMINED && state === State.BEGAN;
    const isPressOut = oldState === State.BEGAN && state === State.END;


    if (isPressIn) {
      lastTapRef.current = currentTapTs;
      return;
    }
    if (isPressOut && currentTapTs - lastTapRef.current <= 1000) {
      onFocus();
    }
    lastTapRef.current = null;
  };

  const nodeMode = nodeModes.find((n) => n.name === mode);
  const inputStyles = [
    bounds,
    styles.textInput,
    nodeMode.style.box,
    nodeMode.style.text,
    focused && styles.centeredText,
    keyboardShown && focused && { top: keyboardHeight },
    nodeMode.style.box.backgroundColor !== 'transparent' && styles.box,
  ];

  const textStyles = [
    nodeMode.style.text,
    focused && Typography.styles[fontStyle],
  ];

  const rotateStr = rotation.interpolate({
    inputRange: [-100, 100],
    outputRange: ['-100rad', '100rad'],
  });

  let body = (
    <PanGestureHandler
      onGestureEvent={onMoveGestureEvent}
      onHandlerStateChange={onMoveHandlerStateChange}
      ref={panRef}
      minPointers={1}
      maxPointers={1}
      hitSlop={hitSlop}
    >
      <RotationGestureHandler
        onGestureEvent={onRotateGestureEvent}
        ref={rotationRef}
        hitSlop={hitSlop}
        simultaneousHandlers={panRef}
      >
        <PinchGestureHandler
          simultaneousHandlers={rotationRef}
          onGestureEvent={onScaleGestureEvent}
          hitSlop={hitSlop}
          ref={pinchRef}
        >
          <Animated.View style={[inputStyles, transform(rotateStr, scale)]} ref={movableRef}>
            <Typography
              key={mode}
              systemWeight={Typography.weights.semibold}
              type={Typography.types[fontStyle]}
              style={[styles.text, textStyles]}
              text={value}
            />
          </Animated.View>
        </PinchGestureHandler>
      </RotationGestureHandler>
    </PanGestureHandler>
  );

  if (focused) {
    body = (
      <AnimatedTextInput
        multiline
        style={[styles.text, textStyles, inputStyles]}
        onFocus={onFocus}
        onBlur={onBlur}
        ref={input}
        value={value}
        onChangeText={setValue}
      />
    );
  }

  return (
    <View style={styles.wrapper}>
      {body}
      {focused && (
        <StoryViewActionBar
          actions={actions}
          style={{ marginBottom: keyboardHeight }}
        />
      )}
    </View>
  );
};

export default TextNode;

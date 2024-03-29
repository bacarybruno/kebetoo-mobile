import { Animated } from 'react-native';
import { Component } from 'react';

import { metrics } from '@app/theme';

import TextNode, { nodeModes } from '../text-node';

class StoryTextDesigner extends Component {
  constructor(...params) {
    super(...params);
    this.state = {
      nodes: [],
      fontStyles: [
        'headline3',
        'headline2',
        'headline1',
      ],
    };
  }

  findNode = (id) => {
    const { nodes } = this.state;
    return nodes.find((node) => node.id === id);
  }

  addNode = () => {
    const { nodes, fontStyles } = this.state;
    const dimensions = { height: 48 };
    this.setState({
      nodes: nodes.concat({
        id: Date.now(),
        focused: true,
        value: '',

        // styling
        mode: nodeModes[0].name,
        fontStyle: fontStyles[0],

        // position
        dimensions,
        scale: new Animated.Value(1),
        rotation: new Animated.Value(0),
        top: new Animated.Value(metrics.screenHeight / 2 - dimensions.height / 2),
        left: new Animated.Value(metrics.screenWidth / 2 - (dimensions.width || 0) / 2),
      }),
    });
  }

  removeSingleNode = (id) => {
    const { nodes } = this.state;
    this.setState({ nodes: nodes.filter((node) => node.id !== id) });
  }

  removeNode = (id) => {
    this.onBlur(id);
    this.removeSingleNode(id);
  }

  setDimensions = (id, dimensions) => {
    this.updateNode(id, { dimensions });
  }

  updateNode = (id, object) => {
    const { nodes } = this.state;
    this.setState({
      nodes: nodes
        .map((node) => (node.id === id ? ({ ...node, ...object }) : node)),
    });
  }

  onFocus = (id) => {
    const { onFocus } = this.props;
    this.updateNode(id, { focused: true });
    onFocus();
  }

  onBlur = (id) => {
    const { onBlur } = this.props;
    const node = this.findNode(id);
    if (!node) return;
    if (node.value.trim()) {
      this.updateNode(id, { focused: false });
    } else {
      this.removeSingleNode(id);
    }
    onBlur();
  }

  blurAll = () => {
    const { nodes } = this.state;
    nodes.forEach((node) => this.onBlur(node.id));
  }

  setNodeValue = (id, value) => {
    this.updateNode(id, { value });
  }

  switchMode = (id) => {
    const { mode: currentMode } = this.findNode(id);
    let modeIndex = nodeModes.findIndex((mode) => mode.name === currentMode) + 1;
    if (modeIndex === nodeModes.length) {
      modeIndex = 0;
    }
    this.updateNode(id, { mode: nodeModes[modeIndex].name });
  }

  updateFontStyle = (id) => {
    const { fontStyles } = this.state;
    const { fontStyle: currentFontStyle } = this.findNode(id);
    let fontStyleIndex = fontStyles.findIndex((style) => style === currentFontStyle) + 1;
    if (fontStyleIndex === fontStyles.length) {
      fontStyleIndex = 0;
    }
    this.updateNode(id, { fontStyle: fontStyles[fontStyleIndex] });
  }

  render() {
    const { nodes } = this.state;
    return (
      nodes.map((node) => (
        <TextNode
          {...node}
          onBlur={() => this.onBlur(node.id)}
          onFocus={() => this.onFocus(node.id)}
          switchMode={() => this.switchMode(node.id)}
          removeNode={() => this.removeNode(node.id)}
          setDimensions={(dimensions) => this.setDimensions(node.id, dimensions)}
          updateFontStyle={() => this.updateFontStyle(node.id)}
          setValue={(value) => this.setNodeValue(node.id, value)}
        />
      ))
    );
  }
}

export default StoryTextDesigner;

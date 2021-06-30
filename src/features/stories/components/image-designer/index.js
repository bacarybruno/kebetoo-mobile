import { Component } from 'react';

import ImageNode from '../image-node';

class StoryImageDesigner extends Component {
  constructor(...props) {
    super(...props);
    this.state = {
      nodes: [],
    };
  }

  findNode = (id) => {
    const { nodes } = this.state;
    nodes.find((node) => node.id === id);
  }

  addNode = (value) => {
    const { nodes } = this.state;
    this.setState({
      nodes: nodes.concat({ id: Date.now(), value }),
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
    this.updateNode(id, { focused: false });
    onBlur();
  }

  blurAll = () => {
    const { nodes } = this.state;
    nodes.forEach((node) => this.onBlur(node.id));
  }

  setNodeValue = (id, value) => {
    this.updateNode(id, { value });
  }

  render() {
    const { nodes } = this.state;
    return (
      nodes.map((node) => (
        <ImageNode
          {...node}
          onBlur={() => this.onBlur(node.id)}
          onFocus={() => this.onFocus(node.id)}
          removeNode={() => this.removeNode(node.id)}
        />
      ))
    );
  }
}

export default StoryImageDesigner;

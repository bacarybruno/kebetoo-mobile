import { Component } from 'react'

import ImageNode from '../image-node'

class StoryImageDesigner extends Component {
  state = {
    nodes: [],
  }

  findNode = (id) => this.state.nodes.find((node) => node.id === id)

  addNode = (value) => {
    this.setState({
      nodes: this.state.nodes.concat({
        id: Date.now(),
        value,
      })
    })
  }

  removeSingleNode = (id) => {
    this.setState({ nodes: this.state.nodes.filter((node) => node.id !== id) })
  }

  removeNode = (id) => {
    this.onBlur(id)
    this.removeSingleNode(id)
  }

  updateNode = (id, object) => {
    this.setState({
      nodes: this.state
        .nodes
        .map((node) => node.id === id ? ({ ...node, ...object }) : node)
    })
  }

  onFocus = (id) => {
    this.updateNode(id, { focused: true })
    this.props.onFocus()
  }

  onBlur = (id) => {
    this.updateNode(id, { focused: false })
    this.props.onBlur()
  }

  blurAll = () => {
    this.state.nodes.forEach((node) => this.onBlur(node.id))
  }

  setNodeValue = (id, value) => {
    this.updateNode(id, { value })
  }

  render() {
    const { nodes } = this.state
    return (
      nodes.map((node) => (
        <ImageNode
          {...node}
          onBlur={() => this.onBlur(node.id)}
          onFocus={() => this.onFocus(node.id)}
          removeNode={() => this.removeNode(node.id)}
        />
      ))
    )
  }
}

export default StoryImageDesigner

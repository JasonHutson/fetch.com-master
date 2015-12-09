class RankSlider extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: this.props.value
    }
  }

  handleOnChanged() {
    let id = this.props.id
    let value = React.findDOMNode(this.refs.slider).value
    this.setState({value: value})
    this.props.handleOnChanged(id, value)
  }

  render() {
    return (
      <div className="rank-slider">
        <label>{this.props.label}</label>
        <input type="range" min={this.props.min} max={this.props.max} id="slider" ref="slider"
               step={this.props.step} onInput={this.handleOnChanged.bind(this)}/>
        <h4 className="rank-value">{this.state.value}</h4>
      </div>
    )
  }
}

export { RankSlider }
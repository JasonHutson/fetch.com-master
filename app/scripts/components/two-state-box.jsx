class TwoStateBox extends React.Component {
  constructor(props) {
    super(props)
    let selected = (this.props.selected === undefined || this.props.selected === "false") ? false : true
    this.state = {
      selected:  selected
    }
  }

  handleOnClick() {
    let label = React.findDOMNode(this.refs.text).innerHTML
    let id = this.props.id
    if (this.props.preventTriggerEvent === undefined || this.props.preventTriggerEvent === "false") {
      this.props.updateSelectedOption(label, id)
    }
  }

  render() {
    let className = "two-state-box"
    let id = "two-state-box_" + this.props.label
    if (this.props.selected === true) {
      className = className.concat(" selected")
    }
    return (
      <div ref="optionBox" className={className} onClick={this.handleOnClick.bind(this)}>
        <span ref="text">{this.props.label}</span>
        <div className="top-left-accent"></div>
      </div>
    )
  }
}

export { TwoStateBox }

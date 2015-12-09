class TwoWayToggle extends React.Component {
  toggleActive() {
    if(this.props.active === "left"){
      this.props.onSelection(this.props.right)
    } else {
      this.props.onSelection(this.props.left)
    }
  }
  leftClassName() {
    if(this.props.active === "left"){
      return "two-way-left active"
    } else {
      return "two-way-left"
    }
  }
  rightClassName() {
    if(this.props.active === "right"){
      return "two-way-right active"
    } else {
      return "two-way-right"
    }
  }
  dividerClassName() {
    if(this.props.active === "left"){
      return "two-way-divider left-active"
    } else {
      return "two-way-divider right-active"
    }
  }
  render() {
    return (
      <div className="two-way-toggle">
        <div className={this.leftClassName()} onClick={this.toggleActive.bind(this)}>
          {this.props.left}
        </div>
        <div className={this.dividerClassName()}></div>
        <div className={this.rightClassName()} onClick={this.toggleActive.bind(this)}>
          {this.props.right}
        </div>
      </div>
    )
  }
}

export { TwoWayToggle }
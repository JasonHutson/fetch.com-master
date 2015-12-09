import { TwoStateBox } from 'scripts/components/two-state-box'

class TwoStateBoxImage extends React.Component {
  constructor(props) {
    super(props)
    let selected = (this.props.selected === undefined || this.props.selected === "false") ? false : true
    this.state = {
      selected:  selected
    }
  }

  handleOnClick() {
    let label = React.findDOMNode(this.refs.label).innerHTML
    let id = this.props.id
    this.props.updateSelectedOption(label, id)
  }

  render() {
    let className = "two-state-box-image"
    if (this.props.selected === true) {
      className = className.concat(" selected")
    }
    return (
      <div ref="optionBox" className={className} onClick={this.handleOnClick.bind(this)}>
        <div className='check'></div>
        <img src={this.props.imageUrl} />
        <span ref="label" className="label">{this.props.label}</span>
        <TwoStateBox label={this.props.label} key={this.props.id} id={this.props.id}
                     preventTriggerEvent="true"
                     selected={this.props.selected} updateSelectedOption={this.props.updateSelectedOption}
                     onClick={this.handleOnClick.bind(this)}/>
      </div>
    )
  }
}

export { TwoStateBoxImage }

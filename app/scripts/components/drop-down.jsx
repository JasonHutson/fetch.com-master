class DropDown extends React.Component {
  constructor(props) {
    super(props)
    this.componentId = "dropdown" + this.props.name
  }

  componentDidMount() {
    $("#"+this.componentId).dropdown({
      onChange: (value, text, $choice) => {
        this.props.onChange(value, text)
      }
    })

    if (this.props.defaultValue !== undefined && this.props.defaultValue !== null) {
      let currentValues = this.props.defaultValue.split(',')

      if (this.props.multiple === "true" && currentValues.length > 1) {
        let selectedIds = []
        this.props.items.forEach(item => {
          let itemToCompare = item
          if (this.props.onBeforeCompareItem !== undefined) {
            itemToCompare = this.props.onBeforeCompareItem(itemToCompare)
          }
          currentValues.forEach(value => {
            if (itemToCompare.name === value.trim()) {
              selectedIds.push(item.id)
            }
          })
        })
        $("#"+this.componentId).dropdown(
          'set selected', selectedIds
        )
      }
      else {
        let value = currentValues[0]
        let selectedId = ''

        this.props.items.forEach(item => {
          let itemToCompare = item
          if (this.props.onBeforeCompareItem !== undefined) {
            itemToCompare = this.props.onBeforeCompareItem(itemToCompare)
          }

          if (itemToCompare.name === value) {
            selectedId = item.id
          }
        })
        $("#"+this.componentId).dropdown(
          'set selected', selectedId
        )
      }
    }

  }

  render() {
    let className = "ui fluid search selection dropdown"
    if (this.props.multiple === "true") {
      className = className.concat(" multiple")
    }

    return (
      <div id={this.componentId} className={className}>
        <input type="hidden" name={this.props.name}/>
        <i className="dropdown icon" />
        <div className="default text">{this.props.defaultText}</div>
        <div className="menu">
          {this.props.items.map(item => {
            let key = this.componentId + item.id
            return (
              <div className="item" key={key} data-value={item.id}>{item.name}</div>
            )
          })}
        </div>
      </div>
    )
  }
}

export default DropDown
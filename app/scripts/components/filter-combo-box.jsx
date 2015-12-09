class FilterComboBox extends React.Component {
  constructor(props) {
    super(props)

    this.items = this.props.items.slice(0)
    this.items.unshift({id:0, name:'(ALL ITEMS)'})    

    this.state = {
      selectedItem: this.items[0],
      showList: false
    }
  }

  onClick(event) {
    this.setState({showList: !this.state.showList})
  }

  onItemClick(event) {
    if (this.state.showList) {
      let selectedId = event.target.dataset.id
      for (let i=0; i<this.items.length; i++) {
        if (selectedId.toString() === this.items[i].id.toString()) {
          this.setState({selectedItem: this.items[i]})
          this.props.onSelectionChanged(this.items[i])
          break
        }
      }
    }
  }

  render() {

    this.items = this.props.items.slice(0)
    this.items.unshift({id:0, name:'(ALL ITEMS)'})

    var result = $.grep(this.items, function(e) { return e.id === 0; })
    if (result.length === 0) {
      this.items.unshift({id:0, name:'(ALL ITEMS)'})
    }

    let selectedItemName = this.state.selectedItem.name
    if (this.state.showList) {
      return (
        <div className="filter-combo-box" onClick={this.onClick.bind(this)}>
          <span className="element">{selectedItemName}</span>
          <div className="container">
            <div className="ui list">
              {this.items.map(item => {
                let key = item.id + item.name
                return (
                  <div className="item" key={key} data-id={item.id} onClick={this.onItemClick.bind(this)}>
                    {item.name}
                  </div>
                )
              })}
            </div>
            <div className="accent"></div>
          </div>
        </div>
      )      
    }
    else {
      return (
        <div className="filter-combo-box" onClick={this.onClick.bind(this)}>
          <span className="element">{selectedItemName}</span>
        </div>
      )
    }
  }
}

export default FilterComboBox
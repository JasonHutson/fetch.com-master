class MessagePopup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isOpen: false
    }
  }

  componentDidMount() {
    $('.ui.modal').modal({
      onHide: () => {
        this.setState({isOpen: false})
        this.props.onClose()
      }
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.show === true) {
      this.setState({isOpen: true})
      $('.ui.modal').modal('show')
    }
  }

  render() {
    return (
      <div className="ui modal">
        <i className="close icon"></i>
        <div className="header">
          {this.props.title}
        </div>
        <div className="image content">
          <div className="description">
            {this.props.children}
          </div>
        </div>
        <div className="actions">
          <div className="ui positive right labeled icon button">
            Close
            <i className="checkmark icon"></i>
          </div>
        </div>
      </div>
    )
  }
}

export default MessagePopup
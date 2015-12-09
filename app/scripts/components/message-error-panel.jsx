class MessageErrorPanel extends React.Component {
  render() {
    if (this.props.error === null || this.props.error === undefined) {
      return (
        <div className="twelve wide column error-message">
        </div>
      )
    }
    else {
      return (
        <div className="twelve wide column error-message show">
          <div className="ui negative message">
            <i className="close icon"></i>
            <div className="header">
              {this.props.error.title}
            </div>
            <p>{this.props.error.text}</p>
          </div>
        </div>
      )
    }
  }
}

export default MessageErrorPanel
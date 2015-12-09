// Actions
import MessagesActions from '../actions/messages-actions'

// Stores
import MessagesStore from '../stores/messages-store'
import SessionStore from '../stores/session-store'

class AgentMessagingPanel extends React.Component {
  constructor(props) {
    super(props)
    this.state = MessagesStore.getState()
  }

  onComponentWillMount() {
    MessagesStore.listen(this.onMessagesStoreChange.bind(this))
  }

  onComponentWillUnmunt() {
    MessagesStore.unlisten(this.onMessagesStoreChange.bind(this))
  }

  onMessagesStoreChange(state) {
  }

  onTextChange(text) {
    let disableSendButton = (text === undefined || text === null || text.length === 0)
    this.setState({disableSendButton: disableSendButton})
  }

  onSendMessageClick(text) {
    this.setState({disableSendButton: true})
    MessagesActions.replyMessageByAgent(text, this.props.user.userId)
  }

  render() {
    let user = this.props.user
    let informationPanel = ''
    // if (this.props.informationPanel === 'company') {
    //   informationPanel = <CompanyInformationPanel account={this.props.account} />
    // }
    // else if (this.props.informationPanel === 'talent') {
    //   informationPanel = <TalentInformationPanel talent={this.props.talent} match={this.props.match}
    //                                              onMakeOfferClick={this.props.onMakeOfferClick} />
    // }
    if (user.messages === []) {
      return (
        <div className="messaging-panel">
          <div className="ui grid header">
            <div className="ten wide column">
              <div className="title">MESSAGES</div>
              <div className="with">with {user.name}</div>
            </div>
            <div className="six wide column">
              <div className="ui button green right floated" onClick={this.props.onReturnClick}>
                RETURN TO CONVERSATIONS
              </div>
            </div>
          </div>
        </div>
      )
    }
    else {
      return (
        <div className="messaging-panel">
          <div className="ui grid header">
            <div className="ten wide column">
              <div className="title">MESSAGES</div>
              <div className="with">with {user.name}</div>
            </div>
            <div className="six wide column">
              <div className="ui button green right floated" onClick={this.props.onReturnClick}>
                RETURN TO CONVERSATIONS
              </div>
            </div>
          </div>
          <div className="ui grid content">

            <div className="ten wide column message-list">
              <div className="ui comments">
                {user.messages.map(message => {
                  return <AgentDashboardMessage viewType={this.props.viewType}
                                                 key={message.id}
                                                 body={message.body}
                                                 from={message.from}
                                                 to={message.to}
                                                 created_at={message.created_at} />
                })}
              </div>
              <MessageReplyBox text={this.state.messageText}
                               disableSendButton={this.state.disableSendButton}
                               onTextChange={this.onTextChange.bind(this)}
                               onSubmitClick={this.onSendMessageClick.bind(this)} />
            </div>

            <div className="six wide column">
              {informationPanel}
            </div>
          </div>
        </div>
      )
    }
  }
}

class AgentDashboardMessage extends React.Component {
  constructor(props) {
    super(props)
  }
  user() {
    return this.props.from
  }
  render() {
    let authorClassName = "author"
    let dateClassName = "date"
    let className = "content"
    let avatarClassName = "avatar"
    let avatar_url = this.user().avatar_url !== '' ? this.user().avatar_url : '../images/user-placeholder.jpg'
    if (this.props.from.type !== this.props.viewType) {
      authorClassName = authorClassName.concat(" right floated")
      dateClassName = dateClassName.concat(" right floated")
      className = className.concat(" right floated")
      avatarClassName = avatarClassName.concat(" right floated")
    }
    return (
      <div className="message comment">
        <a className={avatarClassName}>
          <img src={avatar_url}/>
        </a>
        <div className={className}>
          <a className={authorClassName}>{this.user().name}</a>
          <div className="metadata">
            <span className={dateClassName}>{this.props.created_at}</span>
          </div>
          <div className="text">
            {this.props.body}
          </div>
        </div>
      </div>
    );
  }
}

class MessageReplyBox extends React.Component {
  onSubmitClick(event) {
    event.preventDefault()
    let text = React.findDOMNode(this.refs.text).value
    React.findDOMNode(this.refs.text).value = ''
    this.props.onSubmitClick(text)
  }

  onTextChange(event) {
    this.props.onTextChange(event.target.value)
  }

  render() {
    let buttonClass = "ui button green"
    if (this.props.disableSendButton) {
      buttonClass = buttonClass.concat(" disabled")
    }

    return (
      <form className="ui reply form">
        <div className="field title">
          COMMENTS:
        </div>
        <div className="field ui grid">
          <textarea rows="4" ref="text" className="twelve wide column" value={this.props.text}
                    onChange={this.onTextChange.bind(this)} />
          <div className="four wide column">
            <button className={buttonClass} onClick={this.onSubmitClick.bind(this)}>
              SEND
            </button>
          </div>
        </div>
      </form>
    )
  }
}

export default AgentMessagingPanel

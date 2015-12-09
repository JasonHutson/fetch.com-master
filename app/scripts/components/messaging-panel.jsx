// Components
import CompanyInformationPanel from './company-information-panel'
import TalentInformationPanel from './talent-information-panel'

// Actions
import MessagesActions from '../actions/messages-actions'

// Stores
import MessagesStore from '../stores/messages-store'
import SessionStore from '../stores/session-store'

class MessagingPanel extends React.Component {
  constructor(props) {
    super(props)
    this.state = MessagesStore.getState()
  }

  componentDidMount() {
    MessagesStore.listen(this.onChange.bind(this))

    let profile_id = SessionStore.getTalentProfileId()
  }

  componentDidUnmount() {
    MessagesStore.unlisten(this.onChange.bind(this))
  }

  onChange(state) {
    this.setState(state)
    if (this.props.onMessageSent !== undefined && this.state.messageSent === true) {
      this.props.onMessageSent()
    }
  }

  onReplyMessageClick() {
    this.setState({showReplySection:true})
  }

  onSendMessageClick(text) {
    if (text.length > 0) {
      this.setState({disableSendButton: true})
      if (this.props.informationPanel === 'agent') {
        MessagesActions.replyMessageToAgent(text, this.props.agent.user_id)
      }
      else {
        MessagesActions.sendMessage(this.props.job.id, text, this.props.toUserId)
      }
    }
  }

  onCancelMessageClick() {
    this.setState({showReplySection:false})
  }

  onTextChange(text) {
    let disableSendButton = (text === undefined || text === null || text.length === 0)
    this.setState({disableSendButton: disableSendButton})
  }

  render() {
    let informationPanel = ''

    let title2 = ''
    if (this.props.job !== undefined && this.props.job.attributes !== undefined) {
      title2 = this.props.job.attributes.job_title
    }
    else if (this.props.informationPanel === 'agent') {
      title2 = 'WITH AGENT ' + this.props.agent.name
    }


    if (this.props.informationPanel === 'company' && this.props.account !== null) {
      informationPanel = <CompanyInformationPanel account={this.props.account} />
    }
    else if (this.props.informationPanel === 'talent') {
      informationPanel = <TalentInformationPanel talent={this.props.talent} match={this.props.match}
                                                 onMakeOfferClick={this.props.onMakeOfferClick} />
    }
    if ((this.props.informationPanel !== 'agent' && this.props.job.attributes === undefined || this.props.messages === undefined) ||
        (this.props.messages === undefined && this.props.informationPanel === 'agent')) {
      return (
        <div className="messaging-panel">
          <div className="ui grid header">
            <div className="nine wide column">
              <div className="title">MESSAGES</div>
            </div>
            <div className="seven wide column buttons">
              <div className="ui button green right floated" onClick={this.props.onReturnClick}>BACK TO JOBS</div>
            </div>
          </div>
        </div>
      )
    }
    else {
      return (
        <div className="messaging-panel">
          <div className="ui grid header">
            <div className="nine wide column">
              <div className="title"><span className="messages">MESSAGES</span> <span className="position">{title2}</span></div>
            </div>
            <div className="seven wide column buttons">
              <div className="ui button green right floated" onClick={this.props.onReturnClick}>BACK TO JOBS</div>
            </div>
          </div>
          <div className="ui grid content">

            <div className="ten wide column message-list">
              <div className="ui comments">
                {this.props.messages.map(message => {
                  let body = ''
                  let from_user = null
                  let to_user = null
                  let created_at = ''
                  if (message.attributes !== undefined) {
                    body = message.attributes.body
                    from_user = message.attributes.from
                    to_user = message.attributes.to
                    created_at = message.attributes.created_at
                  }
                  else {
                    body = message.body
                    from_user = message.from
                    to_user = message.to
                    created_at = message.created_at
                  }
                  return <TalentDashboardMessage viewType={this.props.viewType}
                                                 key={message.id}
                                                 body={body}
                                                 from={from_user}
                                                 to={to_user}
                                                 position={message.position}
                                                 created_at={created_at} />
                })}
              </div>
              <MessageReplyBox text={this.state.messageText} key="message-reply-box-key"
                               disableSendButton={this.state.disableSendButton}
                               messageSending={this.state.messageSending}
                               onTextChange={this.onTextChange.bind(this)}
                               onSubmitClick={this.onSendMessageClick.bind(this)}
                               onCancelClick={this.onCancelMessageClick.bind(this)}/>
            </div>

            <div className="six wide column right-column">
              {informationPanel}
            </div>
          </div>
        </div>
      )
    }
  }
}

class TalentDashboardMessage extends React.Component {
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
    if (this.props.from.type !== this.props.viewType) {
      authorClassName = authorClassName.concat(" right floated")
      dateClassName = dateClassName.concat(" right floated")
      className = className.concat(" right floated")
    }
    let key = this.props.from.id + '-' + this.props.to.id
    return (
      <div key={key} className="message comment">
        <a className="avatar">
          <img src={this.user().avatar_url} />
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
    let loadingClass = this.props.messageSending === true ? 'loading-indicator' : 'loading-indicator hidden'
    let sendButtonText = this.props.messageSending === true ? 'SENDING' : 'SEND'

    return (
      <form key="reply-message-form-key" className="ui reply form">
        <div className="field title">
          COMMENTS:
        </div>
        <div className="field ui grid">
          <textarea rows="4" ref="text" className="twelve wide column" value={this.props.text}
                    onChange={this.onTextChange.bind(this)} />
            <div className="four wide column buttons">
            <button key="submit-button-message-key" className={buttonClass} onClick={this.onSubmitClick.bind(this)}>
              {sendButtonText}
              <div className={loadingClass}>
                <img src="../images/ajax-loader.gif" className="spinner"></img>
              </div>
            </button>
          </div>
        </div>
      </form>
    )
  }
}

export default MessagingPanel

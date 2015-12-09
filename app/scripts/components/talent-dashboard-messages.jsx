// Components
import CompanyInformationPanel from './company-information-panel'

// Actions
import MessagesActions from '../actions/messages-actions'

// Stores
import MessagesStore from '../stores/messages-store'
import SessionStore from '../stores/session-store'

class TalentDashboardMessages extends React.Component {
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
  }

  onReplyMessageClick() {
    this.setState({showReplySection:true})
  }

  onSendMessageClick(text) {
    MessagesActions.sendMessage(this.props.job.id, text)
  }

  onCancelMessageClick() {
    this.setState({showReplySection:false})
  }

  activePosition() {
    return $.grep(this.state.positions, position => position.id === this.state.activePositionId)[0]
  }

  activePositionMessages() {
    if(this.activePosition()){
      return this.activePosition().messages
    } else {
      return []
    }
  }

  positionClass(position) {
    if(position === this.activePosition()){
      return "active teal item"
    } else {
      return "item"
    }
  }

  setActivePosition(positionId) {
    this.setState({activePositionId: positionId})
  }

  render() {
    return (
      <div className="talent-dashboard-messages">
        <div className="ui grid header">
          <div className="nine wide column">
            <div className="title">MESSAGES <span className="position">{this.props.job.attributes.job_title}</span></div>
          </div>
          <div className="seven wide column">
            <div className="ui button green right floated" onClick={this.props.onReturnClick}>BACK TO JOBS</div>
          </div>
        </div>
        <div className="ui grid content">
          
          <div className="ten wide column message-list">
            <div className="ui comments">
              {this.props.messages.map(message => {
                console.log('message: ', message)
                return <TalentDashboardMessage key={message.id} 
                                               body={message.attributes.body} 
                                               from={message.attributes.from_user} 
                                               to={message.attributes.to_user} 
                                               position={message.position} 
                                               created_at={message.attributes.created_at} />
              })}
            </div>
            <MessageReplyBox text={this.state.messageText}
                             onSubmitClick={this.onSendMessageClick.bind(this)}
                             onCancelClick={this.onCancelMessageClick.bind(this)}/>
          </div>

          <div className="six wide column">
            <CompanyInformationPanel account={this.props.account} />
          </div>
        </div>
      </div>
    )
  }
}

class TalentDashboardMessagePosition extends React.Component {
  setActivePosition() {
    this.props.setActivePosition(this.props.id)
  }
  render() {
    return (
      <a key={this.props.id} className={this.props.className} onClick={this.setActivePosition.bind(this)}>
        {this.props.title}
      </a>
    )
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
    if (this.props.from.type === 'employer_contact') {
      authorClassName = authorClassName.concat(" right floated")
      dateClassName = dateClassName.concat(" right floated")
      className = className.concat(" right floated")
    }
    return (
      <div className="message comment">
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
  onSubmitClick() {
    let text = React.findDOMNode(this.refs.text).value
    React.findDOMNode(this.refs.text).value = ''
    this.props.onSubmitClick(text)
  }

  render() {
    return (
      <form className="ui reply form">
        <div className="field title">
          COMMENTS:
        </div>
        <div className="field ui grid">
          <textarea rows="4" ref="text" className="twelve wide column">{this.props.text}</textarea>
          <div className="four wide column">
            <div className="ui button green" onClick={this.onSubmitClick.bind(this)}>
              SEND
            </div>
          </div>
        </div>
      </form>
    )
  }
}

export default TalentDashboardMessages;

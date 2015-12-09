

class MobileMessagingList extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="messaging-list">
        <div className="ui grid header">
          <div className="nine wide column">
            <div className="title"><span className="messages">MESSAGES</span></div>
          </div>
          <div className="seven wide column buttons">
            <div className="ui button green right floated" onClick={this.props.onReturnClick}>BACK TO JOBS</div>
          </div>
        </div>
        <div className="ui grid content">

          <div className="sixteen wide column message-list">
            <div className="ui comments">
              {this.props.conversations.map(conversation => {
                return <MessagingListItem conversation={conversation}
                                          onConversationClick={this.props.onConversationClick}/>
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

class MessagingListItem extends React.Component {
  onClick() {
    this.props.onConversationClick(this.props.conversation)
  }

  render() {
    var conversation = this.props.conversation
    var photo_url = conversation.photo_url !== '' ? conversation.photo_url : "../images/user-placeholder.jpg"
    var date = moment(conversation.last_message_date).format("MMM D, YYYY - h:mmA")
    var name = conversation.employer_contact_name !== undefined ? conversation.employer_contact_name : conversation.talent_profile_name
    return (
      <div className="messaging-list-item comment" onClick={this.onClick.bind(this)}>
        <a className="avatar">
          <img src={photo_url} className="ui circular image" />
        </a>
        <div className="content">
          <div className="name">{name}</div>
          <div className="metadata">
            <span className="date">{date}</span>
          </div>
        </div>
      </div>
    )
  }
}

export default MobileMessagingList

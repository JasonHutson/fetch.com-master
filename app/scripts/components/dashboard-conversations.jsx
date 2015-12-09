
class DashboardConversations extends React.Component {
  componentDidMount() {
    $('.ui.circular.image.conversation').popup()
  }

  onClick(event) {
    let jobId = event.target.dataset.jobid
    let userId = event.target.dataset.userid
    this.props.onConversationClick(jobId, userId)
  }

  render() {
    let numberOfConversations = this.props.conversations.length

    if (numberOfConversations === 0) {
      return <NoConversationsMessage />
    }

    let smallConversations = ''
    if (numberOfConversations > 1) {
      let items = this.props.conversations.slice(1)
      smallConversations = <SmallConversations items={items} onConversationClick={this.onClick.bind(this)} />
    }
    let recentConversation = this.props.conversations[0]
    let photo_url = (recentConversation.photo_url !== '') ? recentConversation.photo_url : "http://placehold.it/300x300"

    return (
      <div className="conversations ui grid">
        <div className="title sixteen wide column">
          <span className="accent">ACTIVE </span>CONVERSATIONS
        </div>
        <div className="sixteen wide column image">
          <img className="ui circular image conversation" src={photo_url}
               onClick={this.onClick.bind(this)} data-jobid={recentConversation.job_id}
               title={recentConversation.talent_profile_name}
               data-userid={recentConversation.user_id}/>
          {smallConversations}
        </div>
      </div>
    )
  }
}

class SmallConversations extends React.Component {
  render() {
    return (
      <div className="small-conversations-row">
        {this.props.items.map(item => {
          let key = item.last_message_date
          let photo_url = (item.photo_url !== '') ? item.photo_url : "http://placehold.it/60x60"
          return <img src={photo_url} key={key} className="ui circular image small" width="60" height="60"
                  onClick={this.props.onConversationClick} data-jobid={item.job_id}
                  title={item.talent_profile_name}
                  data-userid={item.user_id}/>
        })}
      </div>
    )
  }
}

class NoConversationsMessage extends React.Component {
  render() {
    return (
      <div className="no-conversations">
        No active conversations
      </div>
    )
  }
}

export default DashboardConversations

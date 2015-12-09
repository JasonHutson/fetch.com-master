
class AgentConversationsList extends React.Component {
  render() {
    return (
      <div className="conversations-list">
        <div className="header">
          <h1>ACTIVE <span className="accent">CONVERSATIONS</span></h1>
        </div>
        <div className="content">
          <div className="ui divided items conversations">
            {this.props.users.map(user => {
              let key = user.type + user.id
              return <AgentUserConversation user={user} key={key}
                      onClick={this.props.onItemClick}/>
            })}
          </div>
        </div>
      </div>
    )
  }
}

class AgentUserConversation extends React.Component {
  onClick() {
    this.props.onClick(this.props.user)
  }

  render() {
    let user = this.props.user
    return (
      <div className="item" onClick={this.onClick.bind(this)}>
        <div className="ui tiny image">
          <img src={user.photo_url} />
        </div>
        <div className="middle aligned content">
          {user.name} - {user.type}
        </div>
      </div>
    )
  }
}

export default AgentConversationsList

// Constants
import UIConstants from '../constants/ui-constants'

// Components
import BaseProtectedComponent from './base-protected-component'
import AgentConversationsList from './agent-conversations-list'
import AgentMessagingPanel from './agent-messaging-panel'
import DashboardConversations from './dashboard-conversations'
import DashboardFooter from './dashboard-footer'
import MessagingPanel from './messaging-panel'
import TalentNavbar from './talent-navbar'

// Actions
import AgentActions from '../actions/agent-actions'
import MessagesActions from '../actions/messages-actions'
import SessionActions from '../actions/session-actions'

// Stores
import AgentStore from '../stores/agent-store'
import MessagesStore from '../stores/messages-store'
import SessionStore from '../stores/session-store'

class AgentDashboard extends BaseProtectedComponent {
  constructor(props) {
    super(props)
    this.state = {
      activeContent: ITEMS[0],
      agent: {},
      conversations: [],
      users: [],
      currentObjectId: 0,
      currentUserId: 0,
      totalMessages: 0
    }

    AgentActions.fetchById.defer(SessionStore.getAgentId())
    this.getMessagesFromServer()
    setInterval(this.getMessagesFromServer, UIConstants.MESSAGES_REFRESH_INTERVAL)
  }

  componentWillMount() {
    let isAgent = SessionStore.isCurrentUserAgent()
    if (!isAgent) {
      window.location.href = "/agent-login.html"
    }

    AgentStore.listen(this.onAgentStoreChange.bind(this))
    MessagesStore.listen(this.onMessagesStoreChange.bind(this))
    SessionStore.listen(this.onSessionStoreChange.bind(this))
  }

  componentWillUnmount() {
    AgentStore.unlisten(this.onAgentStoreChange.bind(this))
    MessagesStore.unlisten(this.onMessagesStoreChange.bind(this))
    SessionStore.unlisten(this.onSessionStoreChange.bind(this))
  }

  getMessagesFromServer() {
    MessagesActions.fetchByCurrentUser()
  }

  onAgentStoreChange(state) {
    this.setState({agent: state.agent})
  }

  onMessagesStoreChange(state) {
    if (state.loading === false && state.messagesLoaded !== this.state.totalMessages) {
      this.setState({
        users: state.users,
        totalMessages: state.messagesLoaded
      })
      if (this.state.currentUserId > 0 && this.state.currentObjectId > 0) {
        $.each(this.state.users, (index, item) => {
          if (item.id === this.state.currentObjectId && item.userId === this.state.currentUserId) {
            this.setState({user: item})
          }
        })
      }
    }
  }

  onSessionStoreChange(state) {
    if (!SessionStore.isCurrentUserAgent()) {
      window.location.href = "/agent-login.html"
    }
    else if (state.authToken === null) {
      window.location.href = "/agent-login.html"
    }
  }


  handleNavClick(index) {
    this.setState({activeContent: ITEMS[index]});
  }

  onConversationClick(user) {
    this.setState({
      activeContent: 'Messages',
      user: user,
      currentObjectId: user.id,
      currentUserId: user.userId
    })
  }

  onReturnConversationsClick() {
    this.setState({
      activeContent: 'Conversations'
    })
  }

  onLogoutClick() {
    SessionActions.logout(SessionStore.getAuthToken())
  }

  currentContent() {
    switch(this.state.activeContent) {
      case "Conversations":
        return <AgentConversationsList users={this.state.users} onItemClick={this.onConversationClick.bind(this)}/>
        break;

      case "Messages":
        return <AgentMessagingPanel user={this.state.user} viewType='agent'
                                    onReturnClick={this.onReturnConversationsClick.bind(this)}/>
        break;
    }
  }

  render() {
    return (
      <div className="dashboard">
        <TalentNavbar handleNavClick={this.handleNavClick.bind(this)} items={ITEMS} selectedItem={this.state.activeContent}
                      onLogoutClick={this.onLogoutClick.bind(this)} />
        <main className="ui grid">
            <div className="three wide column left-sidebar">
              <AgentSummary agent={this.state.agent} />
            </div>
            <div className="ten wide column">
              <div id="dashboardContent">
                {this.currentContent()}
              </div>
            </div>
            <div className="three wide column right-sidebar">
              <div className="ui grid">
                <div className="center aligned sixteen wide column">
                  <DashboardConversations conversations={this.state.conversations}
                                          onConversationClick={this.onConversationClick.bind(this)} />
                </div>
              </div>
            </div>
        </main>
        <DashboardFooter />
      </div>
    )
  }
}

class AgentSummary extends React.Component {
  render() {
    let agent = this.props.agent
    let name = (agent.attributes === undefined || agent.attributes === null) ? '' : agent.attributes.name
    let photo_url = (agent.attributes === undefined || agent.attributes === null) ? '' : agent.attributes.photo_url
    return (
      <div className="agent-info">
        <h3 className="ui aligned center title">{name}</h3>
        <div className="image-container">
          <img className="ui image" src={photo_url}></img>
        </div>
      </div>
    )
  }
}

const ITEMS = ["Conversations"];


React.render(
  <AgentDashboard />,
  document.getElementById("agentDashboard")
)

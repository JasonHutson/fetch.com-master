// Constants
import UIConstants from '../constants/ui-constants'

// Components
import TalentNavbar from './talent-navbar'
import BaseProtectedComponent from './base-protected-component'
import EmployerAccountSummary from './employer-account-summary'
import EmployerInviteCoworkers from './employer-invite-coworkers'
import EmployerPositions from './employer-positions'
import EmployerPositionDetails from './employer-position-details'
import PositionMatchDetails from './position-match-details'
import EmployerAddJob from './employer-add-job'
import EmployerAccountFilters from './employer-account-filters'
import DashboardFooter from './dashboard-footer'
import DashboardConversations from './dashboard-conversations'
import EmployerDashboardAgent from './employer-dashboard-agent'
import EmployerDashboardCompanyProfile from './employer-dashboard-company-profile'
import EmployerDashboardTalentProfile from './employer-dashboard-talent-profile'
import EmployerOfferForm from './employer-offer-form'
import MessagingPanel from './messaging-panel'
import MobileMessagingList from './mobile-messaging-list'

// Actions
import AccountsActions from '../actions/accounts-actions'
import AgentActions from '../actions/agent-actions'
import CitiesActions from '../actions/cities-actions'
import CompensationsActions from '../actions/compensations-actions'
import EmployerPositionsActions from '../actions/employer-positions-actions'
import EmployersActions from '../actions/employers-actions'
import EmploymentTypesActions from '../actions/employment-types-actions'
import MessagesActions from '../actions/messages-actions'
import SearchActions from '../actions/search-actions'
import SkillsActions from '../actions/skills-actions'
import TalentProfileMatchesActions from '../actions/talent-profile-matches-actions'
import SessionActions from '../actions/session-actions'
import EmailHandlerActions from '../actions/email-handler-actions'

// Stores
import AccountsStore from '../stores/accounts-store'
import AgentStore from '../stores/agent-store'
import CitiesStore from '../stores/cities-store'
import CompensationsStore from '../stores/compensations-store'
import EmployerPositionsStore from '../stores/employer-positions-store'
import EmployersStore from '../stores/employers-store'
import EmploymentTypesStore from '../stores/employment-types-store'
import MessagesStore from '../stores/messages-store'
import SearchStore from '../stores/search-store'
import SessionStore from '../stores/session-store'
import SkillsStore from '../stores/skills-store'
import TalentProfileMatchesStore from '../stores/talent-profile-matches-store'
import EmailHandlerStore from '../stores/email-handler-store'

class EmployerDashboard extends BaseProtectedComponent {
  constructor(props) {
    super(props)
    this.state = {
      activeContent: ITEMS[0],
      agent: {},
      employer: {},
      positions: [],
      activePosition: {},
      activeMatch: {},
      skills: [],
      cities: [],
      compensations: [],
      employmentTypes: [],
      matchesForPosition: [],
      messages: [],
      filters: {},
      jobStatusFilter: "active", // "active" or "fetched"
      showPopup: false,
      conversations: [],
      sendMessageToUserId: 0,
      mobileDevice: false
    }
    let employerId = SessionStore.getEmployerContactId()
    EmployersActions.fetchById(employerId)
    EmployersActions.getRecentConversations(employerId)
    EmployerPositionsActions.fetchByEmployerId(employerId, this.state.jobStatusFilter)
    SkillsActions.fetchAllSkills()
    CitiesActions.fetch()
    CompensationsActions.fetch()
    EmploymentTypesActions.fetch()

    this.nextActiveContent = ''

    this.getMessagesFromServer()
    setInterval(this.getMessagesFromServer.bind(this), UIConstants.MESSAGES_REFRESH_INTERVAL)
    setInterval(this.checkAgentStatus.bind(this), UIConstants.AGENT_REFRESH_INTERVAL)
    setInterval(this.refreshJobs.bind(this), UIConstants.EMPLOYER_JOBS_INTERVAL)
  }

  componentWillMount() {
    if (!SessionStore.isCurrentUserEmployer()) {
      window.location.href = "/employer-login.html"
      return;
    }
    AccountsStore.listen(this.onAccountInfoChange.bind(this))
    AgentStore.listen(this.onAgentChange.bind(this))
    EmployerPositionsStore.listen(this.onEmployerPositionsStoreChange.bind(this))
    EmployersStore.listen(this.onEmployerInfoChange.bind(this))
    SearchStore.listen(this.onSearchStoreChange.bind(this))
    SkillsStore.listen(this.onSkillsChange.bind(this))
    CitiesStore.listen(this.onCitiesChange.bind(this))
    CompensationsStore.listen(this.onCompensationsChange.bind(this))
    EmploymentTypesStore.listen(this.onEmploymentTypesChange.bind(this))
    SessionStore.listen(this.onSessionStateChange.bind(this))
    TalentProfileMatchesStore.listen(this.onTalentProfileMatchesChange.bind(this))
    MessagesStore.listen(this.onMessagesChange.bind(this))

    let role = EmailHandlerStore.getRole()
    if (role === 'employer') {
      let screen = EmailHandlerStore.getScreen()
      if (screen === 'messages') {
        let jobId = EmailHandlerStore.getPositionId()
        let matchId = EmailHandlerStore.getMatchId()
        let otherUserId = EmailHandlerStore.getOtherUserId()

        EmployerPositionsActions.fetchByPositionId(SessionStore.getEmployerContactId(), jobId)
        TalentProfileMatchesActions.fetchById(0, matchId)

        this.onConversationClick(jobId, otherUserId)
        this.setState({activeContent: 'Messages'})
        this.nextActiveContent = 'Messages'
      }
      else if (screen === 'talent_details') {
        let jobId = EmailHandlerStore.getPositionId()
        let matchId = EmailHandlerStore.getMatchId()
        TalentProfileMatchesActions.fetchById(0, matchId)
        this.nextActiveContent = 'Match Details'
      }
    }
    EmailHandlerActions.clearValues()
  }

  componentWillUnmount() {
    AccountsStore.unlisten(this.onAccountInfoChange.bind(this))
    AgentStore.unlisten(this.onAgentChange.bind(this))
    EmployerPositionsStore.unlisten(this.onEmployerPositionsStoreChange.bind(this))
    EmployersStore.unlisten(this.onEmployerInfoChange.bind(this))
    SearchStore.unlisten(this.onSearchStoreChange.bind(this))
    SkillsStore.unlisten(this.onSkillsChange.bind(this))
    CitiesStore.unlisten(this.onCitiesChange.bind(this))
    CompensationsStore.unlisten(this.onCompensationsChange.bind(this))
    EmploymentTypesStore.unlisten(this.onEmploymentTypesChange.bind(this))
    SessionStore.unlisten(this.onSessionStateChange.bind(this))
    TalentProfileMatchesStore.unlisten(this.onTalentProfileMatchesChange.bind(this))
    MessagesStore.unlisten(this.onMessagesChange.bind(this))
  }

  refreshJobs() {
    if (this.state.activeContent === 'Jobs') {
      EmployerPositionsActions.fetchByEmployerIdWithFilter.defer(SessionStore.getEmployerContactId(),
        this.state.filters, this.state.jobStatusFilter)
    } else if (this.state.activeContent === 'Position Details' && this.state.activePosition !== null) {
      let position = this.state.activePosition
      TalentProfileMatchesActions.fetchByPositionId(position.id)
    }
  }

  getMessagesFromServer() {
    if (this.state.activePosition !== null && this.state.activeContent === 'Messages') {
      let anotherUserId = this.state.sendMessageToUserId
      MessagesActions.fetchForPositionIdWithAnotherUser.defer(this.state.activePosition.id, anotherUserId, 'User')
    }
    else if (this.state.activeContent === 'Agent Messages') {
      MessagesActions.fetchWithAnotherUser.defer(this.state.agent.attributes.user_id, 'AdminUser')
    }
  }

  checkAgentStatus() {
    if (this.state.agent.attributes !== undefined) {
      AgentActions.fetchById.defer(this.state.agent.id)
    }
  }

  onSessionStateChange(state) {
    if (!SessionStore.isCurrentUserEmployer()) {
      window.location.href = "/employer-login.html"
    }
    else if (state.authToken === null) {
      window.location.href = "/employer-login.html"
    }
  }

  onAgentChange(state) {
    this.setState({agent: state.agent})
  }

  onSkillsChange(state) {
    let skills = []
    state.skills.data.map(skill => {
      let object = {
        id: skill.id,
        name: skill.attributes.name
      }
      skills.push(object)
    })
    this.setState({skills:skills})
  }

  onCitiesChange(state) {
    let cities = []
    state.cities.data.map(city => {
      let object = {
        id: city.id,
        name: city.attributes.full_name
      }
      cities.push(object)
    })
    this.setState({cities:cities})
  }

  onCompensationsChange(state) {
    let compensations = []
    state.compensations.data.map(compensation => {
      let object = {
        id: compensation.id,
        name: compensation.attributes.name
      }
      compensations.push(object)
    })
    this.setState({compensations:compensations})
  }

  onEmploymentTypesChange(state) {
    let employmentTypes = []
    state.employmentTypes.data.map(type => {
      let object = {
        id: type.id,
        name: type.attributes.name
      }
      employmentTypes.push(object)
    })
    this.setState({employmentTypes:employmentTypes})
  }

  onAccountInfoChange(state) {
    this.setState({account: state.account})
    if (state.account.data !== undefined) {
      AgentActions.fetchById.defer(state.account.data.relationships.agent.data.id)
    }
  }

  onEmployerInfoChange(state) {
    this.setState({
      employer: state.employerInfo,
      conversations: state.conversations,
      account: state.accountInfo
    })
    if (this.state.employer !== null && this.state.employer !== undefined && state.loading === false) {
      let accountId = this.state.account.id;
      setTimeout(function() {
        AccountsActions.fetchById(accountId)
      }, 0)
    }
  }

  onEmployerPositionsStoreChange(state) {
    if (state.deleted) {
      this.setState({activeContent: 'Jobs'})
      EmployerPositionsActions.fetchByEmployerIdWithFilter.defer(SessionStore.getEmployerContactId(),
        this.state.filters, this.state.jobStatusFilter)
      EmployersActions.getRecentConversations.defer(SessionStore.getEmployerContactId())
    } else if (state.position !== null) {
      this.setState({activePosition: state.position})
    } else {
      this.setState({positions: state.positions})
    }
  }

  onSearchStoreChange(state) {
    this.setState({matchesForPosition: state.matches})
  }

  onMessagesChange(state) {
    if (state.loading === false && this.state.messages.length !== state.messages.length && !state.messageSending) {
      this.setState({
        messages: state.messages
      })
    }
    else if (state.loading === false && this.state.messages.length === state.messages.length && !state.messageSending) {
      if (this.state.messages.length > 0 && this.state.messages[0].id !== state.messages[0].id) {
        this.setState({
          messages: state.messages
        })
      }
    }
  }

  onTalentProfileMatchesChange(state) {
    if (state.errorStatus !== null && state.errorStatus !== undefined) {
      if (state.errorStatus.toString() === '404') {
        this.setState({activeContent: 'Jobs'})
      }
    } if (state.match !== null) {
      this.setState({activeMatch: state.match})

      if (this.nextActiveContent === 'Match Details') {
        this.showCandidateDetailsScreen()
      }
    } else {
      this.setState({
        matchesForPosition: state.matches,
        matchesLiked: state.matchesLiked,
        matchesInterested: state.matchesInterested,
        matchesOffer: state.matchesOffer
      })
    }
  }

  showCandidateDetailsScreen() {
    let positionId = this.state.activeMatch.attributes.position_id
    EmployerPositionsActions.fetchByPositionId.defer(SessionStore.getEmployerContactId(), positionId)
    TalentProfileMatchesActions.fetchByPositionId.defer(positionId)
    this.candidateClick(this.state.activeMatch)
  }

  filterSkillChanged(skill) {
    let filters = this.state.filters
    if (skill.id !== 0) {
      filters['skill'] = skill.id
    }
    else {
      delete filters['skill']
    }
    this.setState({filters: filters})
    EmployerPositionsActions.fetchByEmployerIdWithFilter(SessionStore.getEmployerContactId(),
      this.state.filters, this.state.jobStatusFilter)
  }

  filterCompensationChanged(compensation) {
    let filters = this.state.filters
    if (compensation.id !== 0) {
      filters['compensation'] = compensation.id
    }
    else {
      delete filters['compensation']
    }

    this.setState({filters: filters})
    EmployerPositionsActions.fetchByEmployerIdWithFilter(SessionStore.getEmployerContactId(),
      this.state.filters, this.state.jobStatusFilter)
  }

  filterLocationChanged(location) {
    let filters = this.state.filters
    if (location.id !== 0) {
      filters['location'] = location.id
    }
    else {
      delete filters['location']
    }
    this.setState({filters: filters})
    EmployerPositionsActions.fetchByEmployerIdWithFilter(SessionStore.getEmployerContactId(),
      this.state.filters, this.state.jobStatusFilter)
  }

  statusFilterChange(newStatus) {
    this.setState({jobStatusFilter: newStatus})
    EmployerPositionsActions.fetchByEmployerIdWithFilter(SessionStore.getEmployerContactId(),
      this.state.filters, newStatus)
  }

  addJobClick() {
    this.setState({activeContent: 'Add Job'})
  }

  deleteJobClick(job) {
    if (window.confirm("Are you sure you want to delete this job?") === true) {
      EmployerPositionsActions.deletePosition(SessionStore.getEmployerContactId(), job.id)
    }
  }

  positionClickDetails(position) {
    TalentProfileMatchesActions.fetchByPositionId(position.id)
    this.setState({
      activeContent: 'Position Details',
      activePosition: position
    })
  }

  positionClickMessages(position) {
    this.setState({
      activePosition: position,
      activeContent: 'Messages'
    })
    MessagesActions.fetchForPositionId.defer(position.id)
  }

  messageSent() {
    this.getMessagesFromServer()
    EmployersActions.getRecentConversations.defer(SessionStore.getEmployerContactId())
  }

  onConversationClick(jobId, userId) {
    this.setState({
      sendMessageToUserId: userId,
      activeContent: 'Messages'
    })
    EmployerPositionsActions.fetchByPositionId(SessionStore.getEmployerContactId(), jobId)
    MessagesActions.fetchForPositionIdWithAnotherUser.defer(jobId, userId, 'User')
  }

  candidateClick(match) {
    this.setState({
      activeContent: 'Match Details',
      activeMatch: match
    })
  }

  inviteCoworkersClick() {
    this.setState({activeContent: 'Invite Coworkers'})
  }

  editCompanyProfileClick() {
    this.setState({activeContent: 'Company Profile'})
  }

  editEmployerProfileClick() {
    // Need employer profile mockup
  }

  messagePopupClose() {
    this.setState({showPopup: false})
  }

  returnJobListingClick(reloadJobs) {
    let employerId = SessionStore.getEmployerContactId()
    EmployerPositionsActions.fetchByEmployerId.defer(employerId, this.state.jobStatusFilter)
    this.setState({activeContent: 'Jobs'})
  }

  onMakeOfferClick(match) {
    this.setState({
      activeContent: 'Offer Form',
      activeMatch: match
    })
  }

  showMessagesWithMatch(match) {
    let userId = match.talent_profile.attributes.user_id
    this.setState({
      sendMessageToUserId: userId,
      activeMatch: match,
      activeContent: 'Messages',
      matchInterested: true
    })
    EmployerPositionsActions.fetchByPositionId(SessionStore.getEmployerContactId(), match.attributes.position_id)
    MessagesActions.fetchForPositionIdWithAnotherUser.defer(match.attributes.position_id, userId, 'User')
  }

  interestedOnTalentClick(match) {
    TalentProfileMatchesActions.employerInterested(match.attributes.position_id, match.id)
    this.showMessagesWithMatch(match)
  }

  notInterestedOnTalentClick(match) {

  }

  offerSent() {
    this.setState({
      activeContent: 'Jobs'
    })
  }

  closeMatchDetails() {
    this.setState({
      activeContent: 'Position Details'
    })
  }

  onAgentClick() {
    MessagesActions.fetchWithAnotherUser(this.state.agent.attributes.user_id, 'AdminUser')
    this.setState({activeContent: 'Agent Messages'})
  }

  handleNavClick(index) {
    this.setState({activeContent: ITEMS[index]});
    if (ITEMS[index] === "Messages") {
      this.showMostRecentConversation()
    }
  }

  showMostRecentConversation() {
    if (this.state.conversations.length > 0) {
      let conversation = this.state.conversations[0]
      this.onConversationClick(conversation.job_id, conversation.user_id)
    }
  }

  onMobileConversationClick(conversation) {
    this.onConversationClick(conversation.job_id, conversation.user_id)
  }

  onLogoutClick() {
    SessionActions.logout(SessionStore.getAuthToken())
  }

  currentContent() {
    switch (this.state.activeContent) {
      case "Company Profile":
        return <EmployerDashboardCompanyProfile account={this.state.account}
                                                onReturnClick={this.returnJobListingClick.bind(this)} />
        break;
      case "Jobs":
        return <EmployerPositions items={this.state.positions} onClickDetails={this.positionClickDetails.bind(this)}
                                  statusFilter={this.state.jobStatusFilter}
                                  onStatusFilterChange={this.statusFilterChange.bind(this)}
                                  onAddJobClick={this.addJobClick.bind(this)} />
        break
      case "Add Job":
        return <EmployerAddJob skills={this.state.skills}
                               cities={this.state.cities}
                               compensations={this.state.compensations}
                               employmentTypes={this.state.employmentTypes}
                               onBackClick={this.returnJobListingClick.bind(this)}
                               mobileDevice={this.state.mobileDevice}/>
        break;
      case "Position Details":
        return <EmployerPositionDetails item={this.state.activePosition}
                                        matchesForPosition={this.state.matchesForPosition}
                                        matchesLiked={this.state.matchesLiked}
                                        matchesInterested={this.state.matchesInterested}
                                        matchesOffer={this.state.matchesOffer}
                                        onBackClick={this.returnJobListingClick.bind(this)}
                                        onMessagesClick={this.positionClickMessages.bind(this)}
                                        onDeleteJobClick={this.deleteJobClick.bind(this)}
                                        onFetchedCandidateClick={this.candidateClick.bind(this)}
                                        onInterestedCandidateClick={this.showMessagesWithMatch.bind(this)} />
        break;
      case "Match Details":
        return <EmployerDashboardTalentProfile match={this.state.activeMatch}
                                               interestOnMatch={this.state.matchInterested}
                                               onInterestedClick={this.interestedOnTalentClick.bind(this)}
                                               onNotInterestedClick={this.notInterestedOnTalentClick.bind(this)}
                                               onReturnClick={this.closeMatchDetails.bind(this)} />
        break;
      case "Offer Form":
        return <EmployerOfferForm position={this.state.activePosition}
                                  match={this.state.activeMatch}
                                  account={this.state.account}
                                  employmentTypes={this.state.employmentTypes}
                                  onOfferSent={this.offerSent.bind(this)}
                                  onBackButtonClick={this.returnJobListingClick.bind(this)} />
        break;
      case "Messages":
        return <MessagingPanel key="messages-key" job={this.state.activePosition} messages={this.state.messages}
                               toUserId={this.state.sendMessageToUserId}
                               viewType="employer_contact"
                               informationPanel="talent"
                               match={this.state.activeMatch}
                               talent={this.state.activeMatch.talent_profile}
                               onMakeOfferClick={this.onMakeOfferClick.bind(this)}
                               onMessageSent={this.messageSent.bind(this)}
                               onReturnClick={this.returnJobListingClick.bind(this)}/>
        break;
      case "Mobile Messages":
        return <MobileMessagingList job={this.state.activeJob} conversations={this.state.conversations}
                              viewType="talent_profile"
                              toUserId={this.state.sendMessageToUserId}
                              account={this.state.currentAccount}
                              informationPanel='company'
                              onConversationClick={this.onMobileConversationClick.bind(this)}
                              onReturnClick={this.returnJobListingClick.bind(this)}/>
        break;

      case "Agent Messages":
        return <MessagingPanel key="agent-messages-key" messages={this.state.messages}
                               toUserId={this.state.agent.attributes.user_id}
                               viewType="employer_contact"
                               informationPanel="agent"
                               agent={this.state.agent.attributes}
                               onMessageSent={this.messageSent.bind(this)}
                               onReturnClick={this.returnJobListingClick.bind(this)}/>
        break;

      case "Invite Coworkers":
        return <EmployerInviteCoworkers />
        break;
    }
  }

  mobileButtons() {
    if (this.state.activeContent === "Jobs") {
      return (
        <div className="mobile-buttons">
          <div className="ui button green add-job-button" onClick={this.addJobClick.bind(this)}>
            ADD NEW JOB
          </div>
          <div className="ui button green edit-profile" onClick={this.editEmployerProfileClick.bind(this)}>
            EDIT PROFILE
          </div>
          <div className="ui button green edit-company-profile" onClick={this.editCompanyProfileClick.bind(this)}>
            EDIT COMPANY PROFILE
          </div>
        </div>
      )
    } else {
      return (<div></div>)
    }
  }

  render() {
    let agentPanel = ''
    if (this.state.agent.attributes !== undefined) {
      agentPanel = <EmployerDashboardAgent agent={this.state.agent} onClick={this.onAgentClick.bind(this)} />
    }
    return (
      <div className="dashboard">
        <TalentNavbar handleNavClick={this.handleNavClick.bind(this)} items={ITEMS} selectedItem={this.state.activeContent}
                      onLogoutClick={this.onLogoutClick.bind(this)} />
        <main className="ui grid">
            <div className="three wide column left-sidebar">
              <EmployerAccountSummary item={this.state.account}
                                      onInviteCoworkersClick={this.inviteCoworkersClick.bind(this)} />
              <EmployerAccountFilters skills={this.state.skills}
                                      locations={this.state.cities}
                                      compensations={this.state.compensations}
                                      onSelectedSkillChanged={this.filterSkillChanged.bind(this)}
                                      onSelectedCompensationChanged={this.filterCompensationChanged.bind(this)}
                                      onSelectedLocationChanged={this.filterLocationChanged.bind(this)} />
              <EmployerDashboardActionsPanel onInviteCoworkersClick={this.inviteCoworkersClick.bind(this)}
                                             onEditCompanyProfileClick={this.editCompanyProfileClick.bind(this)}
                                             onEditEmployerProfileClick={this.editEmployerProfileClick.bind(this)} />
            </div>
            <div className="ten wide column middle-column">
              <div id="dashboardContent">
                {this.currentContent()}

                {this.mobileButtons()}
              </div>
            </div>
            <div className="three wide column right-sidebar">
              <div className="ui grid">
                <div className="center aligned sixteen wide column">
                  <DashboardConversations conversations={this.state.conversations}
                                          onConversationClick={this.onConversationClick.bind(this)} />
                </div>
                <div className="center aligned sixteen wide column">
                  {agentPanel}
                </div>
              </div>
            </div>
        </main>
        <DashboardFooter />
      </div>
    )
  }
}

class EmployerDashboardActionsPanel extends React.Component
{
  render() {
    return (
      <div className="actions-panel">
        <div className="ui button green invite" onClick={this.props.onInviteCoworkersClick}>INVITE</div>
        <div className="invite-note">Invite other internal hiring managers for your company</div>

        <div className="edit-buttons">
          <div className="ui button green" onClick={this.props.onEditCompanyProfileClick}>EDIT COMPANY</div>
          <div className="ui button green" onClick={this.props.onEditEmployerProfileClick}>EDIT YOUR PROFILE</div>
        </div>
      </div>
    )
  }
}

const ITEMS = ["Jobs", "Messages", "Mobile Messages"];

React.render(
  <EmployerDashboard />,
  document.getElementById("employerDashboard")
)

import Constants from '../constants/api-constants'
import UIConstants from '../constants/ui-constants'

// Components
import BaseProtectedComponent from './base-protected-component'
import DashboardFooter from './dashboard-footer'
import CompanyInformationPanel from './company-information-panel'
import TalentNavbar from './talent-navbar'
import TalentSummary from './talent-summary'
import TalentDashboardJobs from './talent-dashboard-jobs'
import MessagingPanel from './messaging-panel'
import TalentDashboardJobDetails from './talent-dashboard-job-details'
import SelectedAgent from './selected-agent'
import DashboardConversations from './dashboard-conversations'
import TalentDashboardCompanyProfile from './talent-dashboard-company-profile'
import TalentDashboardEditProfile from './talent-dashboard-edit-profile'
import TalentDashboardOffers from './talent-dashboard-offers'
import TalentDashboardOfferAccepted from './talent-dashboard-offer-accepted'
import TalentDashboardOfferDeclined from './talent-dashboard-offer-declined'
import TalentDashboardNoMatches from './talent-dashboard-no-matches'
import TalentDashboardNotInterested from './talent-dashboard-not-interested'
import MobileMessagingList from './mobile-messaging-list'

// Actions
import CitiesActions from '../actions/cities-actions'
import CompensationsActions from '../actions/compensations-actions'
import CulturesActions from '../actions/cultures-actions'
import SkillsActions from '../actions/skills-actions'
import TalentProfileActions from '../actions/talent-profile-actions'
import AgentActions from '../actions/agent-actions'
import EmployersActions from '../actions/employers-actions'
import TalentProfileJobsActions from '../actions/talent-profile-jobs-actions'
import MessagesActions from '../actions/messages-actions'
import OffersActions from '../actions/offers-actions'
import SessionActions from '../actions/session-actions'
import TalentProfileMatchesActions from '../actions/talent-profile-matches-actions'
import EmailHandlerActions from '../actions/email-handler-actions'

// Stores
import AgentStore from '../stores/agent-store'
import CitiesStore from '../stores/cities-store'
import CompensationsStore from '../stores/compensations-store'
import CulturesStore from '../stores/cultures-store'
import SkillsStore from '../stores/skills-store'
import SessionStore from '../stores/session-store'
import TalentProfileStore from '../stores/talent-profile-store'
import EmployersStore from '../stores/employers-store'
import TalentProfileJobsStore from '../stores/talent-profile-jobs-store'
import MessagesStore from '../stores/messages-store'
import OffersStore from '../stores/offers-store'
import EmailHandlerStore from '../stores/email-handler-store'
import TalentProfileMatchesStore from '../stores/talent-profile-matches-store'

class TalentDashboard extends BaseProtectedComponent {
  constructor(props) {
    super(props);
    this.handleNavClick.bind(this);
    let profile_id = SessionStore.getTalentProfileId();
    TalentProfileActions.fetch(profile_id);
    this.agent_id = ""
    this.state = {
      activeContent: ITEMS[0],
      profile: {},
      activeJob: {},
      conversations: [],
      skills: [],
      cities: [],
      cultures: [],
      compensations: [],
      sendMessageToUserId: 0,
      currentMatch: null,
      currentEmployer: null,
      currentAccount: null,
      agent: {},
      messages: [],
      currentOffer: null
    }
    this.nextContent = ''

    TalentProfileActions.getRecentConversations(profile_id)
    SkillsActions.fetchAllSkills()
    CitiesActions.fetch()
    CompensationsActions.fetch()
    CulturesActions.fetch()

    this.getMessagesFromServer()
    setInterval(this.getMessagesFromServer.bind(this), UIConstants.MESSAGES_REFRESH_INTERVAL)
    setInterval(this.checkAgentStatus.bind(this), UIConstants.AGENT_REFRESH_INTERVAL)
    setInterval(this.refreshOffers.bind(this), UIConstants.TALENT_OFFERS_REFRESH_INTERVAL)
    setInterval(this.refreshJobs.bind(this), UIConstants.TALENT_JOBS_INTERVAL)
  }

  componentWillMount() {
    AgentStore.listen(this.onAgentChange.bind(this))
    TalentProfileStore.listen(this.onTalentProfileChange.bind(this))
    TalentProfileJobsStore.listen(this.onJobsChange.bind(this))
    MessagesStore.listen(this.onMessagesChange.bind(this))
    EmployersStore.listen(this.onEmployersChange.bind(this))
    OffersStore.listen(this.onOffersChange.bind(this))
    SessionStore.listen(this.onSessionChange.bind(this))
    SkillsStore.listen(this.onSkillsChange.bind(this))
    CitiesStore.listen(this.onCitiesChange.bind(this))
    CompensationsStore.listen(this.onCompensationsChange.bind(this))
    CulturesStore.listen(this.onCulturesChange.bind(this))
    TalentProfileMatchesStore.listen(this.onTalentProfileMatchesChange.bind(this))

    let role = EmailHandlerStore.getRole()
    if (role === 'talent') {
      let screen = EmailHandlerStore.getScreen()
      if (screen === 'job_details') {
        let positionId = EmailHandlerStore.getPositionId()
        let matchId = EmailHandlerStore.getMatchId()
        TalentProfileJobsActions.fetchPositionById.defer(positionId)
        TalentProfileMatchesActions.fetchById(SessionStore.getTalentProfileId(), matchId)
        this.setState({activeContent: 'Job Detail'})
        this.nextContent = 'Job Detail'
      }
    }
    EmailHandlerActions.clearValues()
  }

  componentWillUnmount() {
    AgentStore.unlisten(this.onAgentChange.bind(this))
    TalentProfileStore.unlisten(this.onTalentProfileChange.bind(this))
    TalentProfileJobsStore.unlisten(this.onJobsChange.bind(this))
    MessagesStore.unlisten(this.onMessagesChange.bind(this))
    EmployersStore.unlisten(this.onEmployersChange.bind(this))
    OffersStore.unlisten(this.onOffersChange.bind(this))
    SessionStore.unlisten(this.onSessionChange.bind(this))
    SkillsStore.unlisten(this.onSkillsChange.bind(this))
    CitiesStore.unlisten(this.onCitiesChange.bind(this))
    CompensationsStore.unlisten(this.onCompensationsChange.bind(this))
    CulturesStore.unlisten(this.onCulturesChange.bind(this))
    TalentProfileMatchesStore.listen(this.onTalentProfileMatchesChange.bind(this))
  }

  refreshJobs() {
    if (this.state.activeContent === 'Fetched Jobs' || this.state.activeContent === 'No Matches Found') {
      let profile_id = SessionStore.getTalentProfileId();
      TalentProfileJobsActions.fetchById.defer(profile_id)
    } else if (this.state.activeContent === 'Job Detail' && this.state.activeJob !== null) {
      let jobId = this.state.activeJob.id
      TalentProfileJobsActions.fetchPositionById.defer(jobId)
    }
  }

  refreshOffers() {
    if (this.state.activeContent === 'Offers') {
      OffersActions.fetchByTalent.defer()
    }
  }

  checkAgentStatus() {
    if (this.state.agent.attributes !== undefined) {
      AgentActions.fetchById.defer(this.state.agent.id)
    }
  }

  getMessagesFromServer() {
    if (this.state.activeJob !== null && this.state.activeContent === 'Messages') {
      MessagesActions.fetchForPositionId.defer(this.state.activeJob.id)
    }
    else if (this.state.activeContent === 'Agent Messages') {
      MessagesActions.fetchWithAnotherUser.defer(this.state.agent.attributes.user_id, 'AdminUser')
    }
  }

  onAgentChange(state) {
    this.setState({agent: state.agent})
  }

  onSessionChange(state) {
    if (state.authToken === null) {
      window.location.href = '/talent-login.html'
    }
  }

  onTalentProfileMatchesChange(state) {
    if (state.loading === false && state.match !== null) {
      this.setState({currentMatch: state.match})
    }
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

  onCulturesChange(state) {
    let cultures = []
    state.cultures.data.map(culture => {
      let object = {
        id: culture.id,
        name: culture.attributes.name
      }
      cultures.push(object)
    })
    this.setState({cultures: cultures})
  }

  onTalentProfileChange(state) {
    this.setState({
      profile: state.talent_profile,
      conversations: state.conversations
    });
    AgentActions.fetchById.defer(state.talent_profile.agent_id);
    TalentProfileJobsActions.fetchById.defer(this.state.profile.id)
    OffersActions.fetchByTalent.defer()
  }

  onJobsChange(state) {
    if (state.errorStatus !== null) {
      if (state.errorStatus.toString() === '404') {
        this.setState({activeContent: 'Fetched Jobs'})
        this.refreshJobs()
      }
    } else if (state.loadedJobById === true && state.activeJob !== null && state.activeJob !== undefined
        && state.matchRejected === false) {
      EmployersActions.fetchById.defer(state.activeJob.relationships.employer_contact.data.id)
      this.setState({activeJob:state.activeJob})
    }

    if (state.matches === null || state.matches === undefined || state.matches.length === 0) {
      this.setState({activeContent: "No Matches Found"})
    } else if (state.matches.length > 0 && this.state.activeContent === 'No Matches Found') {
      this.setState({activeContent: 'Fetched Jobs'})
    }
  }

  onOffersChange(state) {
    if (state.loading === false || state.offerUpdated) {
      this.setState({offers: state.offers})
    }
  }

  onEmployersChange(state) {
    this.setState({
      currentEmployer: state.employerInfo,
      currentAccount: state.accountInfo
    })
  }

  onMessagesChange(state) {
    if (state.loading === false && this.state.messages.length !== state.messages.length) {
      this.setState({
        messages: state.messages
      })
    }
    else if (state.loading === false && this.state.messages.length === state.messages.length) {
      if (this.state.messages.length > 0 && this.state.messages[0].id !== state.messages[0].id) {
        this.setState({
          messages: state.messages
        })
      }
    }
  }

  onJobDetailsClick(jobId, match) {
    TalentProfileJobsActions.fetchPositionById.defer(jobId)
    this.setState({
      currentMatch: match,
      activeContent: 'Job Detail'
    })
  }

  onInterestedClick(job) {
    TalentProfileJobsActions.likeMatch(this.state.profile.id, this.state.currentMatch.id)
  }

  onNotInterestedClick(job) {
    TalentProfileJobsActions.rejectMatch(this.state.profile.id, this.state.currentMatch.id)
    this.setState({
      activeJob: job,
      activeContent: 'Fetched Jobs'
    })
  }

  onChangeInterestedScreen() {
    let match = this.state.currentMatch
    match.attributes.status = 'liked'
    this.setState({currentMatch: match})
  }

  onOfferAcceptClick(offer) {
    OffersActions.acceptOffer(offer)
    this.setState({
      activeContent: 'Offer Accepted',
      currentOffer: offer
    })
  }

  onOfferRejectClick(offer) {
    this.setState({activeContent: 'Offer Declined', offer: offer})
  }

  onOfferSendRejectClick(offer, reason) {
    OffersActions.rejectOffer(offer, reason)
    this.setState({activeContent: 'Fetched Jobs'})
  }

  onMessageSent() {
    this.getMessagesFromServer()
    TalentProfileActions.getRecentConversations.defer(SessionStore.getTalentProfileId())
  }

  onJobMessagesClick(jobId, userId) {
    this.setState({
      sendMessageToUserId: userId,
      activeContent: 'Messages'
    })
    TalentProfileJobsActions.fetchPositionById.defer(jobId)
    MessagesActions.fetchForPositionIdWithAnotherUser.defer(jobId, userId, 'User')
  }

  onConversationClick(jobId, userId) {
    this.setState({
      sendMessageToUserId: userId,
      activeContent: 'Messages'
    })
    TalentProfileJobsActions.fetchPositionById.defer(jobId)
    MessagesActions.fetchForPositionIdWithAnotherUser.defer(jobId, userId, 'User')
  }

  onAccountClick(account) {
    this.setState({
      currentAccount: account,
      activeContent: "Company Profile"
    })
  }

  onEditProfileClick() {
    this.setState({
      activeContent: "Edit Profile"
    })
  }

  onReturnJobListingClick() {
    TalentProfileJobsActions.fetchById.defer(this.state.profile.id)
    this.setState({activeContent:'Fetched Jobs'})
  }

  onAgentClick() {
    this.setState({activeContent: 'Agent Messages'})
    MessagesActions.fetchWithAnotherUser(this.state.agent.attributes.user_id, 'AdminUser')
  }

  handleNavClick(index) {
    this.setState({activeContent: ITEMS[index]});
    if (ITEMS[index] === "Fetched Jobs") {
      TalentProfileJobsActions.fetchById.defer(this.state.profile.id)
    }
    else if (ITEMS[index] === "Messages") {
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
    SessionActions.logout.defer(SessionStore.getAuthToken())
  }

  currentContent() {
    switch (this.state.activeContent) {
      case "Fetched Jobs":
        return <TalentDashboardJobs talent_profile_id={this.state.profile.id}
                                    onJobDetailsClick={this.onJobDetailsClick.bind(this)}/>
        break;
      case "Job Detail":
        if (this.state.activeJob !== null && this.state.currentEmployer !== null && this.state.currentAccount !== null
            && this.state.currentMatch !== null) {
          return <TalentDashboardJobDetails job={this.state.activeJob}
                                            employer={this.state.currentEmployer}
                                            account={this.state.currentAccount}
                                            match={this.state.currentMatch}
                                            onInterestedClick={this.onInterestedClick.bind(this)}
                                            onNotInterestedClick={this.onNotInterestedClick.bind(this)}
                                            onChangeInterestedScreen={this.onChangeInterestedScreen.bind(this)}
                                            onAccountClick={this.onAccountClick.bind(this)}
                                            onMessagesClick={this.onJobMessagesClick.bind(this)}
                                            onReturnClick={this.onReturnJobListingClick.bind(this)}/>

        }
        break
      case "Messages":
        return <MessagingPanel job={this.state.activeJob} messages={this.state.messages}
                              viewType="talent_profile"
                              toUserId={this.state.sendMessageToUserId}
                              account={this.state.currentAccount}
                              informationPanel='company'
                              onMessageSent={this.onMessageSent.bind(this)}
                              onReturnClick={this.onReturnJobListingClick.bind(this)}/>
        break;
        case "Mobile Messages":
          return <MobileMessagingList job={this.state.activeJob} conversations={this.state.conversations}
                                viewType="talent_profile"
                                toUserId={this.state.sendMessageToUserId}
                                account={this.state.currentAccount}
                                informationPanel='company'
                                onConversationClick={this.onMobileConversationClick.bind(this)}
                                onReturnClick={this.onReturnJobListingClick.bind(this)}/>
          break;
      case "Company Profile":
        return <TalentDashboardCompanyProfile account={this.state.currentAccount}
                                              onReturnClick={this.onReturnJobListingClick.bind(this)} />
        break;

      case "Edit Profile":
        return <TalentDashboardEditProfile talent={this.state.profile}
                                           skills={this.state.skills}
                                           cities={this.state.cities}
                                           cultures={this.state.cultures}
                                           compensations={this.state.compensations}
                                           onReturnClick={this.onReturnJobListingClick.bind(this)}/>
        break;

      case "No Matches Found":
        return <TalentDashboardNoMatches />
        break;

      case "Not Interested":
        return <TalentDashboardNotInterested job={this.state.activeJob}
                                             account={this.state.currentAccount} />
        break;
      case "Offers":
        if (this.state.offers !== undefined) {
          return <TalentDashboardOffers offers={this.state.offers}
                                        onOfferAcceptClick={this.onOfferAcceptClick.bind(this)}
                                        onOfferRejectClick={this.onOfferRejectClick.bind(this)}/>
        }
        break;
      case "Offer Accepted":
        return <TalentDashboardOfferAccepted offer={this.state.currentOffer}
                                             profile={this.state.profile} />
        break;
      case "Offer Declined":
        return <TalentDashboardOfferDeclined offer={this.state.offer}
                                             onSubmitReasons={this.onOfferSendRejectClick.bind(this)}/>
        break;
      case "Agent Messages":
        return <MessagingPanel key="agent-messages-key" messages={this.state.messages}
                               toUserId={this.state.agent.attributes.user_id}
                               viewType="talent_profile"
                               informationPanel="agent"
                               agent={this.state.agent.attributes}
                               onMessageSent={this.onMessageSent.bind(this)}
                               onReturnClick={this.onReturnJobListingClick.bind(this)}/>
        break;
    }
  }

	render() {
    let agentPanel = ''
    if (this.state.agent.attributes !== undefined) {
      agentPanel = <SelectedAgent agent={this.state.agent} onClick={this.onAgentClick.bind(this)} />
    }
		return (
      <div className="talentDashboard">
        <TalentNavbar handleNavClick={this.handleNavClick.bind(this)} items={ITEMS} selectedItem={this.state.activeContent}
                      onLogoutClick={this.onLogoutClick.bind(this)} />
        <main className="ui grid">
            <div className="three wide column left-sidebar">
              <TalentSummary profile={this.state.profile}
                             onEditProfileClick={this.onEditProfileClick.bind(this)} />
            </div>
            <div className="ten wide column center-content">
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
                <div className="center aligned sixteen wide column">
                  <div className="ui green button edit-profile mobile" onClick={this.onEditProfileClick.bind(this)}>
                    EDIT PROFILE
                  </div>
                  {agentPanel}
                </div>
              </div>
            </div>
        </main>
        <DashboardFooter />
      </div>
		);
	}
}
const ITEMS = ["Fetched Jobs", "Messages", "Mobile Messages", "Offers"];

React.render(
  <TalentDashboard />,
  document.getElementById("talentDashboard")
);

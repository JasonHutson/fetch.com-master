import alt from '../dispatchers/alt';
import SessionActions from '../actions/session-actions';
import EmailHandlerActions from '../actions/email-handler-actions'

class SessionStore {
  constructor() {
    this.userEmail = ''
    this.authToken = ''
    this.talent_profile_id = ''
    this.employer_contact_id = ''
    this.agent_id = ''
    this.loading = false
    this.loginFailed = false
    this.bindAction(SessionActions.login, this.onLogin)
    this.bindAction(SessionActions.loginSuccess, this.onLoginSuccess)
    this.bindAction(SessionActions.loginFailed, this.onLoginFailed)
    this.bindAction(SessionActions.loginFromOmniAuth, this.onLogin)
    this.bindAction(SessionActions.logoutSuccess, this.onLogoutSuccess)

    this.exportPublicMethods({
      getAuthToken: this.getAuthToken,
      setAuthToken: this.setAuthToken,
      getEmail: this.getEmail,
      getTalentProfileId: this.getTalentProfileId,
      getEmployerContactId: this.getEmployerContactId,
      getAgentId: this.getAgentId,
      isCurrentUserEmployer: this.isCurrentUserEmployer,
      isCurrentUserAgent: this.isCurrentUserAgent
    })
  }

  onLogin() {
    sessionStorage.removeItem('authToken')
    sessionStorage.removeItem('email')
    sessionStorage.removeItem('talent_profile_id')
    sessionStorage.removeItem('employer_contact_id')
    sessionStorage.removeItem('agent_id')

    this.loading = true
  }

  onLoginSuccess(loginData) {
    sessionStorage.setItem('authToken', loginData.data.attributes.auth_token)
    sessionStorage.setItem('email', loginData.data.attributes.email)
    sessionStorage.setItem('talent_profile_id', loginData.data.attributes.talent_profile_id)
    sessionStorage.setItem('employer_contact_id', loginData.data.attributes.employer_contact_id)
    sessionStorage.setItem('agent_id', loginData.data.attributes.agent_id)

    this.loading = false
    this.loginFailed = false
    this.userEmail = loginData.data.attributes.email
    this.authToken = loginData.data.attributes.auth_token
    this.talent_profile_id = loginData.data.attributes.talent_profile_id
    this.employer_contact_id = loginData.data.attributes.employer_contact_id
    this.agent_id = loginData.data.attributes.agent_id
  }

  onLoginFailed() {
    this.loginFailed = true
  }

  onLogoutSuccess(result) {
    sessionStorage.removeItem('authToken')
    sessionStorage.removeItem('email')
    sessionStorage.removeItem('talent_profile_id')
    sessionStorage.removeItem('employer_contact_id')
    sessionStorage.removeItem('agent_id')

    this.loading = false
    this.loginFailed = false
    this.userEmail = null
    this.authToken = null
    this.talent_profile_id = null
    this.employer_contact_id = null
    this.agent_id = null

    EmailHandlerActions.clearValues.defer()
  }

  onLoginFromOmniAuth(loginData) {
    this.onLogin()
    sessionStorage.setItem('authToken', loginData.auth_token)
    sessionStorage.setItem('talent_profile_id', loginData.talent_profile_id)
    sessionStorage.setItem('employer_contact_id', loginData.employer_contact_id)
    this.loading = false
    this.authToken = loginData.auth_token
    this.talent_profile_id = loginData.talent_profile_id
    this.employer_contact_id = loginData.employer_contact_id
  }

  getAuthToken() {
    if (this.authToken === '' || this.authToken === null || this.authToken === undefined) {
      this.authToken = sessionStorage.getItem('authToken')
    }
    return this.authToken
  }

  setAuthToken(token) {
    sessionStorage.setItem('authToken', token)
  }

  getTalentProfileId() {
    if (this.talent_profile_id === '' || this.talent_profile_id === null || this.talent_profile_id === undefined) {
      this.talent_profile_id = sessionStorage.getItem('talent_profile_id')
    }
    return this.talent_profile_id
  }

  getEmployerContactId() {
    if (this.employer_contact_id === '' || this.employer_contact_id === null || this.employer_contact_id === undefined) {
      this.employer_contact_id = sessionStorage.getItem('employer_contact_id')
    }
    return this.employer_contact_id
  }

  getAgentId() {
    if (this.agent_id === '' || this.agent_id === null || this.agent_id === undefined) {
      this.agent_id = sessionStorage.getItem('agent_id')
    }
    return this.agent_id
  }

  getEmail() {
    if (this.userEmail === '' || this.userEmail === null || this.userEmail === undefined) {
      this.userEmail = sessionStorage.getItem('email')
    }
    return this.userEmail
  }

  isCurrentUserEmployer() {
    return (this.employer_contact_id !== '' && this.employer_contact_id !== null && this.employer_contact_id !== undefined)
  }

  isCurrentUserAgent() {
    let result = ((this.agent_id !== '') && (this.agent_id !== null) 
                  && (this.agent_id !== 'undefined') && (this.agent_id !== undefined))
    return result
  }
}

export default alt.createStore(SessionStore)
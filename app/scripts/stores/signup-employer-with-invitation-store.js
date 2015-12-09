import alt from '../dispatchers/alt'
import SignupEmployerWithInvitationActions from '../actions/signup-employer-with-invitation-actions'

class SignupEmployerWithInvitationStore {
  constructor() {
    this.accountId = ''
    this.bindListeners({
      onSetValues: SignupEmployerWithInvitationActions.SET_VALUES,
      onClearValues: SignupEmployerWithInvitationActions.CLEAR_VALUES
    })

    this.exportPublicMethods({
      getAccountId: this.getAccountId,
    })
  }

  getAccountId() {
    return sessionStorage.getItem('accountId')
  }

  onSetValues(accountId) {
    this.accountId = accountId
    sessionStorage.setItem('accountId', this.accountId)
  }

  onClearValues() {
    sessionStorage.removeItem('accountId')
    this.accountId = ''
  }
}

export default alt.createStore(SignupEmployerWithInvitationStore)
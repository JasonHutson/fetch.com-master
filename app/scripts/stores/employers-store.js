import alt from '../dispatchers/alt'
import EmployersActions from '../actions/employers-actions'

class EmployersStore {
  constructor() {
    this.employerInfo = {}
    this.accountInfo = {}
    this.loading = false
    this.sendingEmails = false
    this.conversations = []
    this.loadingConversations = false
    this.bindAction(EmployersActions.fetchById, this.onFetchById)
    this.bindAction(EmployersActions.fetchByIdSuccess, this.onFetchByIdSuccess)
    this.bindAction(EmployersActions.inviteCoworkers, this.onInviteCoworkers)
    this.bindAction(EmployersActions.inviteCoworkersSuccess, this.onInviteCoworkersSuccess)
    this.bindAction(EmployersActions.getRecentConversations, this.onGetRecentConversations)
    this.bindAction(EmployersActions.getRecentConversationsSuccess, this.onGetRecentConversationsSuccess)
  }

  onFetchById() {
    this.loading = true
  }

  onFetchByIdSuccess(result) {
    this.loading = false
    this.employerInfo = result.data

    result.included.forEach(obj => {
      if (obj.type === "accounts") {
        this.accountInfo = obj
      }
    })
  }

  onInviteCoworkers() {
    this.sendingEmails = true
  }

  onInviteCoworkersSuccess(result) {
    this.sendingEmails = false
  }

  onGetRecentConversations() {
    this.loadingConversations = true
  }

  onGetRecentConversationsSuccess(result) {
    this.loadingConversations = false
    this.conversations = result
  }
}

export default alt.createStore(EmployersStore)
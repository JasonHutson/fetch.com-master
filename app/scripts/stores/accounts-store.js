import alt from '../dispatchers/alt'
import AccountsActions from '../actions/accounts-actions'
import EmployersStore from '../stores/employers-store'

class AccountsStore {
  constructor() {
    this.account = []
    this.loading = false
    this.updating = false
    this.bindAction(AccountsActions.fetchById, this.onFetchById)
    this.bindAction(AccountsActions.fetchByIdSuccess, this.onFetchByIdSuccess)
    this.bindAction(AccountsActions.updateAccount, this.onUpdateAccount)
    this.bindAction(AccountsActions.updateAccountSuccess, this.onUpdateAccountSuccess)
  }

  onFetchById() {
    this.loading = true
  }

  onFetchByIdSuccess(account) {
    this.loading = false
    this.account = account
  }

  onUpdateAccount() {
    this.updating = true
  }

  onUpdateAccountSuccess(result) {
    this.updating = false
  }
}

export default alt.createStore(AccountsStore)
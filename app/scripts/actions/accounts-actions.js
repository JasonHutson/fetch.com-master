import alt from '../dispatchers/alt'
import BaseActions from './base-actions'
var Constants = require('../constants/api-constants')

class AccountsActions extends BaseActions {
  fetchById(id) {
    let url = Constants.API_ENDPOINTS.ACCOUNTS_SHOW.replace(':id', id)
    $.ajax({
      url: url,
      type: 'get',
      dataType: 'json',
      headers: super.headersWithToken(),
      success: (result) => {
        this.actions.fetchByIdSuccess(result)
      }
    })
    this.dispatch()
  }

  updateAccount(id, account) {
    let url = Constants.API_ENDPOINTS.ACCOUNTS_UPDATE.replace(':id', id)
    $.ajax({
      url: url,
      type: 'post',
      dataType: 'json',
      method: 'put',
      data: JSON.stringify({
        account: account.attributes
      }),
      headers: super.headersWithToken(),
      success: (result) => {
        this.actions.updateAccountSuccess(result)
      }
    })
    this.dispatch()
  }

  updateAccountSuccess(result) {
    this.dispatch(result)
  }

  fetchByIdSuccess(result) {
    this.dispatch(result)
  }
}

export default alt.createActions(AccountsActions)
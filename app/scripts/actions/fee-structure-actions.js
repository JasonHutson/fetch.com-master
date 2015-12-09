import alt from '../dispatchers/alt'
import BaseActions from './base-actions'
var Constants = require('../constants/api-constants')

class FeeStructureActions extends BaseActions {
  fetch(salary) {
    $.ajax({
      url: Constants.API_ENDPOINTS.FEE_STRUCTURE.replace(':salary', salary),
      type: 'get',
      dataType: 'json',
      headers: super.headersWithToken(),
      success: (data) => {
        this.actions.fetchSuccess(data)
      }
    })
    this.dispatch()
  }

  fetchSuccess(result) {
    this.dispatch(result)
  }
}

export default alt.createActions(FeeStructureActions)
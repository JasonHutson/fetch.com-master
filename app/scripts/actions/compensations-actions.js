import alt from '../dispatchers/alt';
import BaseActions from './base-actions';
var Constants = require("../constants/api-constants");

class CompensationsActions extends BaseActions {
  fetch() {
    $.ajax({
      url: Constants.API_ENDPOINTS.COMPENSATIONS_INDEX,
      type: 'get',
      dataType: 'json',
      headers: super.headersWithoutAuth(),
      success: (data) => {
        this.actions.fetchSuccess(data)
      }
    })
    this.dispatch()
  }

  fetchSuccess(compensations) {
    this.dispatch(compensations)
  }
}

export default alt.createActions(CompensationsActions)
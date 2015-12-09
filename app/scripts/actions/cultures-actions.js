import alt from '../dispatchers/alt';
import BaseActions from './base-actions';
var Constants = require("../constants/api-constants");

class CulturesActions extends BaseActions {
  fetch() {
    $.ajax({
      url: Constants.API_ENDPOINTS.CULTURES_INDEX,
      type: 'get',
      dataType: 'json',
      headers: super.headersWithoutAuth(),
      success: (data) => {
        this.actions.fetchSuccess(data);
      }
    })
    this.dispatch()
  }

  fetchSuccess(cultures) {
    this.dispatch(cultures)
  }
}

export default alt.createActions(CulturesActions)
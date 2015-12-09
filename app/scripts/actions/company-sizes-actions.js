import alt from '../dispatchers/alt';
import BaseActions from './base-actions';
var Constants = require("../constants/api-constants");

class CompanySizesActions extends BaseActions {
  fetch() {
    $.ajax({
      url: Constants.API_ENDPOINTS.COMPANY_SIZES_INDEX,
      type: 'get',
      dataType: 'json',
      headers: super.headersWithoutAuth(),
      success: (data) => {
        this.actions.fetchSuccess(data)
      }
    })
    this.dispatch()
  }

  fetchSuccess(company_sizes) {
    console.log('fetchSuccess: ', company_sizes)
    this.dispatch(company_sizes)
  }
}

export default alt.createActions(CompanySizesActions)
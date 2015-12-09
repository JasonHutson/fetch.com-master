import alt from '../dispatchers/alt'
import BaseActions from './base-actions'
var Constants = require("../constants/api-constants")

class EmploymentTypesActions extends BaseActions {
  fetch() {
    $.ajax({
      url: Constants.API_ENDPOINTS.EMPLOYMENT_TYPES_INDEX,
      type: 'get',
      dataType: 'json',
      headers: super.headersWithoutAuth(),
      success: (data) => {
        this.actions.fetchSuccess(data)
      }
    })
    this.dispatch()
  }

  fetchSuccess(types) {
    this.dispatch(types)
  }
}

export default alt.createActions(EmploymentTypesActions)
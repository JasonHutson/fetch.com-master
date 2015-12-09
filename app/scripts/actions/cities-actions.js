import alt from '../dispatchers/alt'
import BaseActions from './base-actions'
var Constants = require('../constants/api-constants')

class CitiesActions extends BaseActions {
  fetch() {
    $.ajax({
      url: Constants.API_ENDPOINTS.CITIES_INDEX,
      type: 'get',
      dataType: 'json',
      headers: super.headersWithoutAuth(),
      success: (data) => {
        this.actions.fetchSuccess(data)
      }
    })
    this.dispatch()
  }

  fetchSuccess(cities) {
    this.dispatch(cities)
  }
}

export default alt.createActions(CitiesActions)
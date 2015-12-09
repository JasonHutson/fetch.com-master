import alt from '../dispatchers/alt';
import BaseActions from './base-actions';
var Constants = require("../constants/api-constants");

class SearchActions extends BaseActions {
  matchesByPositionId(positionId) {
    let url = Constants.API_ENDPOINTS.SEARCH_MATCHES_BY_POSITION_ID.replace(":id", positionId)
    $.ajax({
      url: url,
      type: 'get',
      dataType: 'json',
      headers: super.headersWithToken(),
      success: (data) => {
        this.actions.matchesByPositionIdSuccess(data)
      }
    })
    this.dispatch()
  }

  matchesByPositionIdSuccess(matches) {
    this.dispatch(matches)
  }
}

export default alt.createActions(SearchActions)
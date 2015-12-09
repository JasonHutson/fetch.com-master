import alt from '../dispatchers/alt';
import BaseActions from './base-actions';
var Constants = require("../constants/api-constants");

class TalentProfileMatchesActions extends BaseActions {
  fetchByPositionId(positionId) {
    $.ajax({
      url: Constants.API_ENDPOINTS.POSITIONS_MATCHES.replace(':position_id', positionId),
      type: 'get',
      dataType: 'json',
      headers: super.headersWithToken(),
      success: (data) => {
        this.actions.fetchByPositionIdSuccess(data)
      },
      error: (event, jqxhr, settings, thrownError) => {
        this.actions.fetchByPositionIdError(event.status)
      }
    })
    this.dispatch()
  }

  fetchByPositionIdSuccess(result) {
    this.dispatch(result)
  }

  fetchByPositionIdError(result) {
    this.dispatch(result)
  }

  fetchById(talentId, matchId) {
    let url = Constants.API_ENDPOINTS.TALENT_PROFILE_MATCH_SHOW.replace(':talent_profile_id', talentId)
                                                               .replace(':id', matchId)
    $.ajax({
      url: url,
      type: 'get',
      dataType: 'json',
      headers: super.headersWithToken(),
      success: (data) => {
        this.actions.fetchByIdSuccess(data)
      }
    })
    this.dispatch()
  }

  fetchByIdSuccess(result) {
    this.dispatch(result)
  }

  employerInterested(positionId, matchId) {
    let url = Constants.API_ENDPOINTS.TALENT_PROFILE_MATCH_INTEREST.replace(':position_id', positionId)
                                                                   .replace(':match_id', matchId)
    $.ajax({
      url: url,
      type: 'post',
      dataType: 'json',
      headers: super.headersWithToken(),
      success: (data) => {
        this.actions.employerInterestedSuccess(data)
      }
    })
    this.dispatch()
  }

  employerInterestedSuccess(result) {
    this.dispatch(result)
  }
}

export default alt.createActions(TalentProfileMatchesActions)

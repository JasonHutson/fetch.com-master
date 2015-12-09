import alt from '../dispatchers/alt';
import BaseActions from './base-actions';
var Constants = require("../constants/api-constants");

class TalentProfileJobsActions extends BaseActions {
  fetchById(profileId) {
    let url = Constants.API_ENDPOINTS.TALENT_PROFILE_INDEX + "/" + profileId + "/matches"
    $.ajax({
      url: url,
      type: 'get',
      dataType: 'json',
      headers: super.headersWithToken(),
      success: (data) => {
        this.actions.updateTalentProfileJobs(data);
      }
    })
    this.dispatch();
  }

  fetchPositionById(jobId) {
    let url = Constants.API_ENDPOINTS.POSITIONS_GET_BY_ID.replace(':id', jobId)
    $.ajax({
      url: url,
      type: 'get',
      dataType: 'json',
      headers: super.headersWithToken(),
      success: (data) => {
        this.actions.fetchPositionByIdSuccess(data)
      },
      error: (event, jqxhr, settings, thrownError) => {
        this.actions.fetchPositionByIdError(event.status)
      }
    })
    this.dispatch()
  }

  likeMatch(profileId, matchId) {
    let url = Constants.API_ENDPOINTS.TALENT_PROFILE_MATCH_LIKE.replace(':talent_profile_id', profileId).replace(':id', matchId)
    $.ajax({
      url: url,
      type: 'post',
      dataType: 'json',
      headers: super.headersWithToken(),
      success: (data) => {
        this.actions.likeMatchSuccess(profileId, data)
      }
    })
    this.dispatch()
  }

  rejectMatch(profileId, matchId) {
    let url = Constants.API_ENDPOINTS.TALENT_PROFILE_MATCH_REJECT.replace(':talent_profile_id', profileId).replace(':id', matchId)
    $.ajax({
      url: url,
      type: 'post',
      dataType: 'json',
      headers: super.headersWithToken(),
      success: (data) => {
        this.actions.fetchById(profileId)
      }
    })
    this.dispatch()
  }

  updateTalentProfileJobs(agent) {
    this.dispatch(agent);
  }

  fetchPositionByIdSuccess(data) {
    this.dispatch(data)
  }

  fetchPositionByIdError(result) {
    this.dispatch(result)
  }

  likeMatchSuccess(talentId, result) {
    this.dispatch(result)
  }

  rejectMatchSuccess(result) {
    this.dispatch(result)
  }
}

export default alt.createActions(TalentProfileJobsActions);

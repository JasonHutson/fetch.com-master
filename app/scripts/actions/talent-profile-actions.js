import alt from '../dispatchers/alt';
import BaseActions from './base-actions';
var Constants = require("../constants/api-constants");

class TalentProfileActions extends BaseActions {
  fetch(profileId) {
    let url = Constants.API_ENDPOINTS.TALENT_PROFILE_INDEX + "/" + profileId
    $.ajax({
      url: url,
      type: 'get',
      dataType: 'json',
      headers: super.headersWithToken(),
      success: (data) => {
        this.actions.fetchSuccess(data);
      }
    })
    this.dispatch();
  }

  getRecentConversations(talentId) {
    let url = Constants.API_ENDPOINTS.TALENT_PROFILE_RECENT_CONVERSATIONS.replace(':id', talentId)
    $.ajax({
      url: url,
      type: 'get',
      dataType: 'json',
      headers: super.headersWithToken(),
      success: (result) => {
        this.actions.getRecentConversationsSuccess(result)
      }
    })
    this.dispatch()
  }

  updateProfile(talentId, info) {
    let url = Constants.API_ENDPOINTS.TALENT_PROFILE_UPDATE.replace(':id', talentId)
    let profile = info.newTalentProfile
    profile.skill_list = profile.skillset.join()
    $.ajax({
      url: url,
      type: 'post',
      dataType: 'json',
      method: 'put',
      data: JSON.stringify({
        talent_profile: profile,
        cities: profile.location_list,
        cultures: profile.culture,
        resume_file: info.resumeFile,
        picture_file: info.pictureFile
      }),
      headers: super.headersWithToken(),
      success: (result) => {
        this.actions.updateProfileSuccess(talentId, result)
      }
    })
    this.dispatch()
  }

	fetchSuccess(profile) {
    this.dispatch(profile);
  }

  getRecentConversationsSuccess(result) {
    this.dispatch(result)
  }

  updateProfileSuccess(talentId, result) {
    this.dispatch(result)
    this.actions.fetch(talentId)
  }
}

export default alt.createActions(TalentProfileActions);
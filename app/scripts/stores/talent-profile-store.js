import alt from '../dispatchers/alt'
import TalentProfileActions from '../actions/talent-profile-actions'

class TalentProfileStore {
	constructor() {
    this.talent_profile = {}
    this.conversations = []
    this.loadingConversations = false
    this.newTalentProfile = {}
    this.resumeFile = null
    this.resumeFilename = ''
    this.pictureFile = null
    this.pictureFilename = ''
    this.updatedSuccess = false
    this.bindListeners({
      onFetchSuccess: TalentProfileActions.FETCH_SUCCESS,
      onGetRecentConversations: TalentProfileActions.GET_RECENT_CONVERSATIONS,
      onGetRecentConversationsSuccess: TalentProfileActions.GET_RECENT_CONVERSATIONS_SUCCESS,
      onUpdateProfile: TalentProfileActions.UPDATE_PROFILE,
      onUpdateProfileSuccess: TalentProfileActions.UPDATE_PROFILE_SUCCESS
    })
  }

  onFetchSuccess(profile) {
    this.talent_profile = profile.data.attributes
    this.talent_profile.id = profile.data.id
  }

  onGetRecentConversations() {
    this.loadingConversations = true
  }

  onGetRecentConversationsSuccess(result) {
    this.loadingConversations = false
    this.conversations = result
  }

  onUpdateProfile() {
    this.updatedSuccess = false
  }

  onUpdateProfileSuccess(result) {
    this.updatedSuccess = true
  }
}

module.exports = alt.createStore(TalentProfileStore, 'TalentProfileStore');
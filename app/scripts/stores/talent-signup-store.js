import alt from '../dispatchers/alt'
import TalentSignupActions from '../actions/talent-signup-actions'

class TalentSignupStore {
  constructor() {
    this.signupCorrect = false
    this.errors = null
    this.bindAction(TalentSignupActions.createTalentProfileSuccess, this.onCreateTalentProfileSuccess)
    this.bindAction(TalentSignupActions.createUserFailed, this.onCreateUserFailed)
  }

  onCreateTalentProfileSuccess(result) {
    this.signupCorrect = true
  }

  onCreateUserFailed(errors) {
    this.errors = errors
    this.signupCorrect = false
  }

  onPostData() {

  }
}

export default alt.createStore(TalentSignupStore)
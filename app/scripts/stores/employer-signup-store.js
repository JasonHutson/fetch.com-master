import alt from '../dispatchers/alt'
import EmployerSignupActions from "../actions/employer-signup-actions"

class EmployerSignupStore {
  constructor() {
    this.signupCorrect = false
    this.errors = null
    this.bindAction(EmployerSignupActions.createEmployerContactSuccess, this.onCreateEmployerContactSuccess)
    this.bindAction(EmployerSignupActions.createUserFailed, this.onCreateUserFailed)
  }

  onCreateEmployerContactSuccess(result) {
    this.signupCorrect = true
  }

  onCreateUserFailed(errors) {
    this.errors = errors
    this.signupCorrect = false
  }
}

export default alt.createStore(EmployerSignupStore)

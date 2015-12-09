import alt from '../dispatchers/alt'
import ResetPasswordActions from '../actions/reset-password-actions'

class ResetPasswordStore {
  constructor() {
    this.token = ''
    this.success = false
    this.errorMessage = ''
    this.sendEmail = false
    this.bindListeners({
      onSetValues: ResetPasswordActions.SET_VALUES,
      onClearValues: ResetPasswordActions.CLEAR_VALUES,
      onResetPassword: ResetPasswordActions.RESET_PASSWORD,
      onResetPasswordSuccess: ResetPasswordActions.RESET_PASSWORD_SUCCESS,
      onResetPasswordError: ResetPasswordActions.RESET_PASSWORD_ERROR,
      onForgotPasswordSuccess: ResetPasswordActions.FORGOT_PASSWORD_SUCCESS,
      onForgotPasswordError: ResetPasswordActions.FORGOT_PASSWORD_ERROR
    })

    this.exportPublicMethods({
      getToken: this.getToken,
    })
  }

  getToken() {
    return sessionStorage.getItem('reset-password-token')
  }

  onSetValues(token) {
    this.token = token
    sessionStorage.setItem('reset-password-token', this.token)
  }

  onClearValues() {
    sessionStorage.removeItem('reset-password-token')
    this.token = ''
  }

  onResetPassword() {
    this.success = false
    this.errorMessage = ''
  }

  onResetPasswordSuccess(data) {
    this.success = true;
  }

  onResetPasswordError(data) {
    this.errorMessage = data
    this.success = false
  }

  onForgotPasswordSuccess(data) {
    this.sendEmail = true
  }

  onForgotPasswordError(data) {
    if (data === 'null') {
      this.errorMessage = 'Error sending email. Please verify the email address.'
    }
    this.sendEmail = false
  }
}

export default alt.createStore(ResetPasswordStore)

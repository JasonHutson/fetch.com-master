import alt from '../dispatchers/alt';
import BaseActions from './base-actions';
var Constants = require("../constants/api-constants");

class ResetPasswordActions extends BaseActions {
  setValues(token) {
    this.dispatch(token)
  }

  clearValues() {
    this.dispatch()
  }

  forgotPassword(email) {
    let url = Constants.API_ENDPOINTS.USER_FORGOT_PASSWORD
    $.ajax({
      url: url,
      type: 'post',
      dataType: 'json',
      headers: {
        "Accept":"application/vnd.fetchapi.v1+json",
        "Content-Type":"application/json"
      },
      data: JSON.stringify({
        email: email.toLowerCase()
      }),
      success: (data) => {
        this.actions.forgotPasswordSuccess(data)
      },
      error: (xhr, ajaxOptions, thrownError) => {
        this.actions.forgotPasswordError(xhr.responseText)
      }
    })
    this.dispatch()
  }

  resetPassword(password, confirmPassword, token) {
    let url = Constants.API_ENDPOINTS.USER_RESET_PASSWORD
    $.ajax({
      url: url,
      type: 'post',
      dataType: 'json',
      headers: {
        "Accept":"application/vnd.fetchapi.v1+json",
        "Content-Type":"application/json"
      },
      data: JSON.stringify({
        token: token,
        password: btoa(password)
      }),
      success: (data) => {
        this.actions.resetPasswordSuccess(data)
      },
      error: (xhr, ajaxOptions, thrownError) => {
        this.actions.resetPasswordError(xhr.responseText)
      }
    })
    this.dispatch()
  }

  resetPasswordSuccess(data) {
    this.dispatch(data)
  }

  resetPasswordError(data) {
    this.dispatch(data)
  }

  forgotPasswordSuccess(data) {
    this.dispatch(data)
  }

  forgotPasswordError(data) {
    this.dispatch(data)
  }
}

export default alt.createActions(ResetPasswordActions)

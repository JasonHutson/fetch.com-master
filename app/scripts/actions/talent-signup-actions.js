import alt from '../dispatchers/alt'
import BaseActions from './base-actions'
var SessionStore = require("../stores/session-store")

var Constants = require('../constants/api-constants')

class TalentSignupActions extends BaseActions {
  createUser(signupData) {
    $.ajax({
      url: Constants.API_ENDPOINTS.TALENT_SIGNUP,
      type: 'post',
      dataType: 'json',
      data: JSON.stringify({
        user: {
          email: signupData.userDetails.email,
          password: signupData.userDetails.password,
          passwordConfirmation: signupData.userDetails.password_confirmation,
          role: Constants.TALENT_USER
        }
      }),
      headers: super.headersWithoutAuth(),
      success: (result) => {
        SessionStore.setAuthToken(result.data.attributes.auth_token)
        this.actions.createTalentProfile(signupData)
      },
      error: (xhr, ajaxOptions, thrownError) => {
        if (thrownError === 'Unprocessable Entity') {
          this.actions.createUserFailed(xhr.responseJSON.errors)
        }
      }
    })
    this.dispatch()
  }

  createTalentProfile(signupData) {
    $.ajax({
      url: Constants.API_ENDPOINTS.TALENT_PROFILE_CREATE,
      type: 'post',
      dataType: 'json',
      data: JSON.stringify({
        talent_profile: {
          name: signupData.userDetails.firstName + ' ' + signupData.userDetails.lastName,
          time_zone: 'CST',
          salary_range_id: signupData.selectedCompensation.id,
          title: signupData.userDetails.title,
          company: signupData.userDetails.company
        },
        skills: signupData.selectedSkills,
        cities: signupData.selectedLocations,
        cultures: signupData.selectedCultureOptions
      }),
      headers: super.headersWithToken(),
      success: (result) => {
        this.actions.createTalentProfileSuccess(signupData, result)
      },
      error: (xhr, ajaxOptions, thrownError) => {
        console.log(xhr.responseJSON.errors);
        console.log(thrownError);
      }
    })
  }

  createUserSuccess(signupData, result) {
    // this.dispatch(result)
    console.log('createUserSuccess: ', result)
    SessionStore.setAuthToken(result.data.attributes.auth_token)
    this.actions.createTalentProfile(signupData)
  }

  createUserFailed(errors) {
    this.dispatch(errors)
  }

  createTalentProfileSuccess(signupData, result) {
    console.log('createTalentProfileSuccess: ', result)
    this.dispatch(result)
  }
}

export default alt.createActions(TalentSignupActions)
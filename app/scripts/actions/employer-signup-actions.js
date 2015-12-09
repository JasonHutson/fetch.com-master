import alt from '../dispatchers/alt'
import BaseActions from './base-actions'
var SessionStore = require("../stores/session-store")
var SessionActions = require("../actions/session-actions")

var Constants = require('../constants/api-constants')

class EmployerSignupActions extends BaseActions {
  createUser(signupData, accountId) {

    let role = Constants.ACCOUNT_ADMIN
    if (accountId !== undefined && accountId !== null) {
      role = Constants.EMPLOYER_USER
    }

    $.ajax({
      url: Constants.API_ENDPOINTS.EMPLOYER_SIGNUP,
      type: 'post',
      dataType: 'json',
      data: JSON.stringify({
        user: {
          email: signupData.userDetails.email,
          password: signupData.userDetails.password,
          passwordConfirmation: signupData.userDetails.password_confirmation,
          role: role
        }
      }),
      headers: super.headersWithoutAuth(),
      success: (result) => {
        SessionStore.setAuthToken(result.data.attributes.auth_token)
        if (accountId !== null && accountId !== undefined) {
          this.actions.createEmployerContact(signupData, accountId)
        }
        else {
          this.actions.createAccount(signupData)
        }
      },
      error: (xhr, ajaxOptions, thrownError) => {
        if (thrownError === 'Unprocessable Entity') {
          this.actions.createUserFailed(xhr.responseJSON.errors)
        }
      }
    })
    this.dispatch()
  }

  createAccount(signupData) {
    let companySizeId = (signupData.selectedCompanySize !== null) ? signupData.selectedCompanySize.id : null
    $.ajax({
      url: Constants.API_ENDPOINTS.ACCOUNTS_CREATE,
      type: 'post',
      dataType: 'json',
      data: JSON.stringify({
        account: {
          company_name: signupData.companyInfo.companyName,
          company_size_id: companySizeId,
          revenue: signupData.companyInfo.revenue,
          year_founded: signupData.companyInfo.yearFounded,
          perks: signupData.companyInfo.perks,
          who_we_are: signupData.companyInfo.whoWeAre,
          what_we_do: signupData.companyInfo.whatWeDo,
          company_site_url: signupData.companyInfo.website,
          video_url: signupData.companyInfo.companyVideoUrl
        },
        cultures: signupData.selectedCultureOptions,
        logo_file: signupData.companyLogoFile
      }),
      headers: super.headersWithToken(),
      success: (result) => {
        let accountId = result.data.id;
        this.actions.createEmployerContact(signupData, accountId)
      },
      error: (xhr, ajaxOptions, thrownError) => {
        console.log(xhr.responseJSON.errors);
        console.log(thrownError);
      }
    })
  }

  createEmployerContact(signupData, accountId) {
    $.ajax({
      url: Constants.API_ENDPOINTS.EMPLOYER_CONTACTS_CREATE,
      type: 'post',
      dataType: 'json',
      data: JSON.stringify({
        employer_contact: {
          name: signupData.userDetails.firstName + ' ' + signupData.userDetails.lastName,
          title: signupData.userDetails.title,
          account_id: accountId
        },
        skills: signupData.selectedSkills,
        cities: signupData.selectedLocations
      }),
      headers: super.headersWithToken(),
      success: (result) => {
        this.actions.createEmployerContactSuccess(signupData, result)
      },
      error: (xhr, ajaxOptions, thrownError) => {
        console.log(xhr.responseJSON.errors);
        console.log(thrownError);
      }
    })
  }

  createEmployerContactSuccess(signupData, result) {
    this.dispatch(result)
  }

  createUserFailed(errors) {
    this.dispatch(errors)
  }
}

export default alt.createActions(EmployerSignupActions)
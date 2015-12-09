import alt from '../dispatchers/alt'
import BaseActions from './base-actions'
var Constants = require('../constants/api-constants')

class EmployerActions extends BaseActions {
  fetchById(id) {
    let url = Constants.API_ENDPOINTS.EMPLOYER_CONTACTS_SHOW.replace(':id', id)
    $.ajax({
      url: url,
      type: 'get',
      dataType: 'json',
      headers: super.headersWithToken(),
      success: (result) => {
        this.actions.fetchByIdSuccess(result)
      }
    })
    this.dispatch()
  }

  inviteCoworkers(employerId, emails) {
    let url = Constants.API_ENDPOINTS.EMPLOYER_INVITE_COWORKERS.replace(':id', employerId)
    $.ajax({
      url: url,
      type: 'post',
      dataType: 'json',
      headers: super.headersWithToken(),
      data: JSON.stringify({
        emails: emails
      }),
      success: (result) => {
        this.actions.inviteCoworkersSuccess(result)
      }
    })
    this.dispatch()
  }

  getRecentConversations(employerId) {
    let url = Constants.API_ENDPOINTS.EMPLOYER_RECENT_CONVERSATIONS.replace(':id', employerId)
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

  fetchByIdSuccess(result) {
    this.dispatch(result)
  }

  inviteCoworkersSuccess(result) {
    this.dispatch(result)
  }

  getRecentConversationsSuccess(result) {
    this.dispatch(result)
  }
}

export default alt.createActions(EmployerActions)
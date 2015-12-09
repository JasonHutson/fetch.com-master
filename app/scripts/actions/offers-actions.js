import alt from '../dispatchers/alt'
import BaseActions from './base-actions'
var Constants = require('../constants/api-constants')

class OffersActions extends BaseActions {
  fetchByTalent() {
    $.ajax({
      url: Constants.API_ENDPOINTS.OFFERS_INDEX,
      type: 'get',
      dataType: 'json',
      headers: super.headersWithToken(),
      success: (data) => {
        this.actions.fetchByTalentSuccess(data)
      }
    })
    this.dispatch()
  }

  makeOffer(offer) {
    $.ajax({
      url: Constants.API_ENDPOINTS.OFFERS_CREATE,
      type: 'post',
      dataType: 'json',
      headers: super.headersWithToken(),
      data: JSON.stringify({
        offer: {
          employer_contact_id: offer.employerContactId,
          talent_profile_match_id: offer.talentProfileMatchId,
          company_name: offer.companyName,
          position_title: offer.positionTitle,
          manager_name: offer.supervisor,
          salary_pay_rate: offer.salary,
          start_date: offer.startDate,
          legal_verbiage: offer.disclaimer,
          hiring_managers_name: offer.hiringManagersName,
          details: offer.details,
          job_type: offer.jobType
          // benefits: NEED TO UPLOAD FILE
        }
      }),
      success: (data) => {
        this.actions.makeOfferSuccess(data)
      }
    })
    this.dispatch()
  }

  acceptOffer(offer) {
    let url = Constants.API_ENDPOINTS.OFFERS_ACCEPT.replace(':id', offer.id)
    $.ajax({
      url: url,
      type: 'post',
      dataType: 'json',
      headers: super.headersWithToken(),
      success: (data) => {
        this.actions.fetchByTalent()
      }
    })
    this.dispatch()
  }

  rejectOffer(offer, reason) {
    let url = Constants.API_ENDPOINTS.OFFERS_REJECT.replace(':id', offer.id)
    $.ajax({
      url: url,
      type: 'post',
      dataType: 'json',
      headers: super.headersWithToken(),
      data: JSON.stringify({
        reason: reason
      }),
      success: (data) => {
        this.actions.fetchByTalent()
      }
    })
    this.dispatch()
  }

  fetchByTalentSuccess(result) {
    this.dispatch(result)
  }

  makeOfferSuccess(result) {
    this.dispatch(result)
  }

  acceptOfferSuccess(result) {
    this.dispatch(result)
  }

  rejectOfferSuccess(result) {
    this.dispatch(result)
  }
}

export default alt.createActions(OffersActions)
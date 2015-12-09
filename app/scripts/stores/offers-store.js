import alt from '../dispatchers/alt'
import OffersActions from '../actions/offers-actions'

class OffersStore {
  constructor() {
    this.offerCreated = false
    this.offer = null
    this.canSendOffer = false
    this.loading = false
    this.feeStructure = {}
    this.offers = []
    this.offerUpdated = false
    this.showConfirmationPopup = false
    this.employmentType = null
    this.bindListeners({
      onMakeOffer: OffersActions.MAKE_OFFER,
      onMakeOfferSuccess: OffersActions.MAKE_OFFER_SUCCESS,
      onFetchByTalent: OffersActions.FETCH_BY_TALENT,
      onFetchByTalentSuccess: OffersActions.FETCH_BY_TALENT_SUCCESS,
      onAcceptOffer: OffersActions.ACCEPT_OFFER,
      onAcceptOfferSuccess: OffersActions.ACCEPT_OFFER_SUCCESS,
      onRejectOffer: OffersActions.REJECT_OFFER,
      onRejectOfferSuccess: OffersActions.REJECT_OFFER_SUCCESS
    })
  }

  onMakeOffer() {
    this.offerCreated = false
  }

  onMakeOfferSuccess(result) {
    this.offerCreated = true
    this.offer = result.offer
  }

  onFetchByTalent() {
    this.loading = true
  }

  onFetchByTalentSuccess(result) {
    this.offers = result.data
    this.loading = false
  }

  onAcceptOffer() {
    this.offerUpdated = false
  }

  onRejectOffer() {
    this.offerUpdated = false
  }

  onAcceptOfferSuccess(result) {
    this.offerUpdated = true
  }

  onRejectOfferSuccess(result) {
    this.offerUpdated = true
  }
}

export default alt.createStore(OffersStore)

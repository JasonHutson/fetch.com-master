import alt from '../dispatchers/alt'
import TalentProfileMatchesActions from '../actions/talent-profile-matches-actions'

class TalentProfileMatchesStore {
  constructor() {
    this.matches = []
    this.matchesLiked = []
    this.matchesInterested = []
    this.matchesOffer = []
    this.match = null
    this.loading = false
    this.interestedOnMatch = false
    this.errorStatus = null
    this.bindListeners({
      onFetchByPositionId: TalentProfileMatchesActions.FETCH_BY_POSITION_ID,
      onFetchByPositionIdSuccess: TalentProfileMatchesActions.FETCH_BY_POSITION_ID_SUCCESS,
      onFetchByPositionIdError: TalentProfileMatchesActions.FETCH_BY_POSITION_ID_ERROR,
      onFetchById: TalentProfileMatchesActions.FETCH_BY_ID,
      onFetchByIdSuccess: TalentProfileMatchesActions.FETCH_BY_ID_SUCCESS,
      onEmployerInterested: TalentProfileMatchesActions.EMPLOYER_INTERESTED,
      onEmployerInterestedSuccess: TalentProfileMatchesActions.EMPLOYER_INTERESTED_SUCCESS
    })
  }

  addTalentProfileInformation(result) {
    let included = result.included
    if (included !== undefined) {
      included.forEach(record => {
        if (record.type === 'talent_profiles') {
          for (let i=0; i<this.matches.length; i++) {
            if (this.matches[i].attributes.talent_profile_id.toString() === record.id.toString()) {
              this.matches[i].talent_profile = record
            }
          }
        }
      })
    }
  }

  onFetchByPositionId() {
    this.loading = true
    this.match = null
    this.matches = []
    this.matchesLiked = []
    this.matchesInterested = []
    this.matchesOffer = []
  }

  onFetchByPositionIdSuccess(result) {
    this.loading = false
    this.matches = result.data
    this.errorStatus = null

    $.each(this.matches, (index, item) => {
      if (item.attributes.status === 'liked') {
        this.matchesLiked.push(item)
      }
      else if (item.attributes.status === 'interested') {
        this.matchesInterested.push(item)
      }
      else {
        this.matchesOffer.push(item)
      }
    })

    this.addTalentProfileInformation(result)
  }

  onFetchByPositionIdError(result) {
    this.errorStatus = result
  }

  onFetchById() {
    this.match = null
    this.loading = true
  }

  onFetchByIdSuccess(result) {
    this.match = result.data
    this.errorStatus = null

    let included = result.included
    if (included !== undefined) {
      included.forEach(record => {
        if (record.type === 'talent_profiles') {
          this.match.talent_profile = record
        }
      })
    }
    this.loading = false
  }

  onEmployerInterested() {
    this.interestedOnMatch = false
  }

  onEmployerInterestedSuccess(result) {
    this.interestedOnMatch = true
    this.errorStatus = null
  }
}

export default alt.createStore(TalentProfileMatchesStore)

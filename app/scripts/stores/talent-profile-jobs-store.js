import alt from '../dispatchers/alt';
import TalentProfileJobsActions from '../actions/talent-profile-jobs-actions';

class TalentProfileJobsStore {
  constructor() {
    this.jobs = []
    this.matches = []
    this.activeJob = null
    this.loadedJobById = false
    this.matchLiked = false
    this.matchRejected = false
    this.disableInterestButton = false
    this.errorStatus = null
    this.bindListeners({
      handleUpdatedJobs: TalentProfileJobsActions.UPDATE_TALENT_PROFILE_JOBS,
      handleUpdatedJobById: TalentProfileJobsActions.FETCH_POSITION_BY_ID_SUCCESS,
      handleUpdatedJobByIdError: TalentProfileJobsActions.FETCH_POSITION_BY_ID_ERROR,
      handleLikedMatchClick: TalentProfileJobsActions.LIKE_MATCH,
      handleLikedMatch: TalentProfileJobsActions.LIKE_MATCH_SUCCESS,
      handleRejectedMatch: TalentProfileJobsActions.REJECT_MATCH_SUCCESS
    })
  }

  handleUpdatedJobs(jobs) {
    this.jobs = []
    this.matches = jobs.data
    if (jobs.included !== undefined) {
      for(let i=0; i<jobs.included.length; i++) {
        if (jobs.included[i].type === "positions") {
          this.jobs.push(jobs.included[i])
        }
      }
    }
    this.loadedJobById = false
    this.matchLiked = false
    this.matchRejected = false
    this.disableInterestButton = false
    this.errorStatus = null
  }

  handleUpdatedJobById(job) {
    this.activeJob = job.data
    this.loadedJobById = true
    this.errorStatus = null
  }

  handleUpdatedJobByIdError(status) {
    this.errorStatus = status
  }

  handleLikedMatchClick() {
    this.disableInterestButton = true
    this.errorStatus = null
  }

  handleLikedMatch(result) {
    this.matchLiked = true
    this.errorStatus = null
  }

  handleRejectedMatch(result) {
    this.matchRejected = true
    this.errorStatus = null
  }
}

module.exports = alt.createStore(TalentProfileJobsStore, 'TalentProfileJobsStore');

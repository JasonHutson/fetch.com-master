import alt from '../dispatchers/alt'
import EmployerAddJobActions from '../actions/employer-add-job-actions'

class EmployerAddJobStore {
  constructor() {
    this.position = {}
    this.createdCorrectly = false
    this.creating = false
    this.bindListeners({
      onAddJob: EmployerAddJobActions.ADD_JOB,
      onAddJobSuccess: EmployerAddJobActions.ADD_JOB_SUCCESS
    })
  }

  onAddJob() {
    this.creating = true
  }

  onAddJobSuccess(result) {
    this.creating = false
    this.createdCorrectly = true
    this.position = result.data
  }
}

export default alt.createStore(EmployerAddJobStore)

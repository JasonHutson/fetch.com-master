import alt from '../dispatchers/alt'
import EmploymentTypesActions from '../actions/employment-types-actions'

class EmploymentTypesStore {
  constructor() {
    this.employmentTypes = []
    this.loading = false
    this.bindAction(EmploymentTypesActions.fetch, this.onFetch)
    this.bindAction(EmploymentTypesActions.fetchSuccess, this.onFetchSuccess)
  }

  onFetch() {
    this.loading = true
  }

  onFetchSuccess(types) {
    this.employmentTypes = types
  }
}

export default alt.createStore(EmploymentTypesStore)
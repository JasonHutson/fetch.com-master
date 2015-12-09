import alt from '../dispatchers/alt';
import CompensationsActions from "../actions/compensations-actions"

class CompensationsStore {
  constructor() {
    this.compensations = []
    this.loading = false
    this.bindAction(CompensationsActions.fetch, this.onFetch)
    this.bindAction(CompensationsActions.fetchSuccess, this.onFetchSuccess)
  }

  onFetch() {
    this.loading = true
  }

  onFetchSuccess(compensations) {
    this.loading = false
    this.compensations = compensations
  }
}

export default alt.createStore(CompensationsStore)
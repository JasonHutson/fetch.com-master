import alt from '../dispatchers/alt';
import CulturesActions from "../actions/cultures-actions"

class CulturesStore {
  constructor() {
    this.cultures = []
    this.loading = false
    this.bindAction(CulturesActions.fetch, this.onFetch)
    this.bindAction(CulturesActions.fetchSuccess, this.onFetchSuccess)
  }

  onFetch() {
    this.loading = true
  }

  onFetchSuccess(cultures) {
    this.loading = false
    this.cultures = cultures
  }
}

export default alt.createStore(CulturesStore)
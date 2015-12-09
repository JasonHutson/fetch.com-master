import alt from '../dispatchers/alt'
import SearchActions from '../actions/search-actions'

class SearchStore {
  constructor() {
    this.matches = []
    this.loading = false

    this.bindAction(SearchActions.matchesByPositionId, this.onMatchesByPositionId);
    this.bindAction(SearchActions.matchesByPositionIdSuccess, this.onMatchesByPositionIdSuccess);
  }

  onMatchesByPositionId() {
    this.loading = true
  }

  onMatchesByPositionIdSuccess(matches) {
    this.matches = matches
    this.loading = false
  }
}

export default alt.createStore(SearchStore)
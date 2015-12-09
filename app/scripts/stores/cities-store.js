import alt from '../dispatchers/alt'
import CitiesActions from '../actions/cities-actions'

class CitiesStore {
  constructor() {
    this.cities = []
    this.loading = false
    this.bindAction(CitiesActions.fetch, this.onFetch)
    this.bindAction(CitiesActions.fetchSuccess, this.onFetchSuccess)
  }

  onFetch() {
    this.loading = true
  }

  onFetchSuccess(cities) {
    this.loading = false
    this.cities = cities
  }
}

export default alt.createStore(CitiesStore)
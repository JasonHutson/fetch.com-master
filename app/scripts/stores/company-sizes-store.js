import alt from '../dispatchers/alt';
import CompanySizesActions from "../actions/company-sizes-actions"

class CompanySizesStore {
  constructor() {
    this.company_sizes = []
    this.loading = false
    this.bindAction(CompanySizesActions.fetch, this.onFetch)
    this.bindAction(CompanySizesActions.fetchSuccess, this.onFetchSuccess)
  }

  onFetch() {
    this.loading = true
  }

  onFetchSuccess(company_sizes) {
    this.loading = false
    this.company_sizes = company_sizes
  }
}

export default alt.createStore(CompanySizesStore)
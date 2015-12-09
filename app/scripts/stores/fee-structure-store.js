import alt from '../dispatchers/alt'
import FeeStructureActions from '../actions/fee-structure-actions'

class FeeStructureStore {
  constructor() {
    this.standardFee = 0
    this.monthlySubscription = 0
    this.upfrontFee = 0
    this.loading = false
    this.bindListeners({
      onFetch: FeeStructureActions.FETCH,
      onFetchSuccess: FeeStructureActions.FETCH_SUCCESS
    })
  }

  onFetch() {
    this.loading = true
  }

  onFetchSuccess(result) {
    this.loading = false
    this.standardFee = result.standard_fee
    this.monthlySubscription = result.monthly_subscription
    this.upfrontFee = result.upfront_fee
  }
}

export default alt.createStore(FeeStructureStore)
import alt from '../dispatchers/alt'
import EmployerPositionsActions from '../actions/employer-positions-actions'

class EmployerPositionsStore {
  constructor() {
    this.positions = []
    this.relationships = []
    this.loading = false
    this.deleted = false
    this.position = null
    this.bindListeners({
      handleUpdatingPositions: EmployerPositionsActions.FETCH_BY_EMPLOYER_ID,
      handleUpdatedPositions: EmployerPositionsActions.FETCH_BY_EMPLOYER_ID_SUCCESS,
      onDeletePosition: EmployerPositionsActions.DELETE_POSITION,
      onDeletePositionSuccess: EmployerPositionsActions.DELETE_POSITION_SUCCESS,
      onFetchPositionById: EmployerPositionsActions.FETCH_BY_POSITION_ID,
      onFetchPositionByIdSuccess: EmployerPositionsActions.FETCH_BY_POSITION_ID_SUCCESS
    })

    this.exportPublicMethods({
      getAttribute: this.getAttribute.bind(this)
    })
  }

  getAttribute(model, id, name) {
    let value = ''
    for(let i=0; i<this.relationships.length; i++) {
      let record = this.relationships[i]
      if (record.type === model && record.id === id) {
        value = record.attributes[name]
      }
    }
    return value
  }

  handleUpdatingPositions() {
    this.loading = true
  }

  handleUpdatedPositions(positions) {
    this.position = null
    this.positions = positions.data
    this.relationships = positions.included
    this.loading = false
    this.deleted = false
  }

  onDeletePosition() {
    this.deleted = false
  }

  onDeletePositionSuccess(result) {
    this.deleted = true
  }

  onFetchPositionById() {
    this.position = null
  }

  onFetchPositionByIdSuccess(result) {
    this.position = result.data
  }
}

export default alt.createStore(EmployerPositionsStore)

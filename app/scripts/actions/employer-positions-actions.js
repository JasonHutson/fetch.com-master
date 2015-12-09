import alt from '../dispatchers/alt';
import BaseActions from './base-actions';
var Constants = require("../constants/api-constants");

class EmployerPositionsActions extends BaseActions {
  fetchByPositionId(employerId, positionId) {
    let url = Constants.API_ENDPOINTS.EMPLOYER_POSITIONS_SHOW
              .replace(":employer_contact_id", employerId)
              .replace(":id", positionId)
    $.ajax({
      url: url,
      type: 'get',
      dataType: 'json',
      headers: super.headersWithToken(),
      success: (data) => {
        this.actions.fetchByPositionIdSuccess(data)
      }
    })
    this.dispatch()
  }

  fetchByEmployerId(employerId, status) {
    let url = Constants.API_ENDPOINTS.EMPLOYER_POSITIONS.replace(":employer_contact_id", employerId)
    $.ajax({
      url: url,
      type: 'get',
      dataType: 'json',
      data: {
        status: status
      },
      headers: super.headersWithToken(),
      success: (data) => {
        this.actions.fetchByEmployerIdSuccess(data)
      }
    })
    this.dispatch()
  }

  fetchByEmployerIdWithFilter(employerId, filter, status) {
    let url = Constants.API_ENDPOINTS.EMPLOYER_POSITIONS.replace(":employer_contact_id", employerId)

    $.ajax({
      url: url,
      type: 'get',
      dataType: 'json',
      data: {
        filter_skill: filter['skill'],
        filter_compensation: filter['compensation'],
        filter_location: filter['location'],
        status: status
      },
      headers: super.headersWithToken(),
      success: (data) => {
        this.actions.fetchByEmployerIdSuccess(data)
      }
    })
    this.dispatch()
  }

  deletePosition(employerId, positionId) {
    let url = Constants.API_ENDPOINTS.EMPLOYER_POSITIONS_DELETE
              .replace(":employer_contact_id", employerId)
              .replace(":id", positionId)
    $.ajax({
      url: url,
      type: 'post',
      dataType: 'json',
      method: 'delete',
      data: JSON.stringify({"_method":"delete"}),
      headers: super.headersWithToken(),
      success: (data) => {
        this.actions.deletePositionSuccess(data)
      }
    })
    this.dispatch()
  }

  fetchByEmployerIdSuccess(positions) {
    this.dispatch(positions)
  }

  fetchByPositionIdSuccess(result) {
    this.dispatch(result)
  }

  deletePositionSuccess(result) {
    this.dispatch(result)
  }
}

export default alt.createActions(EmployerPositionsActions)
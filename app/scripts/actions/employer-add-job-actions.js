import alt from '../dispatchers/alt'
import BaseActions from './base-actions'
var SessionStore = require("../stores/session-store")

var Constants = require('../constants/api-constants')

class EmployerAddJobActions extends BaseActions {
  addJob(jobData) {
    let employerContactId = SessionStore.getEmployerContactId()

    let url = Constants.API_ENDPOINTS.POSITIONS_CREATE.replace(":employer_contact_id", employerContactId)
    $.ajax({
      url: url,
      type: 'post',
      dataType: 'json',
      data: JSON.stringify({
        position: {
          job_title: jobData.position.title,
          description: jobData.position.description,
          salary_range_id: jobData.position.compensation,
          city_id: jobData.position.location,
          employment_type_id: jobData.position.employmentType,
          desired_years_experience: jobData.position.desiredYearsExperience,
          required_skill_list: jobData.position.skillset.join()
        }
      }),
      headers: super.headersWithToken(),
      success: (result) => {
        this.actions.addJobSuccess(result)
      },
      error: (xhr, ajaxOptions, thrownError) => {
        console.log(xhr);
        console.log(thrownError);
      }
    })
    this.dispatch()
  }

  addJobSuccess(result) {
    console.log('addJobSuccess: ', result)
    this.dispatch(result)
  }
}

export default alt.createActions(EmployerAddJobActions)
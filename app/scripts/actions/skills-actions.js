import alt from '../dispatchers/alt'
import BaseActions from './base-actions'
var Constants = require("../constants/api-constants")

class SkillsActions extends BaseActions {
  fetchByCategory(categoryId) {
    $.ajax({
      url: Constants.API_ENDPOINTS.SKILLS_INDEX,
      type: 'get',
      dataType: 'json',
      headers: super.headersWithoutAuth(),
      data: {
        category_id: categoryId
      },
      success: (data) => {
        this.actions.fetchByCategorySuccess(data);
      }
    })
    this.dispatch()
  }

  fetchByCategoryList(categoryList) {
    $.ajax({
      url: Constants.API_ENDPOINTS.SKILLS_INDEX,
      type: 'get',
      dataType: 'json',
      data: {
        categories_list: categoryList.join(',')
      },
      headers: super.headersWithoutAuth(),
      success: (data) => {
        this.actions.fetchByCategorySuccess(data);
      },
      error: (xhr, ajaxOptions, thrownError) => {
        console.log(xhr.status);
        console.log(thrownError);
      }
    })
    this.dispatch()
  }

  fetchAllSkills() { 
    $.ajax({
      url: Constants.API_ENDPOINTS.SKILLS_INDEX,
      type: 'get',
      dataType: 'json',
      headers: super.headersWithoutAuth(),
      success: (data) => {
        this.actions.fetchAllSkillsSuccess(data);
      }
    })
    this.dispatch()
  }

  fetchByCategorySuccess(skills) {
    this.dispatch(skills)
  }

  fetchByCategoryListSuccess(skills) {
    this.dispatch(skills)
  }

  fetchAllSkillsSuccess(skills) {
    this.dispatch(skills)
  }
}

export default alt.createActions(SkillsActions)
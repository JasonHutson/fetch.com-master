import alt from '../dispatchers/alt';
import BaseActions from './base-actions';
var Constants = require("../constants/api-constants");

class SkillCategoriesActions extends BaseActions {
  fetch() {
    $.ajax({
      url: Constants.API_ENDPOINTS.SKILL_CATEGORIES_INDEX,
      type: 'get',
      dataType: 'json',
      headers: super.headersWithoutAuth(),
      success: (data) => {
        this.actions.fetchSuccess(data);
      }
    });
    this.dispatch();
  }

  fetchSuccess(categories) {
    this.dispatch(categories);
  }
}

export default alt.createActions(SkillCategoriesActions);
import alt from '../dispatchers/alt';
import BaseActions from './base-actions';
var Constants = require("../constants/api-constants");

class AgentActions extends BaseActions {
  fetchById(agentId) {
    let url = Constants.API_ENDPOINTS.AGENT_INDEX + "/" + agentId
    $.ajax({
      url: url,
      type: 'get',
      dataType: 'json',
      headers: super.headersWithToken(),
      success: (data) => {
        this.actions.updateAgent(data);
      }
    })
    this.dispatch();
  }

  updateAgent(agent) {
    this.dispatch(agent);
  }
}

export default alt.createActions(AgentActions);
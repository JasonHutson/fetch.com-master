import alt from '../dispatchers/alt';
import AgentActions from '../actions/agent-actions';

class AgentStore {
  constructor() {
    this.agent = {};
    this.bindListeners({
      handleUpdateAgent: AgentActions.UPDATE_AGENT
    });
  }

  handleUpdateAgent(agent) {
    this.agent = agent.data;
  }
}

module.exports = alt.createStore(AgentStore, 'AgentStore');

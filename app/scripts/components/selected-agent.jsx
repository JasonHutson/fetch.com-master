import AgentActions from '../actions/agent-actions';
import AgentStore from '../stores/agent-store';

class SelectedAgent extends React.Component {
	constructor(props) {
    super(props);
  }

  render() {
		let status = this.props.agent.attributes.status === true ? 'ONLINE NOW' : 'OFFLINE'
    let statusLabel = 'offline'
    if (this.props.agent.attributes.status === true) {
      statusLabel = 'online'
    }
    return (
      <div className="selectedAgent ui grid">
        <div className="title sixteen wide column mobile">
          <span className="accent">CHAT WITH </span>{this.props.agent.attributes.name}
        </div>
        <div className="title sixteen wide column">
          <span className="accent">FETCH </span>AGENT
        </div>
        <div className="sixteen wide column image" onClick={this.props.onClick}>
          <img className="ui circular image" src={this.props.agent.attributes.photo_url}/>
        </div>
        <div className="sixteen wide column name">
          {this.props.agent.attributes.name}
        </div>
        <div className="sixteen wide column status">
          <div className={statusLabel}>
            <div className="circle"></div>&nbsp;
            {status}
          </div>
        </div>
      </div>
    )
  }
}

export default SelectedAgent;

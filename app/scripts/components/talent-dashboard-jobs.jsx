import TalentProfileJobsStore from '../stores/talent-profile-jobs-store';

class TalentDashboardJobs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jobs: TalentProfileJobsStore.getState().jobs,
      matches: TalentProfileJobsStore.getState().matches
    }
  }

  componentWillMount() {
    TalentProfileJobsStore.listen(this.onJobsChange.bind(this));
  }

  componentWillUnmount() {
    TalentProfileJobsStore.unlisten(this.onJobsChange.bind(this));
  }

  onJobsChange(state) {
    this.setState({
      jobs: state.jobs,
      matches: state.matches
    })
  }

  render() {
    return (
      <div className="talentDashboardJobs">
        <h1>YOU'VE BEEN <span className="featureText">FETCHED</span></h1>
        <div className="ui list">
          {this.state.matches.map((match, index) => {
            let job = this.state.jobs.find(x => x.id === match.attributes.position_id.toString())
            return <TalentDashboardJob key={match.id} job={job} match={match}
                                       onJobDetailsClick={this.props.onJobDetailsClick}
                                       onJobMessagesClick={this.props.onJobMessagesClick}
                                       onExitDetailsClick={this.props.onExitDetailsClick}/>
          })}
        </div>
      </div>
    )
  }
}

class TalentDashboardJob extends React.Component {
  constructor(props) {
    super(props);
  }

  jobDetailsClick() {
    this.props.onJobDetailsClick(this.props.job.id, this.props.match)
  }

  render() {
    let likeIconClass = "large heart icon"
    if (this.props.match !== undefined) {
      if (this.props.match.attributes.status === "new_match") {
        likeIconClass = likeIconClass.concat(" empty")
      }
      else {
        likeIconClass = likeIconClass.concat(" green")
      }
    }

    return (
      <div className="job" onClick={this.jobDetailsClick.bind(this)}>
        <div className="ui grid">
          <div className="four wide column">
            <img className="ui image" src={this.props.job.attributes.logo_url}></img>
          </div>
          <div className="six wide column job-properties">
            <div className="ui items">
              <div className="item">
                <div className="content">
                  <div className="meta"><span>SKILL SET</span></div>
                  {this.props.job.attributes.required_skill_list}
                </div>
              </div>
              <div className="item">
                <div className="content">
                  <div className="meta"><span>COMPENSATION</span></div>
                  {this.props.job.attributes.salary_range_name}
                </div>
              </div>
            </div>
          </div>
          <div className="six wide column job-properties">
            <div className="ui items">
              <div className="item">
                <div className="content">
                  <div className="meta"><span>LOCATIONS</span></div>
                  {this.props.job.attributes.city_name}
                </div>
              </div>
              <div className="item">
                <div className="content">
                  <div className="meta"><span>CULTURE</span></div>
                  {this.props.job.attributes.cultures}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TalentDashboardJobs;

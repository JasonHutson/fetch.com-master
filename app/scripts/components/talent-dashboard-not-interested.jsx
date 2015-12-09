class TalentDashboardNotInterested extends React.Component {
  render() {
    return (
      <div className="not-interested-panel">
        <div className="ui grid header">
          <div className="twelve wide column">
            <div className="title">NOT <span className="accent">INTERESTED</span></div>
            <div className="position-name">{this.props.job.attributes.job_title} WITH {this.props.account.attributes.company_name}</div>
          </div>
        </div>

        <div className="content ui grid">
          <div className="sixteen wide column information">
            <div className="accent">WE'RE SORRY THIS WASN'T THE RIGHT MATCH FOR YOU</div>
            CHOOSE THE REASON BELOW
          </div>

          <div className="sixteen wide column inner-content ui grid centered aligned">

            <div className="ui button green">COMPANY</div>
            <div className="ui button green">LOCATION</div>
            <div className="ui button black">OTHER</div>

            <textarea className="ui input" placeholder="TYPE REASONS HERE..."/>

            <div className="ui button green submit right floated">SUBMIT</div>
          </div>

        </div>
      </div>
    )
  }
}

export default TalentDashboardNotInterested
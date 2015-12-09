
class PositionMatchDetails extends React.Component {

  onSendOfferClick(event) {
    this.props.onSendOfferClick(this.props.item)
  }

  render() {
    let talent = this.props.item.talent_profile
    return (
      <div className="position-match-details">
        <div className="ui header centered">
          <div className="positive ui button" onClick={this.onSendOfferClick.bind(this)}>
            <h1>SEND OFFER</h1>
          </div>
        </div>
        <div className="ui card centered grid">
          <div className="ui grid">
            <div className="eight wide column">
              <div className="ui image">
                <img src={talent.attributes.photo_url}/>
              </div>
            </div>
            <div className="eight wide column left aligned">
              <div className="content">
                <div className="header title"><h3>{talent.attributes.name}</h3></div>
                <div className="description">
                  <div className="ui list">
                    <div className="item">
                      <div className="header">Skills</div>
                      {talent.attributes.skill_list}
                    </div>
                    <div className="item">
                      <div className="header">Time zone</div>
                      {talent.attributes.time_zone}
                    </div>
                    <div className="item">
                      <div className="header">Phone</div>
                      {talent.attributes.phone}
                    </div>
                    <div className="item">
                      <div className="header">Summary</div>
                      {talent.attributes.summary}
                    </div>
                    <div className="item">
                      <div className="header">Salary range</div>
                      {talent.attributes.salary_range_name}
                    </div>
                    <div className="item">
                      <div className="header">Cultures</div>
                      {talent.attributes.culture_list}
                    </div>
                    <div className="item">
                      <div className="header">Cities of interest</div>
                      {talent.attributes.city_list}
                    </div>
                    <div className="item">
                      <div className="header">Github URL</div>
                      {talent.attributes.github_url}
                    </div>
                    <div className="item">
                      <div className="header">StackOverflow URL</div>
                      {talent.attributes.stack_overflow_url}
                    </div>
                    <div className="item">
                      <div className="header">Personal website</div>
                      {talent.attributes.personal_website}
                    </div>
                    <div className="item">
                      <div className="header">Years of experience</div>
                      {talent.attributes.years_of_experience}
                    </div>
                    <div className="item">
                      <div className="header">Area of interest</div>
                      {talent.attributes.area_of_interest}
                    </div>
                    <div className="item">
                      <div className="header">Resume</div>
                      <a href={talent.attributes.resume_url} target="_blank">Download</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="extra content">
            <div className="ui button" onClick={this.props.onReturnClick}>Return to job details</div>
          </div>
        </div>
      </div>
    )
  }
}

export default PositionMatchDetails
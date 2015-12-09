
class EmployerDashboardTalentProfile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      interestedOnMatch: false
    }
  }

  onInterestedClick() {
    this.setState({interestedOnMatch: true})
  }

  onNotInterestedClick() {
    this.props.onNotInterestedClick(this.props.match)
  }

  onPopupCloseClick() {
    this.setState({interestedOnMatch: false})
    this.props.onInterestedClick(this.props.match)
  }

  render() {
    let talent = this.props.match.talent_profile

    let url = 'http://placehold.it/100x120'
    if (talent !== undefined && talent.attributes.photo_url !== undefined && talent.attributes.photo_url !== null) {
      url = talent.attributes.photo_url
    }
    let photo_img = <img src={url} width="100" />

    let talent_first_name = ''
    if (talent !== undefined) {
      talent_first_name = talent.attributes.name.split(' ')[0]
    }

    let messageInterestedClass = "thank-you-message"
    if (this.state.interestedOnMatch) {
      messageInterestedClass = messageInterestedClass.concat(" visible")
    }

    return (
      <div className="employer-talent-profile">
        <div className="ui grid header">
          <div className="twelve wide column">
            <div className="title">{talent.attributes.name}</div>
          </div>
          <div className="four wide column">
            <div className="ui button green right floated" onClick={this.props.onReturnClick}>BACK TO MATCHES</div>
          </div>
        </div>
        <div className="ui grid content">

          <div className={messageInterestedClass}>
            <div className="content">
              <p><span className="accent">THANK YOU FOR YOUR INTEREST IN THIS TALENT </span> YOU WILL NOW BE ABLE TO CHAT DIRECTLY</p>
              <p>WITH THIS CANDIDATE</p>
              <i className="icon remove" onClick={this.onPopupCloseClick.bind(this)} />
            </div>
          </div>


          <div className="sixteen wide column details ui grid">
            <div className="two wide column">
              {photo_img}
            </div>
            <div className="fourteen wide column info">
              <div className="ui grid">
                <div className="six wide column label">
                  CURRENT TITLE:
                </div>
                <div className="six wide column label">
                  SKILL SET:
                </div>
                <div className="four wide column label">
                  LOCATION:
                </div>

                <div className="six wide column value">
                  {talent.attributes.title}
                </div>
                <div className="six wide column value">
                  {talent.attributes.skill_list}
                </div>
                <div className="four wide column value">
                  {talent.attributes.city_list}
                </div>

                <div className="six wide column label">
                  COMPENSATION:
                </div>
                <div className="six wide column label">
                  CULTURE:
                </div>
                <div className="four wide column label">
                </div>

                <div className="six wide column value">
                  {talent.attributes.salary_range_name}
                </div>
                <div className="six wide column value">
                  {talent.attributes.culture_list}
                </div>
                <div className="four wide column value icons">
                  <i className="file text outline icon"/>
                  <i className="linkedin square icon"/>
                  <i className="github icon"/>
                </div>
              </div>
            </div>

            <div className="sixteen wide column label">
              ABOUT {talent_first_name}
            </div>
            <div className="sixteen wide column value summary">
              {talent.attributes.summary}
            </div>
          </div>

          <div className="sixteen wide column interest ui grid">
            <div className="sixteen wide column buttons">
              <div className="ui button green" onClick={this.onInterestedClick.bind(this)}>
                INTERESTED
                <div className="chat-now"></div>
              </div>
              <div className="ui button black">NOT INTERESTED</div>
            </div>
            <div className="sixteen wide column note" onClick={this.onNotInterestedClick.bind(this)}>
              BY CLICKING 'NOT INTERESTED' THIS PROFILE WILL BE REMOVED AS A MATCH FROM THIS JOB
            </div>
          </div>

        </div>
      </div>
    )
  }
}

export default EmployerDashboardTalentProfile

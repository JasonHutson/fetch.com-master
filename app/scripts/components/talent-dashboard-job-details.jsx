import TalentProfileJobsStore from '../stores/talent-profile-jobs-store';

class TalentDashboardJobDetails extends React.Component {
  constructor(props) {
    super(props)
    this.state = TalentProfileJobsStore.getState()
  }

  componentWillMount() {
    TalentProfileJobsStore.listen(this.onTalentProfileJobsChange.bind(this))
  }

  componentWillUnmount() {
    TalentProfileJobsStore.unlisten(this.onTalentProfileJobsChange.bind(this))
  }

  onTalentProfileJobsChange(state) {
    this.state = state
  }

  onInterestedClick(event) {
    this.props.onInterestedClick(this.props.job)
  }

  onNotInterestedClick(event) {
    this.props.onNotInterestedClick(this.props.job)
  }

  onMessagesClick() {
    this.props.onMessagesClick(this.props.job.id, this.props.job.attributes.employer_user_id)
  }

  onCompanyLogoClick() {
    this.props.onAccountClick(this.props.account)
  }

  onPopupCloseClick() {
    this.setState({matchLiked: false})
    this.props.onChangeInterestedScreen()
  }

  render() {
    let position = this.props.job
    let logoUrl = (this.props.account.attributes === undefined || this.props.account.attributes.logo_url === undefined)
                   ? "http://placehold.it/80x80" : this.props.account.attributes.logo_url

    let titleLogoClass = ''
    let contentLogoClass = 'logo-content'

    if (this.props.account.attributes !== undefined && this.props.account.attributes.company_site_url !== null) {
      titleLogoClass = 'clickable'
      contentLogoClass = contentLogoClass.concat(' clickable')
    }

    let messageInterestedClass = "thank-you-message"
    if (this.state.matchLiked) {
      messageInterestedClass = messageInterestedClass.concat(" visible")
    }

    let interestPanel = ''
    if (this.props.match.attributes.status === 'new_match') {
      interestPanel = <InterestButtonsPanel disableInterestButton={this.state.disableInterestButton}
                                            onInterestedClick={this.onInterestedClick.bind(this)}
                                            onNotInterestedClick={this.onNotInterestedClick.bind(this)}/>
    }
    else if (this.props.match.attributes.status === 'liked') {
      interestPanel = <InterestedStatusPanel />
    }

    return (
      <div className="position-details item">

        <div className="ui grid header">
          <div className="twelve wide column">
            <div className="position-name">{position.attributes.job_title}</div>
            <img src={logoUrl} height="50" className={titleLogoClass} onClick={this.onCompanyLogoClick.bind(this)}/>
          </div>
          <div className="four wide column">
            <button className="ui button green right floated" onClick={this.props.onReturnClick}>BACK TO JOBS</button>
          </div>

        </div>

        <div className="content ui grid">
          <div className={messageInterestedClass}>
            <div className="content">
              <p><span className="accent">THANK YOU FOR YOUR INTEREST. </span> YOUR PROFILE HAS BEEN SENT TO THIS HIRING MANAGER</p>
              <p>PLEASE CONTACT YOUR FETCH AGENT WITH ANY QUESTIONS</p>
              <i className="icon remove" onClick={this.onPopupCloseClick.bind(this)} />
            </div>
          </div>

          <div className="fifteen wide column ui grid details">
            <div className="five wide column label job-title">
              {position.attributes.job_title}
            </div>
            <div className="five wide column label">
              SKILL SET
            </div>
            <div className="six wide column label">
              LOCATION
            </div>

            <div className="five wide column value logo">
              <img className={contentLogoClass} src={logoUrl} height="80"
                   onClick={this.onCompanyLogoClick.bind(this)}/>
            </div>
            <div className="five wide column value">
              {position.attributes.required_skill_list}
            </div>
            <div className="six wide column value">
              {position.attributes.city_name}
            </div>

            <div className="five wide column label empty">
              &nbsp;
            </div>
            <div className="five wide column label">
              COMPENSATION
            </div>
            <div className="six wide column label empty">
            </div>

            <div className="five wide column value empty">
              &nbsp;
            </div>
            <div className="five wide column value">
              {position.attributes.salary_range_name}
            </div>
            <div className="six wide column value empty">

            </div>

            <div className="sixteen wide column label description">
              DESCRIPTION
            </div>
            <div className="sixteen wide column value description">
              {position.attributes.description}
            </div>

            <div className="five wide column label">
              JOB TYPE
            </div>
            <div className="eleven wide column label">
              HIRING MANAGER
            </div>
            <div className="five wide column value">
              {position.attributes.employment_type_name}
            </div>
            <div className="eleven wide column value">
              {position.attributes.employer_contact_name}
            </div>
          </div>

          <div className="one wide column ui grid right-panel">
            <div className="sixteen wide column ui list">
              <div className="item">
                <img src="../images/icon-chat.png" onClick={this.onMessagesClick.bind(this)} title="View messages"/>
              </div>
              <div className="item">
                <img src="../images/icon-job-delete.png" onClick={this.onNotInterestedClick.bind(this)}
                     title="Mark position as Not Interested"/>
              </div>
            </div>
          </div>

          {interestPanel}

        </div>
      </div>
    )
  }
}

class InterestButtonsPanel extends React.Component {
  getInterestButtonClass() {
    let buttonClass = "ui green button interested"
    if (this.props.disableInterestButton) {
      buttonClass = buttonClass.concat(" disabled")
    }
    return buttonClass
  }

  render() {
    let interestButtonClass = this.getInterestButtonClass()
    return (
      <div className="sixteen wide column interest-panel">
        <div className="ui grid centered">
          <div className="sixteen wide column">
            <div className={interestButtonClass} onClick={this.props.onInterestedClick}>
              INTERESTED
            </div>
            <div className="ui button not-interested" onClick={this.props.onNotInterestedClick}>
              NOT INTERESTED
            </div>
          </div>
          <div className="sixteen wide column">
            <span className="note">BY CLICKING 'INTERESTED', YOUR FULL PROFILE WILL BE SENT TO THIS COMPANY</span>
          </div>
        </div>
      </div>
    )
  }
}

class InterestedStatusPanel extends React.Component {
  render() {
    return (
      <div className="sixteen wide column interest-panel">
        <div className="ui grid centered">
          <div className="sixteen wide column">
            <div className="title">
              INTERESTED
            </div>

            <div className="content-flow">
              <div className="label">FETCH STATUS:</div>
              <img src="../images/icon-chat-green.png" className="chat"/>
              <img src="../images/offer-flow-arrow.png" className="arrow"/>
              <img src="../images/people-talking.png" className="people-talk"/>
              <img src="../images/offer-flow-arrow-disabled.png" className="arrow-disabled"/>
              <img src="../images/job-offer-disabled.png" className="offer-disabled"/>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default TalentDashboardJobDetails

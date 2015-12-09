import TalentProfileStore from '../stores/talent-profile-store';

import Constants from '../constants/api-constants'

class TalentSummary extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let github = ''
    let linkedin = ''
    let resume = ''


    if (this.props.profile.github_url !== null && this.props.profile.github_url !== undefined
        && this.props.profile.github_url.match(Constants.REGEX_VALIDATIONS.GITHUB_URL) !== null) { 
      let github_url = this.props.profile.github_url
      if (github_url.indexOf('http') === -1) {
        github_url = 'http://' + github_url
      }
      github = <a href={github_url} target="_blank"><i className="github icon"/></a>
    }
    if (this.props.profile.linked_in_url !== null && this.props.profile.linked_in_url !== undefined
        && this.props.profile.linked_in_url.match(Constants.REGEX_VALIDATIONS.LINKED_IN_URL) !== null) {
      let linkedin_url = this.props.profile.linked_in_url
      if (linkedin_url.indexOf('http') === -1) {
        linkedin_url = 'http://' + linkedin_url
      }
      linkedin = <a href={linkedin_url} target="_blank"><i className="linkedin square icon"/></a>
    }
    if (this.props.profile.resume_url !== null && this.props.profile.resume_url !== undefined) {
      resume = <a href={this.props.profile.resume_url} target="_blank"><i className="file text outline icon"/></a>
    }

    return (
      <div className="talentSummary">
        <h3 className="ui aligned center">{this.props.profile.name}</h3>
        <div className="image-container">
          <img className="ui image" src={this.props.profile.photo_url}></img>
        </div>
        <p className="profile-summary">{this.props.profile.summary}</p>
        <div className="ui-list">
          <div className="item">
            <strong className="featureText">SKILL SET:</strong>
            <div className="content">{this.props.profile.skill_list}</div>
          </div>
          <div className="item">
            <strong className="featureText">COMPENSATION:</strong>
            <div className="content">{this.props.profile.preferred_base_salary}</div>
          </div>
          <div className="item">
            <strong className="featureText">LOCATIONS:</strong>
            <div className="content">{this.props.profile.city_list}</div>
          </div>
          <div className="item">
            <strong className="featureText">CULTURE:</strong>
            <div className="content">{this.props.profile.culture_list}</div>
          </div>
        </div>

        <div className="network-icons">
          {resume}
          {linkedin}
          {github}
        </div>

        <div className="actions">
          <div className="ui green button" onClick={this.props.onEditProfileClick}>
            EDIT PROFILE
          </div>
        </div>

      </div>
    )
  }
}

export default TalentSummary

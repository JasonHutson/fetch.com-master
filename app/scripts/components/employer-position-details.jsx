import PositionMatchesList from './position-matches-list'
import EmployerPositionsStore from '../stores/employer-positions-store'

class EmployerPositionDetails extends React.Component {
  constructor(props) {
    super(props)
  }

  onDeleteJobClick() {
    this.props.onDeleteJobClick(this.props.item)
  }

  onMessagesClick() {
    this.props.onMessagesClick(this.props.item)
  }

  onInterestedCandidateClick(match) {
    this.props.onInterestedCandidateClick(match)
  }

  render() {
    let position = this.props.item

    let location = EmployerPositionsStore.getAttribute('cities', position.relationships.city.data.id, 'full_name')
    let employmentType = EmployerPositionsStore.getAttribute('employment_types', position.relationships.employment_type.data.id, 'name')
    let compensation = EmployerPositionsStore.getAttribute('salary_ranges', position.relationships.salary_range.data.id, 'name')
    return (
      <div className="position-details item">
        <div className="ui grid header">
          <div className="ten wide column title">
            <div className="position-name">{position.attributes.job_title}</div>
          </div>
          <div className="six wide column buttons">
            <button className="ui button green right floated" onClick={this.props.onBackClick}>BACK TO JOBS</button>
          </div>

        </div>

        <div className="content ui grid">
          <div className="fifteen wide column ui grid details">
            <div className="five wide column label job-title">
              {position.attributes.job_title}
            </div>
            <div className="five wide column field">
              <div className="label">
                SKILL SET
              </div>
              <div className="value">
                {position.attributes.required_skill_list}
              </div>
            </div>
            <div className="six wide column field">
              <div className="label">
                LOCATION
              </div>
              <div className="value">
                {position.attributes.city_name}
              </div>
            </div>

            <div className="five wide column label empty">
              &nbsp;
            </div>
            <div className="five wide column field">
              <div className="label">
                COMPENSATION
              </div>
              <div className="value">
                {position.attributes.salary_range_name}
              </div>
            </div>
            <div className="six wide column empty">
            </div>

            <div className="sixteen wide column label">
              DESCRIPTION
            </div>
            <div className="sixteen wide column value description">
              {position.attributes.description}
            </div>

            <div className="five wide column field">
              <div className="label">
                JOB TYPE
              </div>
              <div className="value">
                {position.attributes.employment_type_name}
              </div>
            </div>
            <div className="eleven wide column field">
              <div className="label">
                HIRING MANAGER
              </div>
              <div className="value">
                {position.attributes.employer_contact_name}
              </div>
            </div>
          </div>

          <div className="one wide column ui grid right-panel">
            <div className="sixteen wide column ui list">
              <div className="item">
                <img src="../images/icon-chat.png" onClick={this.onMessagesClick.bind(this)}/>
              </div>
              <div className="item">
                <img src="../images/icon-job-details.png"/>
              </div>
              <div className="item">
                <img src="../images/icon-job-delete.png" onClick={this.onDeleteJobClick.bind(this)}/>
              </div>
            </div>
          </div>

          <div className="sixteen wide column">
            <EmployerPositionCandidatesGroup items={this.props.matchesLiked}
                                             title="FETCHED"
                                             description="THESE CANDIDATES HAVE BEEN FETCHED AND ARE INTERESTED IN YOUR POSITION"
                                             onCandidateClick={this.props.onFetchedCandidateClick}/>
          </div>

          <div className="sixteen wide column">
            <EmployerPositionCandidatesGroup items={this.props.matchesInterested}
                                             title="INTERESTED"
                                             description="THESE CANDIDATES HAVE BEEN MARKED AS INTERESTED BY YOU"
                                             onCandidateClick={this.onInterestedCandidateClick.bind(this)}/>
          </div>

          <div className="sixteen wide column">
            <EmployerPositionCandidatesGroup items={this.props.matchesOffer}
                                             title="OFFERS"
                                             description="THESE CANDIDATES HAVE BEEN SENT OFFERS FOR THIS POSITION"
                                             onCandidateClick={this.onInterestedCandidateClick.bind(this)}/>
          </div>
        </div>
      </div>
    )
  }
}

class EmployerPositionCandidatesGroup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showTooltipId: 0
    }
  }

  onCandidateClick(candidateId) {
    let candidate = null

    for (let i=0; i<this.props.items.length; i++) {
      if (candidateId.toString() === this.props.items[i].id.toString()) {
        candidate = this.props.items[i]
      }
    }
    this.props.onCandidateClick(candidate)
  }

  render() {
    if (this.props.items.length > 0) {
      return (
        <div className="ui grid fetched">
          <div className="sixteen wide column title">
            {this.props.title}
          </div>

          <div className="sixteen wide column ui horizontal list">
          {this.props.items.map(candidate => {
            return <PositionFetchedCandidateItem key={candidate.id} item={candidate} onItemClick={this.onCandidateClick.bind(this)} />
          })
          }
          </div>

          <div className="sixteen wide column accent">
            {this.props.description}
          </div>
        </div>
      )
    }
    else {
      return (
        <div className="ui grid fetched">
          <div className="sixteen wide column title">
            {this.props.title}
          </div>

          <div className="sixteen wide column accent">
            THERE ARE NO CANDIDATES FOR THIS POSITION IN THIS SECTION
          </div>
        </div>
      )
    }
  }
}

class PositionFetchedCandidateItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showTooltip: false
    }
  }

  onMouseOver(event) {
    this.setState({showTooltip: true})
  }

  onMouseOut(event) {
    this.setState({showTooltip: false})
  }

  onItemClick(event) {
    let candidateId = this.props.item.id
    this.props.onItemClick(candidateId)
  }

  render() {
    let candidate = this.props.item
    let overlayClass = "overlay"
    if (this.state.showTooltip === true) {
      overlayClass = overlayClass.concat(" hover")
    }
    let photo_url = 'http://placehold.it/100x100'
    if (candidate.talent_profile.attributes.photo_url !== undefined && candidate.talent_profile.attributes.photo_url !== null) {
      photo_url = candidate.talent_profile.attributes.photo_url
    }
    var name = ''
    if (candidate.talent_profile.attributes !== undefined) {
      name = candidate.talent_profile.attributes.name.split(' ')[0]
    }
    return (
      <div className="item" id={candidate.id} onClick={this.onItemClick.bind(this)}
           onMouseOver={this.onMouseOver.bind(this)} onMouseOut={this.onMouseOut.bind(this)}>
        <img className="ui image candidate" src={photo_url} data-id={candidate.id}/>
        <div className={overlayClass}></div>
        <EmployerInfoTooltip visible={this.state.showTooltip} talentProfile={candidate.talent_profile}/>
        <div className="mobile info">
          <span className="name">
            {name}
          </span>
          <span className="skills">
            {candidate.talent_profile.attributes.skill_list}
          </span>
        </div>
      </div>
    )
  }
}

class EmployerInfoTooltip extends React.Component {
  render() {
    let className = (this.props.visible === true) ? "info-tooltip" : "info-tooltip hidden"
    return (
      <div className={className}>
        <ul className="attributes">
          <li className="name">{this.props.talentProfile.attributes.name}</li>
          <li>{this.props.talentProfile.attributes.preferred_base_salary}</li>
          <li>{this.props.talentProfile.attributes.skill_list}</li>
        </ul>
        <div className="accent"></div>
      </div>
    )
  }
}

export default EmployerPositionDetails

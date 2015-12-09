class PositionMatchesList extends React.Component {
  render() {
    return (
      <div className="ui items">
        {this.props.items.map(match => {
          return <PositionMatch key={match.id} match={match} onClick={this.props.onItemClick} />
        })}
      </div>
    )
  }
}

class PositionMatch extends React.Component {

  onItemClick() {
    this.props.onClick(this.props.match.talent_profile.data.attributes)
  }

  render() {
    let talent = this.props.match.talent_profile.data.attributes
    let score = this.props.match.score

    return (
      <div className="item">
        <div className="ui card">
          <div className="image">
            <img src={talent.photo_url}/>
          </div>
          <div className="content">
            <a className="header" onClick={this.onItemClick.bind(this)}>
              {talent.name}
            </a>
            <div className="meta">
              {talent.summary}
            </div>
            <div className="description">
              <div className="ui list">
                <div className="item">
                  <div className="header">Skills</div>
                  {talent.skill_list}
                </div>
                <div className="item">
                  <div className="header">Compensation</div>
                  {talent.salary_range_name}
                </div>
                <div className="item">
                  <div className="header">Cities of interest</div>
                  {talent.city_list}
                </div>
              </div>
              <div className="extra content">
                score: {score}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default PositionMatchesList
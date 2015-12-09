
class TalentDashboardOfferAccepted extends React.Component {
  render() {
    let offer = this.props.offer
    let profile = this.props.profile
    return (
      <div className="offer-accepted">
        <div className="ui grid header">
          <div className="sixteen wide column">
            <h1>CONGRATS, <span className="accent">YOU'VE BEEN FETCHED!</span></h1>
          </div>
        </div>

        <div className="content ui grid">

          <div className="sixteen wide column details ui grid">
            <div className="eight wide column label">
              COMPANY:
            </div>
            <div className="eight wide column label">
              LOCATION:
            </div>

            <div className="eight wide column value">
              {offer.attributes.company_name}
            </div>
            <div className="eight wide column value">
              {offer.attributes.location}
            </div>

            <div className="eight wide column label">
              COMPENSATION:
            </div>
            <div className="eight wide column label">
              START DATE:
            </div>

            <div className="eight wide column value">
              {offer.attributes.compensation}
            </div>
            <div className="eight wide column value">
              {offer.attributes.start_date}
            </div>
          </div>

          <div className="sixteen wide column extra ui grid">
            <div className="six wide column talent">
              <img src={profile.photo_url} height="200" className="ui circular image" />
              <div className="name">{profile.name}</div>
              <div className="title">{profile.title}</div>
            </div>
            <div className="three wide column arrows">
              <img src="../images/offer-accepted-arrows.png" className="arrows" />
            </div>
            <div className="six wide column company">
              <img src={offer.attributes.company_logo_url} height="200"/>
              <div className="hiring-manager">HIRING MANAGER:</div>
              <div className="manager-name">{offer.attributes.manager_name}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default TalentDashboardOfferAccepted

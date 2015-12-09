import Constants from '../constants/api-constants'

class TalentDashboardOffers extends React.Component {
  render() {
    return (
      <div className="view-offers">
        <div className="ui grid header">
          <div className="twelve wide column">
            <div className="title">OFFERS <span className="accent">RECEIVED!</span></div>
          </div>
        </div>

        <div className="content ui list">
          {this.props.offers.map(offer => {
            return (
              <TalentDashboardOfferDetails offer={offer} key={offer.id}
                                           onOfferAcceptClick={this.props.onOfferAcceptClick}
                                           onOfferRejectClick={this.props.onOfferRejectClick}/>
            )
          })}
        </div>
      </div>
    )
  }
}

class TalentDashboardOfferDetails extends React.Component {
  onAcceptClick() {
    this.props.onOfferAcceptClick(this.props.offer)
  }

  onRejectClick() {
    this.props.onOfferRejectClick(this.props.offer)
  }

  render() {
    let offer = this.props.offer

    let buttonsSection = ''
    if (offer.attributes.status === Constants.OFFER_STATUS.UNANSWERED) {
      buttonsSection = <div className="four wide column buttons">
                        <div className="ui button green" onClick={this.onAcceptClick.bind(this)}>ACCEPT</div>
                        <div className="ui button black" onClick={this.onRejectClick.bind(this)}>DECLINE</div>
                      </div>
    }
    else if (offer.attributes.status === Constants.OFFER_STATUS.ACCEPTED) {
      buttonsSection = <div className="four wide column buttons">
                         <div className="ui button green accepted">ACCEPTED!!!</div>
                       </div>
    }
    else {
      buttonsSection = <div className="four wide column buttons">
                         <div className="ui button red declined">DECLINED</div>
                       </div>
    }

    return (
      <div className="ui item">
        <div className="ui grid">
          <div className="four wide column logo">
            <img className="ui image" src={offer.attributes.company_logo_url} width="150" height="100"></img>
          </div>
          <div className="four wide column job-properties">
            <div className="ui items">
              <div className="item">
                <div className="content">
                  <div className="meta"><span>SKILL SET:</span></div>
                  {offer.attributes.skillset}
                </div>
              </div>
              <div className="item">
                <div className="content">
                  <div className="meta"><span>COMPENSATION:</span></div>
                  {offer.attributes.compensation}
                </div>
              </div>
            </div>
          </div>
          <div className="four wide column job-properties">
            <div className="ui items">
              <div className="item">
                <div className="content">
                  <div className="meta"><span>LOCATION:</span></div>
                  {offer.attributes.location}
                </div>
              </div>
              <div className="item">
                <div className="content">
                  <div className="meta"><span>START DATE:</span></div>
                  {offer.attributes.start_date}
                </div>
              </div>
            </div>
          </div>
          {buttonsSection}
        </div>
      </div>
    )
  }
}

export default TalentDashboardOffers

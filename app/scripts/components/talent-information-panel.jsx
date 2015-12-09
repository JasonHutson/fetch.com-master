class TalentInformationPanel extends React.Component {
  constructor(props) {
    super(props)
  }

  onMakeOfferClick() {
    this.props.onMakeOfferClick(this.props.match)
  }

  render() {
    let talent = this.props.talent

    if (talent === undefined || talent.attributes === undefined) {
      return (<div></div>)
    }
    else {
      let photo_url = (talent.attributes.photo_url === '' || talent.attributes.photo_url === null) ?
                      "http://placehold.it/60x60" : talent.attributes.photo_url

      return (
        <div className="talent-information-panel">
          <div className="ui grid details">
            <div className="logo seven wide column">
              <img src={photo_url} width="50"/>
            </div>
            <div className="nine wide column">
              <div className="ui list">
                <div className="item">
                  <div className="header">
                    NAME
                  </div>
                  <span className="value">{talent.attributes.name}</span>
                </div>
                <div className="item">
                  <div className="header">
                    SKILL SET:
                  </div>
                  <span className="value">{talent.attributes.skill_list}</span>
                </div>
                <div className="item">
                  <div className="header">
                    SALARY RANGE:
                  </div>
                  <span className="value">{talent.attributes.salary_range_name}</span>
                </div>
                <div className="item">
                  <div className="header">
                    LOCATIONS:
                  </div>
                  <span className="value">{talent.attributes.city_list}</span>
                </div>
                <div className="item">
                  <div className="header">
                    CULTURES:
                  </div>
                  <span className="value">{talent.attributes.culture_list}</span>
                </div>
              </div>
            </div>
          </div>

          <MakeOfferButton match={this.props.match} onClick={this.onMakeOfferClick.bind(this)} />
        </div>
      )
    }
  }
}

class CompanySizesSelect extends React.Component {
  render() {
    let className = "ui dropdown"
    if (this.props.selectedItem === null) {
      className = className.concat(" empty")
    }
    let selectedId = (this.props.selectedItem !== null) ? this.props.selectedItem.id : 0
    return (
      <select placeholder="Select an option" className={className} value={selectedId} onChange={this.props.onChange}>
        <option disabled>SELECT AN OPTION</option>
        {this.props.items.map(company_size => {
          return (
            <option value={company_size.id} key={company_size.id}>{company_size.attributes.name}</option>
          )
        })}
      </select>
    )
  }
}

class MakeOfferButton extends React.Component {
  render() {

    let className = 'ui circular button'
    let text = ''

    if (this.props.match.attributes.offer !== undefined && this.props.match.attributes.offer !== null
        && this.props.match.attributes.offer.status === 'rejected') {
      className = className.concat(' red')
      text = <span>OFFER<br/>DECLINED<br/><span className="smaller">MAKE NEW OFFER</span></span>
    }
    else {
      className = className.concat(' green')
      text = <span>MAKE<br/><span className="thin"><i className="icon minus"/> AN <i className="icon minus"/><br/></span>OFFER</span>
    }
    return (
      <div className="section make-offer">
        <div className={className} onClick={this.props.onClick}>
          {text}
        </div>
      </div>
    )
  }
}

export default TalentInformationPanel

import CompanyInformationPanel from './company-information-panel'

class TalentDashboardCompanyProfile extends React.Component {
  render() {
    let account = this.props.account

    return (
      <div className="company-profile">
        <div className="header ui grid">
          <div className="nine wide column">
            <h1>{account.attributes.company_name}</h1>
          </div>
          <div className="seven wide column buttons">
            <button className="ui button green" onClick={this.props.onReturnClick}>
              BACK TO JOBS
            </button>
          </div>
        </div>

        <div className="content ui grid">
          <div className="ten wide column info">
            <div className="section">
              <div className="section-header">
                WHO WE ARE
              </div>
              <div className="section-info">
                {account.attributes.who_we_are}
              </div>
            </div>
            <div className="section">
              <div className="section-header">
                WHAT WE DO
              </div>
              <div className="section-info">
                {account.attributes.what_we_do}
              </div>
            </div>
            <div className="section">
              <div className="section-header">
                PERKS
              </div>
              <div className="section-info">
                {account.attributes.perks}
              </div>
            </div>
          </div>

          <div className="six wide column extra">
            <CompanyInformationPanel account={account} editMode="false" />
          </div>
        </div>
      </div>
    )
  }
}

export default TalentDashboardCompanyProfile

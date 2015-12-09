// Components
import CompanyInformationPanel from './company-information-panel'

// Actions
import AccountsActions from '../actions/accounts-actions'
import CompanySizesActions from '../actions/company-sizes-actions'

// Store
import AccountsStore from '../stores/accounts-store'
import CompanySizesStore from '../stores/company-sizes-store'

class EmployerDashboardCompanyProfile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      account: this.props.account.data,
      companySizes: [],
      selectedCompanySize: null
    }

    CompanySizesActions.fetch()
  }

  componentWillMount() {
    AccountsStore.listen(this.onAccountsChange.bind(this))
    CompanySizesStore.listen(this.onCompanySizesStoreChange.bind(this))
  }

  componentWillUnmount() {
    AccountsStore.unlisten(this.onAccountsChange.bind(this))
    CompanySizesStore.unlisten(this.onCompanySizesStoreChange.bind(this))
  }

  onAccountsChange(state) {
    this.props.onReturnClick()
  }

  onCompanySizesStoreChange(state) {
    this.setState({companySizes: CompanySizesStore.getState().company_sizes.data})
  }

  onChange(event) {
    this.onInformationPanelChange(event.target.name, event.target.value)
  }

  companySizeChangeSelection(event) {
    let id = event.target.value.toString()
    let selectedItem = null
    for (let i=0; i<this.state.companySizes.length; i++) {
      let object = this.state.companySizes[i]
      if (object.id === id.toString()) {
        selectedItem = object
        break
      }
    }
    setTimeout(function() {
      let account = this.state.account
      account.attributes.company_size_id = selectedItem.id
      this.setState({
        selectedCompanySize: selectedItem,
        account: account
      })
    }.bind(this), 0)

  }

  onInformationPanelChange(name, value) {
    let account = this.state.account
    account.attributes[name] = value
    this.setState({account: account})
  }

  onSaveClick() {
    AccountsActions.updateAccount(this.state.account.id, this.state.account)
  }

  render() {
    let account = this.state.account

    let selectedCompanySize = this.state.selectedCompanySize !== null ? this.state.selectedCompanySize : account.relationships.company_size.data

    return (
      <div className="company-profile">
        <div className="header ui grid">
          <div className="six wide column title mobile">
            EDIT COMPANY <span className="accent">PROFILE</span>
          </div>
          <div className="nine wide column name">
            <h1 className="company-name">{account.attributes.company_name}</h1>
            <img src="../images/icon-edit.png" className="icon-edit"/>
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
                <textarea name="who_we_are" className="ui input" value={account.attributes.who_we_are}
                          onChange={this.onChange.bind(this)}></textarea>
              </div>
            </div>
            <div className="section">
              <div className="section-header">
                WHAT WE DO
              </div>
              <div className="section-info">
                <textarea name="what_we_do" className="ui input" value={account.attributes.what_we_do}
                          onChange={this.onChange.bind(this)}></textarea>
              </div>
            </div>
            <div className="section">
              <div className="section-header">
                PERKS
              </div>
              <div className="section-info">
                <textarea name="perks" className="ui input" value={account.attributes.perks}
                          onChange={this.onChange.bind(this)}></textarea>
              </div>
            </div>
          </div>

          <div className="six wide column extra-fields">
            <CompanyInformationPanel account={account} editMode="true"
                                     companySizes={this.state.companySizes}
                                     selectedCompanySize={selectedCompanySize}
                                     onCompanySizeChangeSelection={this.companySizeChangeSelection.bind(this)}
                                     onInputChange={this.onInformationPanelChange.bind(this)} />
          </div>

          <div className="sixteen wide column buttons">
            <div className="ui button green right floated accent" onClick={this.onSaveClick.bind(this)}>SAVE CHANGES</div>
          </div>
        </div>
      </div>
    )
  }
}

export default EmployerDashboardCompanyProfile

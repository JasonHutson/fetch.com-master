// Components
import { TwoStateBoxImage } from 'scripts/components/two-state-box-image'
import MessageErrorPanel from './message-error-panel'
import DashboardFooter from './dashboard-footer'

// Actions
var EmployerSignupActions = require("../actions/employer-signup-actions")
var SessionActions = require('../actions/session-actions')
var CompanySizesActions = require('../actions/company-sizes-actions')
import SignupEmployerWithInvitationActions from '../actions/signup-employer-with-invitation-actions'

// Stores
var SessionStore = require('../stores/session-store')
var CompanySizesStore = require('../stores/company-sizes-store')
var CulturesStore = require("../stores/cultures-store")
var CulturesActions = require("../actions/cultures-actions")
import EmployerSignupStore from '../stores/employer-signup-store'
import SignupEmployerWithInvitationStore from '../stores/signup-employer-with-invitation-store'

const STEP_PERSONAL_INFO = 1
const STEP_COMPANY_INFO = 2
const STEP_COMPANY_DETAILS = 3
const STEP_COMPANY_CULTURE = 4

class EmployerSignupApp extends React.Component {
  constructor() {
    super()

    this.state = {
      cultureOptions: [],
      userDetails: {},
      companyInfo: {},
      companyLogoFile: null,
      companyLogoFileName: '',
      selectedCompanySize: null,
      selectedCultureOptions: [],
      companySizes: [],
      currentStep: STEP_PERSONAL_INFO,
      enableFinishButton: true,
      cultureError: null,
      signupError: null,
      signupWithInvitation: false,
      accountId: null
    }

    CompanySizesActions.fetch()
    CulturesActions.fetch()
  }

  componentWillMount() {
    SessionStore.listen(this.onSessionStatusChange.bind(this))
    CompanySizesStore.listen(this.onCompanySizesStoreChange.bind(this))
    CulturesStore.listen(this.onCulturesChange.bind(this))
    EmployerSignupStore.listen(this.onEmployerSignupChange.bind(this))
  }

  componentWillUnmount() {
    SessionStore.unlisten(this.onSessionStatusChange.bind(this))
    CompanySizesStore.unlisten(this.onCompanySizesStoreChange.bind(this))
    CulturesStore.unlisten(this.onCulturesChange.bind(this))
    EmployerSignupStore.unlisten(this.onEmployerSignupChange.bind(this))
  }

  componentDidMount() {
    let accountId = SignupEmployerWithInvitationStore.getAccountId()
    if (accountId !== undefined && accountId !== null && accountId > 0) {
      this.setState({
        signupWithInvitation: true,
        accountId: accountId
      })
    }
    SignupEmployerWithInvitationActions.clearValues()
  }

  onSessionStatusChange() {
    if (SessionStore.getAuthToken() !== '' && SessionStore.getAuthToken() !== null && SessionStore
        && SessionStore.state.loading === false) {
      window.location.href = "/employer-dashboard.html"
    }
  }

  onEmployerSignupChange(state) {
    if (state.signupCorrect) {
      SessionActions.login.defer(this.state.userDetails.email, this.state.userDetails.password)
    }
    else {
      if ("email" in state.errors) {
        let error = {
          title: 'Signup error',
          text: "Email " + state.errors["email"]
        }
        this.setState({
          currentStep: STEP_PERSONAL_INFO,
          signupError: error,
          enableFinishButton: true
        })
      }
    }
  }

  onCompanySizesStoreChange() {
    this.setState({companySizes: CompanySizesStore.getState().company_sizes.data})
  }

  onCulturesChange() {
    this.setState({cultureOptions: CulturesStore.getState().cultures.data})
  }

  updatePersonalInfo(name, value) {
    let userDetails = this.state.userDetails
    userDetails[name] = value
    this.setState({userDetails: userDetails})
  }

  updateCompanyInfo(name, value) {
    let companyInfo = this.state.companyInfo
    companyInfo[name] = value
    this.setState({companyInfo: companyInfo})
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
    this.setState({selectedCompanySize: selectedItem})
  }

  updateSelectedCultureOptions(option) {
    let selectedOptions = this.state.selectedCultureOptions
    let index = -1
    for (let i=0; i<selectedOptions.length; i++) {
      if (option.id === selectedOptions[i].id) {
        index = i
        selectedOptions.splice(index, 1)
        break
      }
    }
    if (index === -1) {
      selectedOptions.push(option)
    }
    this.setState({selectedCultureOptions: selectedOptions})
  }

  companyLogoChanged(file) {
    var reader = new FileReader()
    reader.onload = function(output) {
      this.setState({
        companyLogoFile: output.target.result,
        companyLogoFileName: file.name
      })
    }.bind(this)

    reader.readAsDataURL(file)
  }

  prevStepButtonClick() {
    this.setState({currentStep:this.state.currentStep-1})
  }

  nextStepButtonClick() {
    if (this.state.signupWithInvitation === true && this.state.currentStep === STEP_PERSONAL_INFO) {
      EmployerSignupActions.createUser(this.state, this.state.accountId)
    }
    else {
      this.setState({currentStep:this.state.currentStep+1})
    }
  }

  finishButtonClick() {
    if (this.state.selectedCultureOptions.length === 0) {
      let error = {
        title: 'Validation error',
        text: 'You must select at least one culture option'
      }
      this.setState({cultureError: error})
    }
    else {
      this.setState({enableFinishButton: false})
      EmployerSignupActions.createUser(this.state)
    }
  }

  render() {
    var partial = ''
    var className = 'signup '

    switch(this.state.currentStep) {
      case STEP_PERSONAL_INFO:
        partial = <EmployerPersonalInfoPanel error={this.state.signupError}
                                             userDetails={this.state.userDetails}
                                             onChange={this.updatePersonalInfo.bind(this)}
                                             onNextStep={this.nextStepButtonClick.bind(this)} />
        className = className.concat("employer-info")
        break
      case STEP_COMPANY_INFO:
        partial = <EmployerCompanyInfoPanel companySizes={this.state.companySizes} selectedCompanySize={this.state.selectedCompanySize}
                                            companyLogoFileName={this.state.companyLogoFileName}
                                            companyInfo={this.state.companyInfo}
                                            onCompanySizeChangeSelection={this.companySizeChangeSelection.bind(this)}
                                            onChange={this.updateCompanyInfo.bind(this)}
                                            onChangeLogoFile={this.companyLogoChanged.bind(this)}
                                            onNextStep={this.nextStepButtonClick.bind(this)}
                                            onPrevStep={this.prevStepButtonClick.bind(this)}/>
        className = className.concat("employer-info")
        break
      case STEP_COMPANY_DETAILS:
        partial = <EmployerCompanyDetailsPanel companyInfo={this.state.companyInfo}
                                               onChange={this.updateCompanyInfo.bind(this)}
                                               onNextStep={this.nextStepButtonClick.bind(this)}
                                               onPrevStep={this.prevStepButtonClick.bind(this)}/>
        className = className.concat("employer-info who-we-are")
        break
      case STEP_COMPANY_CULTURE:
        partial = <EmployerCompanyCulturePanel items={this.state.cultureOptions} selectedItems={this.state.selectedCultureOptions}
                                               error={this.state.cultureError}
                                               enableNextStepButton={this.state.enableFinishButton}
                                               onChangeSelection={this.updateSelectedCultureOptions.bind(this)}
                                               onNextStep={this.finishButtonClick.bind(this)}
                                               onPrevStep={this.prevStepButtonClick.bind(this)}/>
        className = className.concat("company-culture")
        break
    }

    return (
      <div className={className}>
        <div className="mobile-signup-header"/>
        {partial}
        <DashboardFooter />
      </div>
    )
  }
}

class EmployerPersonalInfoPanel extends React.Component {
  onChangeInput(event) {
    this.props.onChange(event.target.name, event.target.value)
  }

  componentDidMount() {
    $('#personalInfoForm').form({
      on: 'blur',
      inline: true,
      onSuccess: (event, fields) => {
        event.preventDefault()
        this.props.onNextStep()
      },
      fields: {
        firstName: {
          identifier: 'firstName',
          rules: [{ type: 'empty', prompt: 'Please enter your first name' }]
        },
        lastName: {
          identifier: 'lastName',
          rules: [{ type: 'empty', prompt: 'Please enter your last name' }]
        },
        email: {
          identifier: 'email',
          rules: [
            { type: 'empty', prompt: 'Please enter your email' },
            { type: 'email', prompt: 'Please enter a valid email' }
          ]
        },
        password: {
          identifier: 'password',
          rules: [{ type: 'empty', prompt: 'Please enter a password' }]
        },
        passwordConfirmation: {
          identifier: 'passwordConfirmation',
          rules: [{ type: 'match[password]', prompt: 'The password must be the same' }]
        }
      }
    })
  }

  onNextStepClick() {
    $('#personalInfoForm').form('submit')
  }

  render() {
    return (
      <div>
        <div className="ui cards">
          <div className="signup card">
            <div className="content">
              <div className="header panel">
                COMPANY SIGN UP
              </div>
              <div className="meta">

                <MessageErrorPanel error={this.props.error} />

                <form className="ui form" id="personalInfoForm" method="post">
                  <div className="field">
                    <label>First Name: </label>
                    <input type="text" name="firstName" className="name" value={this.props.userDetails.firstName}
                           onChange={this.onChangeInput.bind(this)} placeholder="FIRST NAME"/>
                  </div>
                  <div className="field">
                    <label>Last Name: </label>
                    <input type="text" name="lastName" className="name" value={this.props.userDetails.lastName}
                           onChange={this.onChangeInput.bind(this)} placeholder="LAST NAME"/>
                  </div>
                  <div className="field">
                    <label>Email Address: </label>
                    <input type="text" name="email" className="email" value={this.props.userDetails.email}
                           onChange={this.onChangeInput.bind(this)} placeholder="EMAIL"/>
                  </div>
                  <div className="field">
                    <label>Password: </label>
                    <input type="password" name="password" className="security" value={this.props.userDetails.password}
                           onChange={this.onChangeInput.bind(this)} placeholder="PASSWORD"/>
                  </div>
                  <div className="field">
                    <label>Confirm Password: </label>
                    <input type="password" name="passwordConfirmation" className="security" value={this.props.userDetails.passwordConfirmation}
                           onChange={this.onChangeInput.bind(this)} placeholder="CONFIRM PASSWORD"/>
                  </div>
                  <div className="field">
                    <label>Title: </label>
                    <input type="text" name="title" className="title" value={this.props.userDetails.title}
                           onChange={this.onChangeInput.bind(this)} placeholder="TITLE"/>
                  </div>
                </form>
              </div>
            </div>
            <div className='right-arrow' onClick={this.onNextStepClick.bind(this)}>
              <span className="text">NEXT</span>
            </div>
          </div>
        </div>

        <div className="ui grid buttons-panel">
          <div className="four wide column">
            <a href="#" className="button">
              <div className="content">HOW</div>
              <div className="button-top-left-accent"></div>
            </a>
          </div>
          <div className="four wide column">
            <a href="#" className="button">
              <div className="content">WHY</div>
              <div className="button-top-left-accent"></div>
            </a>
          </div>
          <div className="four wide column">
            <a href="#" className="button">
              <div className="content">INVITE</div>
              <div className="button-top-left-accent"></div>
            </a>
          </div>
          <div className="four wide column">
            <a href="#" className="button">
              <div className="content">CONTACT</div>
              <div className="button-top-left-accent"></div>
            </a>
          </div>
        </div>
      </div>
    )
  }
}

class EmployerCompanyInfoPanel extends React.Component {
  onChangeInput(event) {
    this.props.onChange(event.target.name, event.target.value)
  }

  onChangeLogoFile(event) {
    var file = React.findDOMNode(this.refs.companyLogo).files[0]
    this.props.onChangeLogoFile(file)
  }

  componentDidMount() {
    $('#companyInfoForm').form({
      on: 'blur',
      inline: true,
      onSuccess: (event, fields) => {
        event.preventDefault()
        this.props.onNextStep()
      },
      fields: {
        companyName: {
          identifier: 'companyName',
          rules: [{ type: 'empty', prompt: 'Please enter the company name' }]
        },
      }
    })
  }

  onNextStepClick() {
    $('#companyInfoForm').form('submit')
  }

  render() {
    return (
      <div>
        <div className="ui cards">
          <div className="signup card">
            <div className="content">
              <div className="header panel">
                COMPANY SIGN UP
              </div>
              <div className="meta">
                <form className="ui form" id="companyInfoForm" method="post">
                  <div className="field">
                    <label>Company Name: </label>
                    <input type="text" name="companyName" value={this.props.companyInfo.companyName}
                           onChange={this.onChangeInput.bind(this)} placeholder="COMPANY NAME"
                           className="company-name"/>
                  </div>
                  <div className="field">
                    <label>Website: </label>
                    <input type="text" name="website" value={this.props.companyInfo.website}
                           onChange={this.onChangeInput.bind(this)} placeholder="WEBSITE URL"
                           className="website"/>
                  </div>
                  <div className="field">
                    <label>Year founded: </label>
                    <input type="text" name="yearFounded" value={this.props.companyInfo.yearFounded}
                           onChange={this.onChangeInput.bind(this)} placeholder="YEAR FOUNDED"
                           className="year-founded"/>
                  </div>
                  <div className="field">
                    <label>Company Size: </label>
                    <CompanySizesSelect items={this.props.companySizes}
                                        selectedItem={this.props.selectedCompanySize}
                                        onChange={this.props.onCompanySizeChangeSelection}/>
                  </div>
                  <div className="field">
                    <label className="company-logo">Company Logo: </label>
                    <button className="ui button file-upload">
                      <span>Browse</span>
                      <input type="file" className="upload" ref="companyLogo" onChange={this.onChangeLogoFile.bind(this)}/>
                    </button>
                    <span className="file-upload-status">{this.props.companyLogoFileName}</span>
                  </div>
                </form>
              </div>
            </div>
            <div className='top-left-accent'></div>
            <div className='left-arrow' onClick={this.props.onPrevStep}></div>
            <div className='right-arrow' onClick={this.onNextStepClick}>
              <span className="text">NEXT</span>
            </div>
          </div>
        </div>

        <div className="ui grid buttons-panel">
          <div className="four wide column">
            <a href="#" className="button">
              <div className="content">HOW</div>
              <div className="button-top-left-accent"></div>
            </a>
          </div>
          <div className="four wide column">
            <a href="#" className="button">
              <div className="content">WHY</div>
              <div className="button-top-left-accent"></div>
            </a>
          </div>
          <div className="four wide column">
            <a href="#" className="button">
              <div className="content">INVITE</div>
              <div className="button-top-left-accent"></div>
            </a>
          </div>
          <div className="four wide column">
            <a href="#" className="button">
              <div className="content">CONTACT</div>
              <div className="button-top-left-accent"></div>
            </a>
          </div>
        </div>
      </div>
    )
  }
}

class EmployerCompanyDetailsPanel extends React.Component {
  onChangeInput(event) {
    this.props.onChange(event.target.name, event.target.value)
  }

  render() {
    return (
      <div>
        <div className="ui cards">
          <div className="signup card">
            <div className="content">
              <div className="header panel">
                COMPANY SIGN UP
              </div>
              <div className="meta">
                <div className="ui form">
                  <div className="field text-area">
                    <label>Who We Are: </label>
                    <textarea name="whoWeAre" className="ui input" rows="4" value={this.props.companyInfo.whoWeAre}
                              placeholder="WHO WE ARE"
                              onChange={this.onChangeInput.bind(this)}></textarea>
                  </div>
                  <div className="field text-area">
                    <label>What We Do: </label>
                    <textarea name="whatWeDo" className="ui input" rows="4" value={this.props.companyInfo.whatWeDo}
                              placeholder="WHAT WE DO"
                              onChange={this.onChangeInput.bind(this)}></textarea>
                  </div>
                  <div className="field text-area">
                    <label>Perks: </label>
                    <textarea name="perks" className="ui input" rows="4" value={this.props.companyInfo.perks}
                              placeholder="PERKS"
                              onChange={this.onChangeInput.bind(this)}></textarea>
                  </div>
                  <div className="field">
                    <label>Company Video: </label>
                    <input type="text" name="companyVideoUrl" value={this.props.companyInfo.companyVideoUrl}
                           placeholder="YOUTUBE VIDEO URL"
                           onChange={this.onChangeInput.bind(this)} />
                  </div>
                </div>
              </div>
            </div>
            <div className='top-left-accent'></div>
            <div className='left-arrow' onClick={this.props.onPrevStep}></div>
            <div className='right-arrow' onClick={this.props.onNextStep}>
              <span className="text">NEXT</span>
            </div>
          </div>
        </div>

        <div className="ui grid buttons-panel">
          <div className="four wide column">
            <a href="#" className="button">
              <div className="content">HOW</div>
              <div className="button-top-left-accent"></div>
            </a>
          </div>
          <div className="four wide column">
            <a href="#" className="button">
              <div className="content">WHY</div>
              <div className="button-top-left-accent"></div>
            </a>
          </div>
          <div className="four wide column">
            <a href="#" className="button">
              <div className="content">INVITE</div>
              <div className="button-top-left-accent"></div>
            </a>
          </div>
          <div className="four wide column">
            <a href="#" className="button">
              <div className="content">CONTACT</div>
              <div className="button-top-left-accent"></div>
            </a>
          </div>
        </div>
      </div>
    )
  }
}

class EmployerCompanyCulturePanel extends React.Component {
  constructor(props) {
    super(props)
  }

  updateSelectedOption(label, id) {
    this.props.onChangeSelection({id:id, name:label})
  }

  render() {
    let rightArrowClassName = 'right-arrow'
    let rightArrowLoadingClassName = 'right-arrow-loading'

    if (this.props.enableNextStepButton === true) {
      rightArrowLoadingClassName = rightArrowLoadingClassName.concat(' hidden')
    }
    else {
      rightArrowClassName = rightArrowClassName.concat(' hidden')
    }

    return (
      <div>
        <div className="ui cards">
          <div className="signup card">
            <div className="content">
              <div className="header panel">
                <span className="text">COMPANY SIGN UP</span>
              </div>
              <div className="meta">

                <MessageErrorPanel error={this.props.error} />

                <div>
                  <div className="skillset-instructions">
                    <h2>CHOOSE YOUR DESIRED <span className="green">COMPANY CULTURE</span></h2>
                    <span className="green"><h4>{this.props.currentSkillCategoryName}</h4></span>
                  </div>
                    {this.props.items.map(option => {
                      let selected = false
                      for (let i=0; i<this.props.selectedItems.length; i++) {
                        if (option.id === this.props.selectedItems[i].id) {
                          selected = true
                          break
                        }
                      }
                      return (
                        <div className="option" key={option.id}>
                          <TwoStateBoxImage label={option.attributes.name} key={option.id} id={option.id} selected={selected}
                                       imageUrl={option.attributes.photo_url}
                                       updateSelectedOption={this.updateSelectedOption.bind(this)} />
                        </div>
                      )
                    })}
                </div>
              </div>
            </div>
            <div className='card-top-left-accent'></div>
            <div className='left-arrow' onClick={this.props.onPrevStep}></div>
            <div className={rightArrowClassName} onClick={this.props.onNextStep}>
              <span className="text">FINISH</span>
            </div>
            <div className={rightArrowLoadingClassName} onClick={this.props.onNextStep}>
              <span className="text">FINISH</span>
              <span className="loading-text">Loading...</span>
              <img src="../images/ajax-loader.gif" className="spinner"></img>
            </div>
          </div>
        </div>
      </div>
    )
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
        <option disabled>COMPANY SIZE</option>
        {this.props.items.map(company_size => {
          return (
            <option value={company_size.id} key={company_size.id}>{company_size.attributes.name}</option>
          )
        })}
      </select>
    )
  }
}

React.render(
  <EmployerSignupApp />,
  document.getElementById('employerSignupPanel')
);

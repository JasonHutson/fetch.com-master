// Components
import { TwoStateBox } from 'scripts/components/two-state-box'
import { TwoWayToggle } from 'scripts/components/two-way-toggle'
import { TwoStateBoxImage } from 'scripts/components/two-state-box-image'
import { RankSlider } from 'scripts/components/rank-slider'
import MessageErrorPanel from './message-error-panel'
import DashboardFooter from './dashboard-footer'

// Actions
var CitiesActions = require("../actions/cities-actions")
var CompensationsActions = require("../actions/compensations-actions")
var SkillsActions = require("../actions/skills-actions")
var CulturesActions = require("../actions/cultures-actions")
var SessionActions = require('../actions/session-actions')
var TalentSignupActions = require("../actions/talent-signup-actions")

// Stores
var CitiesStore = require("../stores/cities-store")
var CompensationsStore = require("../stores/compensations-store")
var CulturesStore = require("../stores/cultures-store")
var SessionStore = require("../stores/session-store")
var SkillCategoriesStore = require("../stores/skill-categories-store")
var SkillCategoriesActions = require("../actions/skill-categories-actions")
var SkillsStore = require("../stores/skills-store")
var TalentSignupStore = require("../stores/talent-signup-store")

const STEP_PERSONAL_INFO = 1
const STEP_COMPENSATION = 2
const STEP_SKILLSET = 3
const STEP_SKILLSET_DETAILS = 4
const STEP_SKILLSET_RANKS = 5
const STEP_LOCATION = 6
const STEP_CULTURE = 7

class TalentSignupApp extends React.Component {

  constructor() {
    super()

    SkillCategoriesActions.fetch()
    CitiesActions.fetch()
    CulturesActions.fetch()
    CompensationsActions.fetch()

    this.state = {
      userDetails: {},
      currentStep: 1,
      selectedSkillCategory: null,
      selectedCompensation: null,
      selectedSkills: [],
      selectedLocations: [],
      selectedCultureOptions: [],
      skillCategories: [],
      currentSkillCategoryName: null,
      selectedCompensationType: "Direct Hire",
      compensationError: null,
      skillsetError: null,
      skillsetDetailsError: null,
      locationsError: null,
      cultureError: null,
      signupError: null
    }

    this.skills = []
    this.locations = []
    this.cultureOptions = []
    this.compensations = []
  }

  componentWillMount() {
    SkillCategoriesStore.listen(this.onSkillCategoriesChange.bind(this))
    SkillsStore.listen(this.onSkillsChange.bind(this))
    CitiesStore.listen(this.onCitiesChange.bind(this))
    CompensationsStore.listen(this.onCompensationsChange.bind(this))
    CulturesStore.listen(this.onCulturesChange.bind(this))
    TalentSignupStore.listen(this.onTalentSignupChange.bind(this))
    SessionStore.listen(this.onSessionChange.bind(this))
  }

  componentWillUnmount() {
    SkillCategoriesStore.unlisten(this.onSkillCategoriesChange.bind(this))
    SkillsStore.unlisten(this.onSkillsChange.bind(this))
    CitiesStore.unlisten(this.onCitiesChange.bind(this))
    CompensationsStore.unlisten(this.onCompensationsChange.bind(this))
    CulturesStore.unlisten(this.onCulturesChange.bind(this))
    TalentSignupStore.unlisten(this.onTalentSignupChange.bind(this))
    SessionStore.unlisten(this.onSessionChange.bind(this))
  }

  onSessionChange(state) {
    if (SessionStore.getAuthToken() !== '' && SessionStore.getAuthToken() !== null && SessionStore
        && SessionStore.state.loading === false) {
      window.location.href = "/talent-dashboard.html"
    }
  }

  onTalentSignupChange(state) {
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
          signupError: error
        })
      }
    }
  }

  onSkillCategoriesChange() {
    this.setState({skillCategories: SkillCategoriesStore.getState().categories.data})
  }

  onSkillsChange() {
    this.skills = SkillsStore.getState().skills.data
  }

  onCitiesChange() {
    this.locations = CitiesStore.getState().cities.data
  }

  onCompensationsChange(state) {
    this.compensations = state.compensations.data
  }

  onCulturesChange() {
    this.cultureOptions = CulturesStore.getState().cultures.data
  }

  updateSelectedSkillCategory(category) {
    let selectedSkill = category

    this.setState({selectedSkillCategory: selectedSkill})

    let selectedCategoriesIds = [selectedSkill.id]
    this.setState({selectedSkills: []})

    SkillsActions.fetchByCategory(category.id)
  }

  updatePersonalInfo(name, value) {
    let userDetails = this.state.userDetails
    userDetails[name] = value
    this.setState({userDetails: userDetails})
  }

  updateSelectedCompensation(compensation) {
    this.setState({selectedCompensation:compensation})
  }

  updateSelectedSkills(skill) {
    this.currentSkillCategory = this.state.selectedSkillCategory
    skill.category = this.currentSkillCategory.name
    skill.rank = 5

    let selectedSkills = this.state.selectedSkills
    let index = -1
    for (let i=0; i<selectedSkills.length; i++) {
      if (selectedSkills[i].id === skill.id) {
        index = i
        selectedSkills.splice(index, 1)
        break
      }
    }
    if (index === -1) {
      selectedSkills.push(skill)
    }
    this.setState({selectedSkills: selectedSkills})
  }

  updateSelectedCompensationType(compensationType) {
    this.setState({selectedCompensationType: compensationType})
  }

  updateSelectedLocations(location) {
    let selectedLocations = this.state.selectedLocations
    let index = -1
    for (let i=0; i<selectedLocations.length; i++) {
      if (selectedLocations[i].id === location.id) {
        index = i
        selectedLocations.splice(index, 1)
        break
      }
    }
    if (index === -1) {
      selectedLocations.push(location)
    }
    this.setState({selectedLocations: selectedLocations})
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

  updateSkillRank(id, value) {
    let selectedSkills = this.state.selectedSkills
    for(let i=0; i<selectedSkills.length; i++) {
      let skill = selectedSkills[i]
      if (id === skill.id) {
        selectedSkills[i].rank = value
      }
    }
    this.setState({selectedSkills: selectedSkills})
  }

  prevStepButtonClick() {
    this.setState({currentStep:this.state.currentStep-1})
  }

  nextStepButtonClick() {
    let canAdvance = false;

    if (this.state.currentStep === STEP_SKILLSET_DETAILS) {
      let currentSkillsetStep = this.state.currentSkillsetStep+1
      if (this.state.selectedSkills.length === 0) {
        let error = {
          title: 'Validation error',
          text: 'You must select at least one skill'
        }
        this.setState({skillsetDetailsError: error})
      }
      else {
        canAdvance = true;
      }
    }
    else if (this.state.currentStep === STEP_SKILLSET) {
      if (this.state.selectedSkillCategory === null || this.state.selectedSkillCategory === undefined) {
        let error = {
          title: 'Validation error',
          text: 'You must select at least one category'
        }
        this.setState({skillsetError: error})
      }
      else {
        canAdvance = true
        this.setState({currentSkillCategoryName: this.state.selectedSkillCategory.name})
      }
    }
    else if (this.state.currentStep === STEP_COMPENSATION) {
      if (this.state.selectedCompensation === null || this.state.selectedCompensation === undefined) {
        let error = {
          title: 'Validation error',
          text: 'You must select one compensation'
        }
        this.setState({compensationError: error})
      }
      else {
        canAdvance = true
      }
    }
    else if (this.state.currentStep === STEP_LOCATION) {
      if (this.state.selectedLocations.length === 0) {
        let error = {
          title: 'Validation error',
          text: 'You must select at least one location'
        }
        this.setState({locationsError: error})
      }
      else {
        canAdvance = true
      }
    }
    else {
      canAdvance = true
    }

    if (canAdvance === true) {
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
      TalentSignupActions.createUser(this.state)
    }
  }

  render() {
    var partial
    var className = "signup"

    switch(this.state.currentStep) {
      case STEP_PERSONAL_INFO:
        partial = <TalentPersonalInfoPanel onChange={this.updatePersonalInfo.bind(this)}
                                           userDetails={this.state.userDetails}
                                           error={this.state.signupError}
                                           onNextStep={this.nextStepButtonClick.bind(this)} />
        className = className.concat(" personal-info")
        break
      case STEP_COMPENSATION:
        partial = <TalentCompensationPanel items={this.compensations} selectedItem={this.state.selectedCompensation}
                                           selectedCompensationType={this.state.selectedCompensationType}
                                           updateSelectedCompensationType={this.updateSelectedCompensationType.bind(this)}
                                           onChangeSelection={this.updateSelectedCompensation.bind(this)}
                                           error={this.state.compensationError}
                                           onNextStep={this.nextStepButtonClick.bind(this)}
                                           onPrevStep={this.prevStepButtonClick.bind(this)}/>
        className = className.concat(" compensation")
        break
      case STEP_SKILLSET:
        partial = <TalentSkillsetPanel items={this.state.skillCategories} selectedItem={this.state.selectedSkillCategory}
                                       onChangeSelection={this.updateSelectedSkillCategory.bind(this)}
                                       error={this.state.skillsetError}
                                       onNextStep={this.nextStepButtonClick.bind(this)}
                                       onPrevStep={this.prevStepButtonClick.bind(this)}/>
        className = className.concat(" skillset1")
        break
      case STEP_SKILLSET_DETAILS:
        partial = <TalentSkillsetDetailsPanel items={this.skills} selectedItems={this.state.selectedSkills}
                                              selectedCategory={this.state.selectedSkillCategory}
                                              currentSkillCategoryName={this.state.currentSkillCategoryName}
                                              error={this.state.skillsetDetailsError}
                                              onChangeSelection={this.updateSelectedSkills.bind(this)}
                                              onNextStep={this.nextStepButtonClick.bind(this)}
                                              onPrevStep={this.prevStepButtonClick.bind(this)}/>
        className = className.concat(" skillset2")
        break
      case STEP_SKILLSET_RANKS:
        partial = <TalentSkillsetRanksPanel items={this.state.selectedSkills}
                                            onValueChanged={this.updateSkillRank.bind(this)}
                                            onNextStep={this.nextStepButtonClick.bind(this)}
                                            onPrevStep={this.prevStepButtonClick.bind(this)}/>
        className = className.concat(" skillset3")
        break;
      case STEP_LOCATION:
        partial = <TalentLocationPanel items={this.locations} selectedItems={this.state.selectedLocations}
                                       error={this.state.locationsError}
                                       onChangeSelection={this.updateSelectedLocations.bind(this)}
                                       onNextStep={this.nextStepButtonClick.bind(this)}
                                       onPrevStep={this.prevStepButtonClick.bind(this)}/>
        className = className.concat(" location")
        break
      case STEP_CULTURE:
        partial = <TalentCompanyCulturePanel items={this.cultureOptions} selectedItems={this.state.selectedCultureOptions}
                                             error={this.state.cultureError}
                                             onChangeSelection={this.updateSelectedCultureOptions.bind(this)}
                                             onNextStep={this.finishButtonClick.bind(this)}
                                             onPrevStep={this.prevStepButtonClick.bind(this)}/>
        className = className.concat(" culture")
        break
    }
    return (
      <div className={className}>
        <div className="signup-header"/>
        {partial}
        <DashboardFooter />
      </div>
    )
  }
}

class TalentPersonalInfoPanel extends React.Component {

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

  onChangeInput(event) {
    this.props.onChange(event.target.name, event.target.value)
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
                SIGN UP
              </div>
              <div className="meta">

                <MessageErrorPanel error={this.props.error} />

                <form className="ui form" id="personalInfoForm" method="post">
                  <div className="field">
                    <label>First Name: </label>
                    <input type="text" name="firstName" className="name" placeholder="FIRST NAME" value={this.props.userDetails.firstName} onChange={this.onChangeInput.bind(this)}/>
                  </div>
                  <div className="field">
                    <label>Last Name: </label>
                    <input type="text" name="lastName" className="name" placeholder="LAST NAME" value={this.props.userDetails.lastName} onChange={this.onChangeInput.bind(this)}/>
                  </div>
                  <div className="field">
                    <label>Email Address: </label>
                    <input type="text" name="email" className="email" placeholder="EMAIL" value={this.props.userDetails.email} onChange={this.onChangeInput.bind(this)}/>
                  </div>
                  <div className="field">
                    <label>Password: </label>
                    <input type="password" name="password" className="security" placeholder="PASSWORD" value={this.props.userDetails.password} onChange={this.onChangeInput.bind(this)}/>
                  </div>
                  <div className="field">
                    <label>Confirm Password: </label>
                    <input type="password" name="passwordConfirmation" className="security" placeholder="CONFIRM PASSWORD" value={this.props.userDetails.passwordConfirmation} onChange={this.onChangeInput.bind(this)}/>
                  </div>
                  <div className="field title">
                    <label>Title: </label>
                    <input type="text" name="title" value={this.props.userDetails.title} onChange={this.onChangeInput.bind(this)}/>
                  </div>
                  <div className="field company">
                    <label>Company: </label>
                    <input type="text" name="company" value={this.props.userDetails.company} onChange={this.onChangeInput.bind(this)}/>
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

class TalentCompensationPanel extends React.Component {
  constructor(props) {
    super(props)
  }

  updateSelectedOption(label, id) {
    this.props.onChangeSelection({id:id, name:label})
  }

  updateSelectedCompensationType(value) {
    this.props.updateSelectedCompensationType(value)
  }

  activeCompensationType() {
    if(this.props.selectedCompensationType === "Direct Hire"){
      return "left"
    } else {
      return "right"
    }
  }

  onNextStepClick() {

  }

  render() {
    return (
      <div>
        <div className="ui cards">
          <div className="signup card">
            <div className="content">
              <div className="header panel">
                TALENT COMPENSATION
              </div>
              <div className="meta">
                <div className="ui centered grid">

                  <MessageErrorPanel error={this.props.error} />

                  <div className="twelve wide column contract-type">
                    <TwoWayToggle left="Direct Hire" right="Contract" active={this.activeCompensationType()} onSelection={this.updateSelectedCompensationType.bind(this)} />
                  </div>
                  {this.props.items.map(compensation => {
                    let selected = (this.props.selectedItem !== null && compensation.id === this.props.selectedItem.id)
                    return (
                      <div className="six wide column option" key={compensation.id}>
                        <TwoStateBox label={compensation.attributes.name} selected={selected} key={compensation.id} id={compensation.id}
                                     updateSelectedOption={this.updateSelectedOption.bind(this)} />
                      </div>
                    )
                  })}
                </div>
                <div className="ui centered grid note">
                  <div className="twelve wide column">
                    <span className="instructions">* Salary request should reflect years of experience.</span>
                  </div>
                </div>
              </div>
            </div>
            <div className='top-right-accent'></div>
            <div className='left-arrow' onClick={this.props.onPrevStep}></div>
            <div className='right-arrow' onClick={this.props.onNextStep}>
              <span className="text">NEXT</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

class TalentSkillsetPanel extends React.Component {
  constructor(props) {
    super(props)
  }

  updateSelectedOption(category, id) {
    this.props.onChangeSelection({name:category, id:id})
  }

  render() {
    if (this.props.items === undefined) {
    return (
      <div>
        <div className="ui cards">
          <div className="signup card">
            <div className="content">
              <div className="header">
                SKILL SETS
              </div>
            </div>
          </div>
        </div>
      </div>
      )
    }
    else {
    return (
      <div>
        <div className="ui cards">
          <div className="signup card">
            <div className="content">
              <div className="header panel">
                SKILL SETS
              </div>
              <div className="meta">

                <MessageErrorPanel error={this.props.error} />

                <div className="ui centered grid skills">
                  <div className="fourteen wide column skillset-instructions">
                    <h2>CHOOSE YOUR <span className="green">ROLE</span></h2>
                  </div>
                  {this.props.items.map(category => {
                    let selected = false
                    if (this.props.selectedItem !== null && this.props.selectedItem.id === category.id) {
                      selected = true
                    }
                    return (
                      <div className="seven wide column">
                        <TwoStateBox label={category.attributes.name} id={category.id} key={category.id} selected={selected}
                                     updateSelectedOption={this.updateSelectedOption.bind(this)} />
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
            <div className='top-right-accent'></div>
            <div className='left-arrow' onClick={this.props.onPrevStep}></div>
            <div className='right-arrow' onClick={this.props.onNextStep}>
              <span className="text">NEXT</span>
            </div>
          </div>
        </div>
      </div>
    )
    }
  }
}

class TalentSkillsetDetailsPanel extends React.Component {
  constructor(props) {
    super(props)
  }

  updateSelectedOption(label, id) {
    this.props.onChangeSelection({id:id, name:label})
  }

  render() {
    return (
      <div>
        <div className="ui cards">
          <div className="signup card">
            <div className="content">
              <div className="header panel">
                SKILL SETS
              </div>
              <div className="meta">
                <div className="ui centered grid">

                <MessageErrorPanel error={this.props.error} />

                <div className="fourteen wide column centered">
                  <div className="skillset-instructions">
                    <div className="leftmost">
                      <h2>CHOOSE YOUR TOP 3</h2>
                      <h2 className="skills">&nbsp;SKILLS</h2>
                    </div>
                    <div className="rightmost">
                      <h2><span className="green skill-sets">SKILL SETS</span></h2>
                      <h4><span className="green category-name">{this.props.currentSkillCategoryName}</span></h4>
                    </div>
                  </div>
                </div>
                  {this.props.items.map(skill => {
                    let selected = false
                    let key = skill.relationships.skill_category.data.id + skill.id
                    for (let i=0; i<this.props.selectedItems.length; i++) {
                      if (this.props.selectedItems[i].id === skill.id) {
                        selected = true
                        break
                      }
                    }
                    return (
                      <div className="seven wide column">
                        <TwoStateBox label={skill.attributes.name} id={skill.id} key={key} selected={selected}
                                     updateSelectedOption={this.updateSelectedOption.bind(this)} />
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
            <div className='top-right-accent'></div>
            <div className='left-arrow' onClick={this.props.onPrevStep}></div>
            <div className='right-arrow' onClick={this.props.onNextStep}>
              <span className="text">NEXT</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

class TalentSkillsetRanksPanel extends React.Component {
  constructor(props) {
    super(props)
    this.skills = this.props.items
    this.skills.sort(function(a, b) {
      return a.category > b.category
    })
  }

  handleValueChanged(id, value) {
    this.props.onValueChanged(id, value)
  }

  render() {
    let previousCategory = null
    return (
      <div>
        <div className="ui cards">
          <div className="signup card">
            <div className="content">
              <div className="header panel">
                SKILL SETS
              </div>
              <div className="meta">
                <div className="ui centered grid">
                  <div className="thirteen wide column skillset-instructions">
                    <h2>RANK YOUR <span className="green">SKILL SETS</span></h2>
                  </div>
                    {this.skills.map(skill => {
                      let selected = false
                      let printCategory = false
                      let key = skill.category + skill.id
                      if (skill.category !== previousCategory) {
                        printCategory = true
                        previousCategory = skill.category
                      }
                      if (printCategory) {
                        return (
                          <div className="thirteen wide column rank">
                            <h3 key={skill.id}>{skill.category}</h3>
                            <RankSlider label={skill.name} id={skill.id} key={key}
                                        min="0" max="10" step="1" value={skill.rank}
                                        handleOnChanged={this.handleValueChanged.bind(this)}/>
                          </div>
                        )
                      }
                      else {
                        return (
                          <div className="thirteen wide column rank" key={key}>
                            <RankSlider label={skill.name} id={skill.id} key={key}
                                        min="0" max="10" step="1" value="5"
                                        handleOnChanged={this.handleValueChanged.bind(this)}/>
                          </div>
                        )
                      }
                    })}
                </div>
              </div>
            </div>
            <div className='top-right-accent'></div>
            <div className='left-arrow' onClick={this.props.onPrevStep}></div>
            <div className='right-arrow' onClick={this.props.onNextStep}>
              <span className="text">NEXT</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

class TalentLocationPanel extends React.Component {
  constructor() {
    super()
  }

  updateSelectedOption(label, id) {
    this.props.onChangeSelection({id:id, name:label})
  }

  render() {
    return (
      <div>
        <div className="ui cards">
          <div className="signup card">
            <div className="content">
              <div className="header panel">
                LOCATION
              </div>
              <div className="meta">
                <div className="ui centered grid">

                  <MessageErrorPanel error={this.props.error} />

                  <div className="fourteen wide column skillset-instructions">
                    <h2>CHOOSE YOUR TOP 3 <span className="green">LOCATIONS</span></h2>
                    <span className="green"><h4>{this.props.currentSkillCategoryName}</h4></span>
                  </div>
                    {this.props.items.map(location => {
                      let selected = false
                      for (let i=0; i<this.props.selectedItems.length; i++) {
                        if (this.props.selectedItems[i].id === location.id) {
                          selected = true
                          break
                        }
                      }
                      return (
                        <div className="seven wide column" key={location.id}>
                          <TwoStateBox label={location.attributes.full_name} selected={selected} id={location.id} key={location.id}
                                       updateSelectedOption={this.updateSelectedOption.bind(this)} />
                        </div>
                      )
                    })}
                </div>
              </div>
            </div>
            <div className='top-right-accent'></div>
            <div className='left-arrow' onClick={this.props.onPrevStep}></div>
            <div className='right-arrow' onClick={this.props.onNextStep}>
              <span className="text">NEXT</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

class TalentCompanyCulturePanel extends React.Component {
  constructor(props) {
    super(props)
  }

  updateSelectedOption(label, id) {
    this.props.onChangeSelection({id:id, name:label})
  }

  render() {
    return (
      <div>
        <div className="ui cards">
          <div className="signup card">
            <div className="content">
              <div className="header panel">
                COMPANY CULTURE
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
            <div className='top-right-accent'></div>
            <div className='left-arrow' onClick={this.props.onPrevStep}></div>
            <div className='right-arrow' onClick={this.props.onNextStep}>
              <span className="text">FINISH</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

React.render(
  <TalentSignupApp />,
  document.getElementById('talentSignupPanel')
)

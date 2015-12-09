// Components
import DropDown from './drop-down'

// Actions
import EmployerAddJobActions from '../actions/employer-add-job-actions'

// Stores
import EmployerAddJobStore from '../stores/employer-add-job-store'

class EmployerAddJob extends React.Component {
  constructor(props) {
    super(props)
    this.state = EmployerAddJobStore.getState()
  }

  componentWillMount() {
    EmployerAddJobStore.listen(this.onAddJobChange.bind(this))
  }

  componentDidMount() {
    $('#addJobForm').form({
      on: 'blur',
      inline: true,
      onSuccess: (event, fields) => {
        this.onFormSubmit(event)
      },
      fields: {
        title: {
          identifier: 'title',
          rules: [{ type: 'empty', prompt: 'Please enter the job title' }]
        },
        location: {
          identifier: 'location',
          rules: [{ type: 'empty', prompt: 'Please select the location' }]
        },
        skillset1: {
          identifier: 'skillset1',
          rules: [{ type: 'empty', prompt: 'Please select at least one skill' }]
        },
        compensation: {
          identifier: 'compensation',
          rules: [{ type: 'empty', prompt: 'Please select the compensation' }]
        },
        employmentType: {
          identifier: 'employmentType',
          rules: [{ type: 'empty', prompt: 'Please select job type' }]
        },
        description: {
          identifier: 'description',
          rules: [{ type: 'empty', prompt: 'Please enter a job description' }]
        }
      }
    })
  }

  componentWillUnmount() {
    EmployerAddJobStore.unlisten(this.onAddJobChange.bind(this))
  }

  onAddJobChange(state) {
    if (state.createdCorrectly === true) {
      this.props.onBackClick(true)
    }
  }

  setSkillset() {
    let skillset = []

    let skill1Tag = React.findDOMNode(this.refs.skillset1)
    let skill2Tag = React.findDOMNode(this.refs.skillset2)
    let skill2MobileTag = React.findDOMNode(this.refs.skillset2Mobile)
    let skill3Tag = React.findDOMNode(this.refs.skillset3)
    let skill3MobileTag = React.findDOMNode(this.refs.skillset3Mobile)

    if ($(skill1Tag).find('.default.text').length === 0) {
      let skill1Name = React.findDOMNode(this.refs.skillset1).getElementsByClassName('text')[0].textContent
      skillset.push(skill1Name)
    }

    if ($(skill2Tag).find('.default.text').length === 0) {
      let skill2Name = React.findDOMNode(this.refs.skillset2).getElementsByClassName('text')[0].textContent
      skillset.push(skill2Name)
    }
    if ($(skill2MobileTag).find('.default.text').length === 0) {
      let skill2Name = React.findDOMNode(this.refs.skillset2Mobile).getElementsByClassName('text')[0].textContent
      skillset.push(skill2Name)
    }

    if ($(skill3Tag).find('.default.text').length === 0) {
      let skill3Name = React.findDOMNode(this.refs.skillset3).getElementsByClassName('text')[0].textContent
      skillset.push(skill3Name)
    }
    if ($(skill3MobileTag).find('.default.text').length === 0) {
      let skill3Name = React.findDOMNode(this.refs.skillset3Mobile).getElementsByClassName('text')[0].textContent
      skillset.push(skill3Name)
    }
    return skillset
  }

  onLocationChange(newValue, text) {
    let position = this.state.position
    position['location'] = newValue
    this.setState({position: position})
  }

  onCompensationChange(newValue, text) {
    let position = this.state.position
    position['compensation'] = newValue
    this.setState({position: position})
  }

  onEmploymentTypeChange(newValue, text) {
    let position = this.state.position
    position['employmentType'] = newValue
    this.setState({position: position})
  }

  onSkill1Change(newValue, text) {
    let position = this.state.position
    position['skill1'] = newValue
    setTimeout(function() {
      position['skillset'] = this.setSkillset()
    }.bind(this), 0)
    this.setState({position: position})
  }

  onSkill2Change(newValue, text) {
    let position = this.state.position
    position['skill2'] = newValue
    setTimeout(function() {
      position['skillset'] = this.setSkillset()
    }.bind(this), 0)
    this.setState({position: position})
  }

  onSkill3Change(newValue, text) {
    let position = this.state.position
    position['skill3'] = newValue
    setTimeout(function() {
      position['skillset'] = this.setSkillset()
    }.bind(this), 0)
    this.setState({position: position})
  }

  onSkill2MobileChange(newValue, text) {
    let position = this.state.position
    position['skill2'] = newValue
    setTimeout(function() {
      position['skillset'] = this.setSkillset()
    }.bind(this), 0)
    this.setState({position: position})
  }

  onSkill3MobileChange(newValue, text) {
    let position = this.state.position
    position['skill3'] = newValue
    setTimeout(function() {
      position['skillset'] = this.setSkillset()
    }.bind(this), 0)
    this.setState({position: position})
  }

  onChangeInput(event) {
    let name = event.target.name
    let value = event.target.value

    let position = this.state.position
    position[name] = value

    this.setState({position: position})
  }

  onFormSubmit(event) {
    event.preventDefault()
    EmployerAddJobActions.addJob(this.state)
  }

  render() {
    return (
      <div className="add-job ui grid">
        <div className="sixteen wide column ui grid header">
          <div className="title eight wide column">
            <h1>ADD NEW <span className="green">JOB</span></h1>
          </div>
          <div className="eight wide column right floated buttons">
            <div className="ui green button right floated" onClick={this.props.onBackClick}>BACK TO JOBS</div>
          </div>
        </div>

        <div className="sixteen wide column">
        <form className="ui form" id="addJobForm" method="post">
          <div className="ui grid">

            <div className="five wide column field">
              <label>JOB TITLE</label>
              <div className="value">
                <input type="text" name="title" onChange={this.onChangeInput.bind(this)}/>
              </div>
            </div>
            <div className="five wide column field skillset1">
              <label>SKILL SET</label>
              <div className="value">
                <DropDown name="skillset1"
                          ref="skillset1"
                          defaultText="SKILLSET 1"
                          onChange={this.onSkill1Change.bind(this)}
                          items={this.props.skills}/>
              </div>
            </div>
            <div className="five wide column field skills mobile">
              <div className="value middle">
                <DropDown name="skillset2Mobile"
                          ref="skillset2Mobile"
                          defaultText="SKILLSET 2"
                          onChange={this.onSkill2MobileChange.bind(this)}
                          items={this.props.skills}/>
              </div>
              <div className="value">
                <DropDown name="skillset3Mobile"
                          ref="skillset3Mobile"
                          defaultText="SKILLSET 3"
                          onChange={this.onSkill3MobileChange.bind(this)}
                          items={this.props.skills}/>
              </div>
            </div>
            <div className="six wide column field location">
              <label>LOCATION</label>
              <div className="value">
                <DropDown name="location"
                          ref="location"
                          defaultText="Select an option"
                          items={this.props.cities}
                          onChange={this.onLocationChange.bind(this)} />
              </div>
            </div>

            <div className="five wide column field compensation">
              <label>COMPENSATION</label>
              <div className="value">
                <DropDown name="compensation"
                          ref="compensation"
                          defaultText="Select an option"
                          items={this.props.compensations}
                          onChange={this.onCompensationChange.bind(this)} />
              </div>
            </div>
            <div className="five wide column field skills desktop">
              <div className="value middle">
                <DropDown name="skillset2"
                          ref="skillset2"
                          defaultText="SKILLSET 2"
                          onChange={this.onSkill2Change.bind(this)}
                          items={this.props.skills}/>
              </div>
              <div className="value">
                <DropDown name="skillset3"
                          ref="skillset3"
                          defaultText="SKILLSET 3"
                          onChange={this.onSkill3Change.bind(this)}
                          items={this.props.skills}/>
              </div>
            </div>
            <div className="six wide column">
            </div>

            <div className="sixteen wide column">
              <label>JOB DESCRIPTION</label>
            </div>

            <div className="sixteen wide column">
              <div className="field full-width">
                <textarea rows="8" name="description" onChange={this.onChangeInput.bind(this)}></textarea>
              </div>
            </div>

            <div className="five wide column field">
              <label>Job type</label>
              <div className="value">
                <DropDown name="employmentType"
                          defaultText="Select an option"
                          items={this.props.employmentTypes}
                          onChange={this.onEmploymentTypeChange.bind(this)} />
              </div>
            </div>
            <div className="five wide column">
            </div>
            <div className="six wide column upload-job-description">
              <label>Upload job description</label>
                <button className="ui button file-upload">
                  <span>Browse</span>
                  <input type="file" className="upload" ref="jobDescription"/>
                </button>
                <span className="file-upload-status">Upload Complete...</span>
            </div>

            <div className="fifteen wide column buttons">
              <div className="ui green submit button right floated">SUBMIT JOB</div>
            </div>
          </div>
        </form>
        </div>
      </div>
    )
  }
}

export default EmployerAddJob

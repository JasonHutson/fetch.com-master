// Components
import DropDown from './drop-down'

// Actions
import TalentProfileActions from '../actions/talent-profile-actions'

// Stores
import TalentProfileStore from '../stores/talent-profile-store'

class TalentDashboardEditProfile extends React.Component {
  constructor(props) {
    super(props)

    this.state = TalentProfileStore.getState()
  }

  componentWillMount() {
    TalentProfileStore.listen(this.onTalentProfileChange.bind(this))
  }

  componentWillUnmount() {
    TalentProfileStore.unlisten(this.onTalentProfileChange.bind(this))
  }

  componentDidMount() {
    $('#editProfileForm').form({
      on: 'blur',
      inline: true,
      onSuccess: (event, fields) => {
        this.onFormSubmit(event)
      },
      fields: {
        location: {
          identifier: 'location',
          rules: [{ type: 'empty', prompt: 'Please select at least one location' }]
        },
        skillset1: {
          identifier: 'skillset1',
          rules: [{ type: 'empty', prompt: 'Please select at least one skill' }]
        },
        salary_range_id: {
          identifier: 'salary_range_id',
          rules: [{ type: 'empty', prompt: 'Please select the compensation' }]
        },
        culture: {
          identifier: 'culture',
          rules: [{ type: 'empty', prompt: 'Please select at least one culture' }]
        }
      }
    })
  }

  onChangeResumeFile(event) {
    var reader = new FileReader()
    reader.onload = function(output) {
      this.setState({
        resumeFile: output.target.result,
        resumeFilename: file.name
      })
    }.bind(this)
    let file = event.target.files[0]
    reader.readAsDataURL(file)
  }

  onChangePictureFile(event) {
    var reader = new FileReader()
    reader.onload = function(output) {
      this.setState({
        pictureFile: output.target.result,
        pictureFilename: file.name
      })
    }.bind(this)
    let file = event.target.files[0]
    reader.readAsDataURL(file)
  }

  onChangeInput(event) {
    let name = event.target.name
    let value = event.target.value

    let talent = this.state.newTalentProfile
    talent[name] = value

    this.setState({newTalentProfile: talent})
  }

  onTalentProfileChange(state) {
    if (state.updatedSuccess) {
      this.props.onReturnClick()
    }
  }

  setSkillset() {
    let skillset = []

    let skill1Tag = React.findDOMNode(this.refs.skillset1)
    let skill2Tag = React.findDOMNode(this.refs.skillset2)
    let skill3Tag = React.findDOMNode(this.refs.skillset3)

    if ($(skill1Tag).find('.default.text').length === 0) {
      let skill1Name = React.findDOMNode(this.refs.skillset1).getElementsByClassName('text')[0].textContent
      skillset.push(skill1Name)
    }

    if ($(skill2Tag).find('.default.text').length === 0) {
      let skill2Name = React.findDOMNode(this.refs.skillset2).getElementsByClassName('text')[0].textContent
      skillset.push(skill2Name)
    }

    if ($(skill3Tag).find('.default.text').length === 0) {
      let skill3Name = React.findDOMNode(this.refs.skillset3).getElementsByClassName('text')[0].textContent
      skillset.push(skill3Name)
    }
    return skillset
  }

  onLocationChange(newValue, text) {
    let talent = this.state.newTalentProfile
    talent['location_list'] = newValue
    this.setState({newTalentProfile: talent})
  }

  onCompensationChange(newValue, text) {
    let talent = this.state.newTalentProfile
    talent['salary_range_id'] = newValue
    this.setState({newTalentProfile: talent})
  }

  onCultureChange(newValue, text) {
    let talent = this.state.newTalentProfile
    talent['culture'] = newValue
    this.setState({newTalentProfile: talent})
  }

  onSkill1Change(newValue, text) {
    let talent = this.state.newTalentProfile
    talent['skill1'] = newValue
    setTimeout(function() {
      talent['skillset'] = this.setSkillset()
    }.bind(this), 0)
    this.setState({newTalentProfile: talent})
  }

  onSkill2Change(newValue, text) {
    let talent = this.state.newTalentProfile
    talent['skill2'] = newValue
    setTimeout(function() {
      talent['skillset'] = this.setSkillset()
    }.bind(this), 0)
    this.setState({newTalentProfile: talent})
  }

  onSkill3Change(newValue, text) {
    let talent = this.state.newTalentProfile
    talent['skill3'] = newValue
    setTimeout(function() {
      talent['skillset'] = this.setSkillset()
    }.bind(this), 0)
    this.setState({newTalentProfile: talent})
  }

  onBeforeCompareLocationItem(item) {
    let newItem = {
      id: item.id,
      name: item.name.split(',')[0]
    }
    return newItem
  }

  onFormSubmit(event) {
    event.preventDefault()
    TalentProfileActions.updateProfile(this.props.talent.id, this.state)
  }

  render() {
    let skillset = this.props.talent.skill_list.split(', ')
    let talent_picture = this.props.talent.photo_url !== null ? this.props.talent.photo_url : 'https://placehold.it/150x150'

    return (
      <div className="edit-profile">

        <div className="ui grid header">
          <div className="sixteen wide column">
            <div className="title">EDIT <span className="accent">PROFILE</span></div>
          </div>
        </div>

        <div className="content ui grid">
          <form className="ui form" id="editProfileForm" method="post">
            <div className="ui grid">

              <div className="five wide column field">
                <label>CURRENT TITLE</label>
                  <div className="value">
                    <input type="text" name="title" defaultValue={this.props.talent.title} onChange={this.onChangeInput.bind(this)}/>
                  </div>
              </div>
              <div className="five wide column field">
                <label className="skillset">SKILL SET</label>
                <label className="skill">SKILLSET 1</label>
                  <div className="value">
                    <DropDown name="skillset1"
                              ref="skillset1"
                              defaultText="SKILLSET 1"
                              defaultValue={skillset[0]}
                              onChange={this.onSkill1Change.bind(this)}
                              items={this.props.skills}/>
                  </div>
              </div>
              <div className="six wide column field">
                <label>LOCATION</label>
                  <div className="value">
                    <DropDown name="location_list"
                              ref="location_list"
                              defaultText="Select an option"
                              defaultValue={this.props.talent.city_list}
                              multiple="true"
                              items={this.props.cities}
                              onBeforeCompareItem={this.onBeforeCompareLocationItem.bind(this)}
                              onChange={this.onLocationChange.bind(this)} />
                  </div>
              </div>

              <div className="five wide column field">
                <label>COMPENSATION</label>
                  <div className="value">
                    <DropDown name="salary_range_id"
                              ref="salary_range_id"
                              defaultText="Select an option"
                              defaultValue={this.props.talent.salary_range_name}
                              items={this.props.compensations}
                              onChange={this.onCompensationChange.bind(this)} />
                  </div>
              </div>
              <div className="five wide column field skills">
                <label className="skill middle">SKILLSET 2</label>
                <div className="value middle">
                  <DropDown name="skillset2"
                            ref="skillset2"
                            defaultText="SKILLSET 2"
                            defaultValue={skillset[1]}
                            onChange={this.onSkill2Change.bind(this)}
                            items={this.props.skills}/>
                </div>
                <label className="skill">SKILLSET 3</label>
                <div className="value">
                  <DropDown name="skillset3"
                            ref="skillset3"
                            defaultText="SKILLSET 3"
                            defaultValue={skillset[2]}
                            onChange={this.onSkill3Change.bind(this)}
                            items={this.props.skills}/>
                </div>
              </div>
              <div className="six wide column field">
                <label>CULTURE</label>
                  <div className="value culture">
                    <DropDown name="culture_list"
                              ref="culture_list"
                              defaultText="Select an option"
                              multiple="true"
                              defaultValue={this.props.talent.culture_list}
                              items={this.props.cultures}
                              onChange={this.onCultureChange.bind(this)} />
                  </div>
              </div>

              <div className="sixteen wide column field about-me">
                <label>ABOUT ME</label>
              </div>

              <div className="sixteen wide column">
                <div className="field full-width">
                  <textarea rows="8" name="summary" defaultValue={this.props.talent.summary} onChange={this.onChangeInput.bind(this)}></textarea>
                </div>
              </div>

              <div className="five wide column field">
                <label>GITHUB ACCOUNT</label>
                <div className="value">
                  <input type="text" name="github_url" className="lowercase" defaultValue={this.props.talent.github_url}
                         onChange={this.onChangeInput.bind(this)}/>
                </div>
              </div>
              <div className="five wide column field">
                <label>LINKEDIN PROFILE</label>
                <div className="value">
                  <input type="text" name="linked_in_url" className="lowercase" defaultValue={this.props.talent.linked_in_url}
                         onChange={this.onChangeInput.bind(this)}/>
                </div>
              </div>
              <div className="six wide column resume">
                <label>UPLOAD RESUME</label>
                  <button className="ui button file-upload">
                    <span>BROWSE</span>
                    <input type="file" className="upload" ref="resume" onChange={this.onChangeResumeFile.bind(this)}/>
                  </button>
                  <span className="file-upload-status">{this.state.resumeFilename}</span>
              </div>

              <div className="sixteen wide column picture ui grid">
                <div className="four wide column current">
                  <img src={talent_picture} width="150" />
                  <span className="text">CURRENT PROFILE PICTURE</span>
                </div>

                <div className="twelve wide column update">
                  <label>UPDATE PICTURE</label>
                  <button className="ui button file-upload">
                    <span>BROWSE</span>
                    <input type="file" className="upload" ref="resume" onChange={this.onChangePictureFile.bind(this)}/>
                  </button>
                  <span className="file-upload-status">{this.state.pictureFilename}</span>
                </div>

              </div>

              <div className="fifteen wide column buttons">
                <div className="ui green submit button right floated">SAVE CHANGES</div>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default TalentDashboardEditProfile

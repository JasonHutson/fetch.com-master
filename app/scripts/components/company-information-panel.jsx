class CompanyInformationPanel extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    $('.company-video').embed()
  }

  onInputChange(event) {
    this.props.onInputChange(event.target.name, event.target.value)
  }

  inputField(name, value, isLink) {
    if (this.props.editMode === "true") {
      return <input type="text" name={name} value={value}
              className="ui input" onChange={this.onInputChange.bind(this)}/>
    } else {
      if (isLink && value !== undefined && value !== null) {
        let link = value
        if (value.indexOf('http') === -1) {
          link = "http://" + value
        }
        return <a href={link} target="_blank"><span className="value">{value}</span></a>
      } else {
        return <span className="value">{value}</span>
      }
    }
  }

  videoField(text, value) {
    if (this.props.editMode === "true") {
      return <input type="text" name="video_url" value={value}
              className="ui input video" onChange={this.onInputChange.bind(this)}/>
    } else {
      return <span className="value">{text}</span>
    }
  }

  companySizesField(value) {
    if (this.props.editMode === "true") {
      return <CompanySizesSelect items={this.props.companySizes}
                                 selectedItem={this.props.selectedCompanySize}
                                 onChange={this.props.onCompanySizeChangeSelection}/>

    } else {
      return <span className="value">{value}</span>
    }
  }

  render() {
    let account = this.props.account
    let sectionVideoClass = "section video"
    if (this.props.editMode === "true") {
      sectionVideoClass = sectionVideoClass.concat(" edit")
    }

    if (account === undefined || account.attributes === undefined) {
      return (<div></div>)
    } else {
      let videoUrl = account.attributes.video_url
      if (videoUrl !== undefined && videoUrl !== null && videoUrl.indexOf('youtube') !== -1) {
        videoUrl = videoUrl.replace("watch?v=", "embed/")
      }

      return (
        <div className="company-information-panel">
          <div className="ui grid details">
            <div className="logo seven wide column">
              <img src={account.attributes.logo_url}/>
            </div>
            <div className="nine wide column">
              <div className="ui list">
                <div className="item">
                  <div className="header">
                    WEBSITE:
                  </div>
                  {this.inputField("company_site_url", account.attributes.company_site_url, true)}
                </div>
                <div className="item">
                  <div className="header">
                    YEAR FOUNDED:
                  </div>
                  {this.inputField("year_founded", account.attributes.year_founded)}
                </div>
                <div className="item">
                  <div className="header">
                    COMPANY SIZE:
                  </div>
                  {this.companySizesField(account.attributes.company_size_name)}
                </div>
              </div>
            </div>
          </div>

          <div className={sectionVideoClass}>
            <div className="company-video" data-url={videoUrl}></div>
            <div className="description">
              <div className="label">
                COMPANY VIDEO:
              </div>
              {this.videoField("WATCH COMPANY VIDEO", account.attributes.video_url)}
            </div>
          </div>
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

export default CompanyInformationPanel

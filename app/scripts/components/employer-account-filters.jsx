import FilterComboBox from './filter-combo-box'

class EmployerAccountFilters extends React.Component {
  render() {
    let skills = this.props.skills
    let locations = this.props.locations
    let compensations = this.props.compensations

    return (
      <div className="account-filters">
        <div className="title">FILTER JOBS BY:</div>

        <div className="ui list">
          <div className="item">
            <div className="header">SKILL SET:</div>
            <FilterComboBox items={skills} onSelectionChanged={this.props.onSelectedSkillChanged} />
          </div>
          <div className="item">
            <div className="header">COMPENSATION:</div>
            <FilterComboBox items={compensations} onSelectionChanged={this.props.onSelectedCompensationChanged} />
          </div>
          <div className="item">
            <div className="header">LOCATIONS:</div>
            <FilterComboBox items={locations} onSelectionChanged={this.props.onSelectedLocationChanged} />
          </div>
        </div>
      </div>
    )
  }
}

export default EmployerAccountFilters
import EmployerPositionsStore from '../stores/employer-positions-store'

class EmployerPositionsListItem extends React.Component {

  onClickMessages() {
    this.props.onClickMessages(this.props.item)
  }

  onClickDetails() {
    this.props.onClickDetails(this.props.item)
  }

  onClickDelete() {
    this.props.onClickDelete(this.props.item)
  }

  render() {
    let position = this.props.item;
    return (
      <div className="position item" onClick={this.onClickDetails.bind(this)}>
        <div className="content ui grid">

          <div className="sixteen wide column ui grid details">
            <div className="five wide column label">
              {position.attributes.job_title}
            </div>
            <div className="five wide column label">
              SKILL SET
            </div>
            <div className="six wide column label">
              LOCATION
            </div>

            <div className="five wide column value">
            </div>
            <div className="five wide column value">
              {position.attributes.required_skill_list}
            </div>
            <div className="six wide column value">
              {position.attributes.city_name}
            </div>

            <div className="five wide column label">
              &nbsp;
            </div>
            <div className="five wide column label">
              COMPENSATION
            </div>
            <div className="six wide column label">
              CULTURE
            </div>

            <div className="five wide column value">
              &nbsp;
            </div>
            <div className="five wide column value">
              {position.attributes.salary_range_name}
            </div>
            <div className="six wide column value">
              {position.attributes.cultures}
            </div>
          </div>
        </div>      
      </div>
    )
  }

}

export default EmployerPositionsListItem
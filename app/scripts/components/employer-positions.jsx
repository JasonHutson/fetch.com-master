import EmployerPositionsListItem from './employer-positions-list-item'

class EmployerPositions extends React.Component {
  constructor(props) {
    super(props)
  }

  onClickDetails(position) {
    this.props.onClickDetails(position)
  }

  render() {
    if (this.props.items.length > 0) {
      return (
        <div className="job-board">
          <div className="ui grid header">
            <div className="four wide column">
              <h1 className="title">JOB <span className="accent">BOARD</span></h1>
            </div>
            <div className="four wide column add-job">
              <div className="ui button green" onClick={this.props.onAddJobClick}>ADD NEW JOB</div>
            </div>

            <EmployerDashboardJobStatusFilter statusFilter={this.props.statusFilter}
                                              onChangeStatus={this.props.onStatusFilterChange} />
          </div>
          <div className="ui items">
            {this.props.items.map(position => {
              return <EmployerPositionsListItem key={position.id} item={position} id={position.id}
                                                onClickDetails={this.onClickDetails.bind(this)}/>
            })}
          </div>
        </div>
      )
    } else {
      return (
        <div className="job-board">
          <div className="ui grid header">
            <div className="four wide column">
              <h1 className="title">JOB <span className="accent">BOARD</span></h1>
            </div>
            <div className="four wide column add-job">
              <div className="ui button green" onClick={this.props.onAddJobClick}>ADD NEW JOB</div>
            </div>

            <EmployerDashboardJobStatusFilter statusFilter={this.props.statusFilter}
                                              onChangeStatus={this.props.onStatusFilterChange} />
          </div>
          <div className="ui items">
            <div className="no-jobs">
              <h3>No jobs added</h3>
            </div>
          </div>
        </div>
      )
    }
  }
}

class EmployerDashboardJobStatusFilter extends React.Component {
  onActiveJobsClick() {
    this.props.onChangeStatus("active")
  }

  onFetchedJobsClick() {
    this.props.onChangeStatus("fetched")
  }

  render() {
    let activeJobsClass = "ui button right floated"
    let fetchedJobsClass = "ui button right floated"

    if (this.props.statusFilter === "active") {
      activeJobsClass = activeJobsClass.concat(" green")
      fetchedJobsClass = fetchedJobsClass.concat(" black")
    }
    else if (this.props.statusFilter === "fetched") {
      activeJobsClass = activeJobsClass.concat(" black")
      fetchedJobsClass = fetchedJobsClass.concat(" green")
    }

    return (
      <div className="eight wide column ui list job-filter">
        <div className="item">
        <div className={activeJobsClass} onClick={this.onActiveJobsClick.bind(this)}>ACTIVE JOBS</div>
        </div>
        <div className="item">
        <div className={fetchedJobsClass} onClick={this.onFetchedJobsClick.bind(this)}>FETCHED JOBS</div>
        </div>
      </div>
    )
  }
}

export default EmployerPositions

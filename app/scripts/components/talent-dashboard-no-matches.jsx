class TalentDashboardNoMatches extends React.Component {
  render() {
    return (
      <div className="no-matches">
        <div className="ui grid header">
          <div className="twelve wide column">
            <div className="position-name">NO MATCHES <span className="accent">FOUND</span></div>
          </div>
        </div>

        <div className="content">
          <p className="accent">WE'RE SORRY BUT YOU HAVE NOT BEEN MATCHED WITH ANY JOBS ON THE FETCH PLATFORM</p>
          <p>PLEASE BE ON THE LOOKOUT FOR EMAILS FROM FETCH UPDATING YOU OF MATCHES!</p>

          <div className="inner-content">
            <div className="text">
              <p>HAVE QUESTIONS?</p>
              <p className="accent">CONTACT YOUR AGENT</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default TalentDashboardNoMatches
class LandingPage extends React.Component {
  render() {
    return (
      <div>
        <div className='slogan'>
          Matching Talent<span>/</span>Employers
        </div>
        <h1 className="langing-logo">
          <a href='/'>
            <span>
              Fetch
            </span>
          </a>
        </h1>
        <div className="ui centered grid login-block">
          <div className="column six centered row">
            <div className="column">
              <a className='login-link ui inverted button' href='/talent-login.html'>
               talent login
               </a>
            </div>
            <div className="column">
              <a className='login-link ui inverted button' href='/employer-login.html'>
                employer login
              </a>
            </div>
            <div className="column">
              <a className='login-link ui inverted button' href='/agent-login.html'>
                agent login
              </a>
            </div>
          </div>
        </div>
        <div className="ui cards">
          <div className="card">
            <a href="/talent-signup.html">
              <div className="content">
                <div className="header">
                  Talent
                </div>
                <div className="meta">
                  build a profile
                </div>
              </div>
              <div className='top-left-accent'></div>
            </a>
          </div>
          <div className="card">
            <a href="/employer-signup.html">
              <div className="content">
                <div className="header">
                  Employer
                </div>
                <div className="meta">
                  Build a Profile
                </div>
              </div>
              <div className='top-left-accent'></div>
            </a>
          </div>
        </div>
      </div>
    )
  }
}

export default LandingPage;

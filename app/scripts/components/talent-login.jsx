var SessionStore = require('../stores/session-store')
var SessionActions = require('../actions/session-actions')
import Constants from '../constants/api-constants'
import EmailHandlerStore from '../stores/email-handler-store'
import DashboardFooter from './dashboard-footer'

class TalentLoginApp extends React.Component {
  constructor() {
    super()
    this.state = {
      loginFailed: false
    }
  }

  componentWillMount() {
    SessionStore.listen(this.onSessionStatusChange.bind(this))
  }

  componentWillUnmount() {
    SessionStore.unlisten(this.onSessionStatusChange.bind(this))
  }

  componentDidMount() {
    $('#loginForm').form({
      on: 'blur',
      inline: true,
      onSuccess: (event, fields) => {
        this.onFormSubmit(event)
      },
      fields: {
        username: {
          identifier: 'username',
          rules: [{ type: 'empty', prompt: 'Please enter your username' }]
        },
        password: {
          identifier: 'password',
          rules: [{ type: 'empty', prompt: 'Please enter your password' }]
        }
      }
    })
    var username = React.findDOMNode(this.refs.username)
    username.value = EmailHandlerStore.getUser()
  }

  onSessionStatusChange(state) {
    if (SessionStore.getAuthToken() !== '' && SessionStore.getAuthToken() !== null) {
      this.setState({loginFailed:false})
      window.location.href = "/talent-dashboard.html"
    }
    else if (state.loginFailed) {
      this.setState({loginFailed:true})
    }
  }

  onReturn() {
    window.location.href = "/"
  }

  onLoginClick() {
    $('#loginForm').form('submit')
  }

  onFormSubmit(event) {
    event.preventDefault()
    var username = React.findDOMNode(this.refs.username).value
    var password = React.findDOMNode(this.refs.password).value
    SessionActions.login(username, password)
  }


  render() {
    let errorMessageClass = "twelve wide column error-message"
    if (this.state.loginFailed) {
      errorMessageClass = errorMessageClass.concat(" show")
    }

    return (
      <div className="login-container">
        <div className="login-header">
        </div>
        <div className="ui cards">
          <div className="login card">
            <div className="content">
              <div className="header login">
                TALENT LOGIN
              </div>
              <div className="meta">
                <form className="ui form" id="loginForm" method="post">
                  <div className="ui grid form">
                    <div className="ui grid fourteen wide column social-networks">
                      <div className="five wide column pull-right">
                        <span className="label">SIGN IN USING</span>
                      </div>
                      <div className="ten wide column pull-left field buttons">
                        <a href={Constants.API_ENDPOINTS.OMNIAUTH_GITHUB+"?type=talent"}>
                          <div className="ui green button github">GITHUB</div>
                        </a>
                        <span className="or">OR</span>
                        <a href={Constants.API_ENDPOINTS.OMNIAUTH_LINKEDIN+"?type=talent"}>
                          <div className="ui green button linkedin">LINKEDIN</div>
                        </a>
                      </div>
                    </div>

                      <div className={errorMessageClass}>
                        <div className="ui negative message">
                          <i className="close icon"></i>
                          <div className="header">
                            Login failed!
                          </div>
                          <p>Check your username and password</p>
                        </div>
                      </div>

                    <div className="five wide column space">&nbsp;</div>
                    <div className="eight wide column pull-left field">
                      <div className="ui input">
                        <input type="text" name="username" placeholder="USERNAME" className="name" ref="username"/>
                      </div>
                    </div>
                    <div className="five wide column space">&nbsp;</div>
                    <div className="eight wide column pull-left field">
                      <div className="ui input">
                        <input type="password" name="password" placeholder="PASSWORD" className="security" ref="password"/>
                      </div>
                    </div>
                    <div className="five wide column space">&nbsp;</div>
                    <div className="eight wide column center field">
                      <div className="ui black button login" onClick={this.onLoginClick.bind(this)}>LOGIN</div>
                    </div>
                    <div className="five wide column space">&nbsp;</div>
                    <div className="eight wide column center field extras">
                      <div className="ui checkbox">
                        <input type="checkbox"/> <label>Remember me</label>
                      </div>
                      <a href="/forgot-password.html" className="forgot-password">Forgot Password?</a>
                    </div>
                  </div>
                  <div className="fourteen wide column center sign-up">
                    <span>DON'T HAVE AN ACCOUNT? SIGN UP!</span>
                    <a href="/talent-signup.html">talent</a> | <a href="/employer-signup.html">employer</a>
                  </div>
                </form>
                </div>
              <div className='left-arrow' onClick={this.onReturn.bind(this)}></div>
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

        <DashboardFooter />
      </div>
    )
  }
}

React.render(
  <TalentLoginApp />,
  document.getElementById('talentLoginPanel')
)

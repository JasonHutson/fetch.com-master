var SessionStore = require('../stores/session-store')
var SessionActions = require('../actions/session-actions')

class AgentLoginApp extends React.Component {
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
  }

  onSessionStatusChange(state) {
    if (SessionStore.getAuthToken() !== '' && SessionStore.getAuthToken() !== null) {
      this.setState({loginFailed:false})
      window.location.href = "/agent-dashboard.html"
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
      <div className="ui cards">
        <div className="login card">
          <div className="content">
            <div className="header login">
              AGENT LOGIN
            </div>
            <div className="meta">
              <form className="ui form" id="loginForm" method="post">
                <div className="ui grid">

                  <div className={errorMessageClass}>
                    <div className="ui negative message">
                      <i className="close icon"></i>
                      <div className="header">
                        Login failed!
                      </div>
                      <p>Check your username and password</p>
                    </div>
                  </div>

                  <div className="five wide column">&nbsp;</div>
                  <div className="eight wide column pull-left field">
                    <div className="ui input">
                      <input type="text" name="username" placeholder="Username" className="name" ref="username"/>
                    </div>
                  </div>
                  <div className="five wide column">&nbsp;</div>
                  <div className="eight wide column pull-left field">
                    <div className="ui input">
                      <input type="password" name="password" placeholder="Password" className="security" ref="password"/>
                    </div>
                  </div>

                  <div className="five wide column">&nbsp;</div>
                  <div className="eight wide column center field">
                    <div className="ui black button login" onClick={this.onLoginClick.bind(this)}>LOGIN</div>
                  </div>

                  <div className="five wide column">&nbsp;</div>
                  <div className="eight wide column center field">
                    <div className="ui checkbox">
                      <input type="checkbox"/> <label>Remember me</label>
                    </div>
                    <a href="/forgot-password.html" className="forgot-password">Forgot Password?</a>
                  </div>
                </div>
              </form>
            </div>
            <div className='left-arrow' onClick={this.onReturn.bind(this)}></div>
          </div>
        </div>
      </div>
    )
  }
}

React.render(
  <AgentLoginApp />,
  document.getElementById('agentLoginPanel')
)

var Constants = require('../constants/api-constants')

// actions
import ResetPasswordActions from '../actions/reset-password-actions'

// Stores
import ResetPasswordStore from '../stores/reset-password-store'
import SessionStore from '../stores/session-store'

class RecoverPassword extends React.Component {
  constructor() {
    super()

    this.state = ResetPasswordStore.getState()
  }

  componentWillMount() {
    ResetPasswordStore.listen(this.onResetPasswordChange.bind(this))
  }

  componentWillUnmount() {
    ResetPasswordStore.unlisten(this.onResetPasswordChange.bind(this))
  }

  onResetPasswordChange(state) {
    this.setState(state)

    if (state.success) {
      window.location.href = '/password-reset.html'
    }
  }

  onClick() {
    var password = React.findDOMNode(this.refs.password).value
    var passwordConfirmation = React.findDOMNode(this.refs.passwordConfirmation).value
    var token = ResetPasswordStore.getToken()

    if (password !== passwordConfirmation) {
      this.setState({
        errorMessage: 'Passwords should match',
        success: false
      })
    } else {
      ResetPasswordActions.resetPassword(password, passwordConfirmation, token)
    }
  }

  render() {
    var token = ResetPasswordStore.getToken()

    var errorMessageClass = 'error-message hide'
    var errorMessage = this.state.errorMessage
    if (!this.state.success && errorMessage !== '') {
      try {
        var messageJson = JSON.parse(errorMessage)
        var key = Object.keys(messageJson)[0]
        errorMessage = key + ' ' + messageJson[key][0]
      } catch(SyntaxError) {
        errorMessage = this.state.errorMessage
      }
      errorMessageClass = 'error-message'
    }

    return (
      <div className="recover-password-container">
        <div className="recover-password-header">
        </div>
        <div className="ui cards">
          <div className="recover-password card">
            <div className="content">
              <div className="header">
                Recover your password
              </div>
              <div className="meta">
                <form className="ui form" id="recoverPasswordForm" method="post">
                  <input type="hidden" name="user[reset_password_token]" value={token} />
                  <input type="hidden" name="_method" value="put" />
                  <div className="ui grid form">
                    <span className="instructions">The information you need will be in the email that was sent to you.</span>
                    <span className={errorMessageClass}>{errorMessage}</span>
                    <div className="field">
                      <span className="label">ENTER A NEW PASSWORD:</span>
                      <div className="ui input">
                        <input type="password" name="user[password]" placeholder="NEW PASSWORD" className="security" ref="password"/>
                      </div>
                    </div>
                    <div className="field">
                      <span className="label">RE-ENTER YOUR NEW PASSWORD:</span>
                      <div className="ui input">
                        <input type="password" name="user[passwordConfirmation]" placeholder="CONFIRM NEW PASSWORD" className="security" ref="passwordConfirmation"/>
                      </div>
                    </div>
                    <div className="buttons">
                      <div className="ui green button proceed" onClick={this.onClick.bind(this)}>PROCEED</div>
                      <div className="return">or <a href="/">return to login</a></div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

React.render(
  <RecoverPassword />,
  document.getElementById('recoverPasswordPanel')
)

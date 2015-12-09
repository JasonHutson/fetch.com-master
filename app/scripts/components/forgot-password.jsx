// actions
import ResetPasswordActions from '../actions/reset-password-actions'

// Stores
import ResetPasswordStore from '../stores/reset-password-store'
import SessionStore from '../stores/session-store'

class ForgotPassword extends React.Component {
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
    if (state.sendEmail) {
      window.location.href = '/password-recovery-email-sent.html'
    }
  }

  onSendClick() {
    var email = React.findDOMNode(this.refs.email).value

    if (email === '') {
      this.setState({
        errorMessage: 'Please enter a valid email address'
      })
    } else {
      ResetPasswordActions.forgotPassword(email)
    }
  }

  onSubmit(e) {
    e.preventDefault()
    this.onSendClick()
  }

  onReturnClick() {
    window.location.href = "/"
  }

  render() {
    var errorMessageClass = 'error-message hide'
    var errorMessage = ''
    if (this.state.errorMessage !== '') {
      errorMessageClass = 'error-message'
      errorMessage = this.state.errorMessage
    }

    return (
      <div className="forgot-password-container">
        <div className="forgot-password-header">
        </div>
        <div className="ui cards">
          <div className="forgot-password card">
            <div className="content">
              <div className="header">
                Forgot your password?
              </div>
              <div className="meta">
                <form className="ui form" id="forgotPasswordForm" method="post" onSubmit={this.onSubmit.bind(this)}>
                  <div className="ui grid form">
                    <span className="instructions">Oops, forgot your password? No worries, it happens! Enter your email and Fetch will send instructions.</span>
                    <span className={errorMessageClass}>{errorMessage}</span>
                    <div className="field">
                      <span className="label">EMAIL ADDRESS:</span>
                      <div className="ui input">
                        <input type="text" name="username" placeholder="someone@example.com" className="email" ref="email"/>
                      </div>
                    </div>
                    <div className="note">
                      Don't have or know your registered email?
                      <a href="mailto:support@getfetched.com">Contact Support</a>
                    </div>
                    <div className="buttons">
                      <div className="ui green button send" onClick={this.onSendClick.bind(this)}>SEND</div>
                      <div className="ui green button send" onClick={this.onReturnClick.bind(this)}>LOGIN</div>
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
  <ForgotPassword />,
  document.getElementById('forgotPasswordPanel')
)

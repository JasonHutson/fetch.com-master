import ResetPasswordActions from '../actions/reset-password-actions'
import ResetPasswordStore from '../stores/reset-password-store'

class ResetPasswordHandler extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    ResetPasswordActions.setValues(this.props.query.token)

    window.location.href = '/recover-password.html'
  }

  render() {
    return <div>Redirecting...</div>
  }
}

export default ResetPasswordHandler

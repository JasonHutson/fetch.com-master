import EmailHandlerStore from '../stores/email-handler-store'
import SignupEmployerWithInvitationActions from '../actions/signup-employer-with-invitation-actions'
import SignupEmployerWithInvitationStore from '../stores/signup-employer-with-invitation-store'

class SignupEmployerWithInvitation extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    SignupEmployerWithInvitationActions.setValues(this.props.query.invitation)

    window.location.href = '/employer-signup.html'
  }

  render() {
    return <div>Redirecting...</div>
  }
}

export default SignupEmployerWithInvitation
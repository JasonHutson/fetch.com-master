import SessionActions from '../actions/session-actions'
import SessionStore from '../stores/session-store'
let sjcl = window.sjcl

class OmniAuth extends React.Component {
  constructor(props) {
    super(props)
    let auth_token = sjcl.decrypt('p4ssw0rd', this.props.query.token)
    if (auth_token !== '' && auth_token !== undefined && auth_token !== null) {
      SessionActions.loginFromOmniAuth(auth_token)
    }
  }

  componentWillMount() {
    SessionStore.listen(this.onSessionStatusChange.bind(this))
  }

  componentWillUnmount() {
    SessionStore.unlisten(this.onSessionStatusChange.bind(this))
  }

  onSessionStatusChange() {
    if (SessionStore.getAuthToken() !== '' && SessionStore.getAuthToken() !== null && SessionStore
        && SessionStore.state.loading === false) {
      window.location.href = "/talent-dashboard.html"
    }
  }

  render() {
    return (
        <div>Redirecting... </div>
    )
  }
}

export default OmniAuth
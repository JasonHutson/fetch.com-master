import EmailHandlerStore from '../stores/email-handler-store'
import EmailHandlerActions from '../actions/email-handler-actions'

class FromEmailHandler extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    let role = ''

    if (this.props.query.data) {
      let data = atob(this.props.query.data)

      var pairs = data.slice(0).split('&');

      var result = {};
      pairs.forEach(function(pair) {
          pair = pair.split('=');
          result[pair[0]] = decodeURIComponent(pair[1] || '');
      });
      EmailHandlerActions.setValues(result.user, result.role,
                                    result.screen, result.position_id,
                                    result.match_id, result.other_user_id,
                                    result.talent_id)
      role = result.role
    }
    else {
      EmailHandlerActions.setValues(this.props.query.user, this.props.query.role,
                                    this.props.query.screen, this.props.query.position_id,
                                    this.props.query.match_id, 0)
      role = this.props.query.role
    }

    if (role === 'talent') {
      window.location.href = '/talent-login.html'
    }
    else if (role === 'employer') {
      window.location.href = '/employer-login.html'
    }
  }

  render() {
    return <div>Redirecting...</div>
  }
}

export default FromEmailHandler

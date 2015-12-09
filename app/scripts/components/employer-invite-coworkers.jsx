import EmployersActions from '../actions/employers-actions'

import EmployersStore from '../stores/employers-store'
import SessionStore from '../stores/session-store'

class EmployerInviteCoworkers extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      status: '',
      disableButton: false
    }
  }

  componentWillMount() {
    EmployersStore.listen(this.onEmployersStoreChange.bind(this))
  }

  componentWillUnmount() {
    EmployersStore.unlisten(this.onEmployersStoreChange.bind(this))
  }

  onEmployersStoreChange(state) {
    if (state.sendingEmails === false) {
      this.setState({status: 'Emails sent'})
    }
  }

  onSendEmailsClick() {
    if (this.state.disableButton === false) {
      let emails = []

      let email1 = React.findDOMNode(this.refs.email1).value
      let email2 = React.findDOMNode(this.refs.email2).value
      let email3 = React.findDOMNode(this.refs.email3).value

      if (email1 !== '') {
        emails.push(email1)
      }
      if (email2 !== '') {
        emails.push(email2)
      }
      if (email3 !== '') {
        emails.push(email3)
      }

      let employerId = SessionStore.getEmployerContactId()

      EmployersActions.inviteCoworkers(employerId, emails)
      this.setState({
        status: 'Sending emails',
        disableButton: true
      })      
    }
  }

  render() {
    let buttonClassName = "ui button green"

    if (this.state.disableButton) {
      buttonClassName = buttonClassName.concat(" disabled")
    }

    return (
      <div className="employer-invite-coworkers">
        <div className="ui grid header">
          <div className="twelve wide column">
            <h1 className="title">INVITE <span className="accent">COWORKERS</span></h1>
          </div>
        </div>
        <div className="ui grid content">
          <div className="ui list sixteen wide column">
            <div className="item">
              <label>Email: </label>
              <div className="ui input">
                <input type="text" ref="email1" />
              </div>
            </div>
            <div className="item">
              <label>Email: </label>
              <div className="ui input">
                <input type="text" ref="email2" />
              </div>
            </div>
            <div className="item">
              <label>Email: </label>
              <div className="ui input">
                <input type="text" ref="email3" />
              </div>
            </div>
          </div>
          <div className="status sixteen wide column">
            {this.state.status}
          </div>
          <div className="buttons sixteen wide column">
            <button className={buttonClassName} onClick={this.onSendEmailsClick.bind(this)}>SEND EMAILS</button>
          </div>
        </div>
      </div>
    )
  }
}

export default EmployerInviteCoworkers
import alt from '../dispatchers/alt'

class SignupEmployerWithInvitationActions {
  setValues(invitation) {
    try {
      let decodedInvitation = atob(invitation)
      let index = decodedInvitation.indexOf('=')
      let accountIdEncoded = decodedInvitation.substring(index+1)
      let accountId = atob(accountIdEncoded)
      setTimeout(function() {
        this.dispatch(accountId)
      }.bind(this), 0)      
    }
    catch(err) {
      this.dispatch(0)
    }
  }

  clearValues() {
    this.dispatch()
  }
}

export default alt.createActions(SignupEmployerWithInvitationActions)
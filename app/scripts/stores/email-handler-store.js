import alt from '../dispatchers/alt'
import EmailHandlerActions from '../actions/email-handler-actions'

class EmailHandlerStore {
  constructor() {
    this.user = ''
    this.role = ''
    this.screen = ''
    this.posiitonId = ''
    this.matchId = ''
    this.otherUserId = ''
    this.talentId = ''
    this.bindListeners({
      onSetValues: EmailHandlerActions.SET_VALUES,
      onClearValues: EmailHandlerActions.CLEAR_VALUES
    })

    this.exportPublicMethods({
      getUser: this.getUser,
      getRole: this.getRole,
      getScreen: this.getScreen,
      getPositionId: this.getPositionId,
      getMatchId: this.getMatchId,
      getOtherUserId: this.getOtherUserId,
      getTalentId: this.getTalentId
    })
  }

  getUser() {
    return sessionStorage.getItem('user')
  }

  getRole() {
    return sessionStorage.getItem('role')
  }

  getScreen() {
    return sessionStorage.getItem('screen')
  }

  getPositionId() {
    return sessionStorage.getItem('positionId')
  }

  getMatchId() {
    return sessionStorage.getItem('matchId')
  }

  getOtherUserId() {
    return sessionStorage.getItem('otherUserId')
  }

  getTalentId() {
    return sessionStorage.getItem('talentId')
  }

  onSetValues(object) {
    this.user = object.user
    this.role = object.role
    this.screen = object.screen
    this.positionId = object.positionId
    this.matchId = object.matchId
    this.otherUserId = object.otherUserId
    this.talentId = object.talentId
    sessionStorage.setItem('user', this.user)
    sessionStorage.setItem('role', this.role)
    sessionStorage.setItem('screen', this.screen)
    sessionStorage.setItem('positionId', this.positionId)
    sessionStorage.setItem('matchId', this.matchId)
    sessionStorage.setItem('otherUserId', this.otherUserId)
    sessionStorage.setItem('talentId', this.talentId)
  }

  onClearValues() {
    sessionStorage.removeItem('user')
    sessionStorage.removeItem('role')
    sessionStorage.removeItem('screen')
    sessionStorage.removeItem('positionId')
    sessionStorage.removeItem('matchId')
    sessionStorage.removeItem('otherUserId')
    sessionStorage.removeItem('talentId')
    this.user = ''
    this.role = ''
    this.screen = ''
    this.positionId = ''
    this.matchId = ''
    this.otherUserId = ''
    this.talentId = ''
  }
}

export default alt.createStore(EmailHandlerStore)

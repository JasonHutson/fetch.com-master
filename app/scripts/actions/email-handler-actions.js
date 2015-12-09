import alt from '../dispatchers/alt'

class EmailHandlerActions {
  setValues(user, role, screen, positionId, matchId, otherUserId, talentId) {
    let params = {
      user: user, role: role, screen: screen, positionId: positionId, matchId: matchId, otherUserId: otherUserId, talentId: talentId
    }
    this.dispatch(params)
  }

  clearValues() {
    this.dispatch()
  }
}

export default alt.createActions(EmailHandlerActions)

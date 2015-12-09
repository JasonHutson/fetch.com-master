import alt from '../dispatchers/alt';
import BaseActions from './base-actions';
var Constants = require("../constants/api-constants");

var groupMessagesByUser = (messages, forUserType) => {
  messages = messages.data
  let users = []

  let getTypeName = (type) => {
    switch(type) {
      case 'talent_profile':
        return 'Talent'
        break
      case 'employer_contact':
        return 'Employer'
        break
    }
    return type
  }

  let findUserByIdAndType = (objectId, type) => {
    return $.grep(users, (user) => {
      return user.id === objectId && getTypeName(user.type) === getTypeName(type)
    })[0]
  }

  let getUserByIdAndType = (objectId, name, type, photo_url, userId) => {
    let user = findUserByIdAndType(objectId, type)
    if(user) {
      return user
    } else {
      user = {
        id: objectId,
        name: name,
        type: getTypeName(type),
        photo_url: photo_url,
        userId: userId,
        messages: []
      }
      users = users.concat(user)
      return user
    }
  }

  messages.forEach(message => {
    let objectId = 0
    let type = ''
    let name = ''
    let photo_url = ''
    let userId = 0
    if (message.attributes.from.type !== forUserType) {
      objectId = message.attributes.from.id
      name = message.attributes.from.name
      type = message.attributes.from.type
      userId = message.attributes.from.id
      photo_url = message.attributes.from.avatar !== '' ? message.attributes.from.avatar : '../images/user-placeholder.jpg'
    }
    if (message.attributes.to.type !== forUserType) {
      objectId = message.attributes.to.id
      name = message.attributes.to.name
      type = message.attributes.to.type
      userId = message.attributes.to.id
      photo_url = message.attributes.to.avatar !== '' ? message.attributes.to.avatar : '../images/user-placeholder.jpg'
    }
    let user = getUserByIdAndType(objectId, name, type, photo_url, userId)
    user.messages = user.messages.concat({
      id: message.id,
      body: message.attributes.body,
      created_at: message.attributes.created_at,
      from: {
        name: message.attributes.from.name,
        type: message.attributes.from.type,
        avatar_url: message.attributes.from.avatar
      },
      to: {
        name: message.attributes.to.name,
        type: message.attributes.to.type,
        avatar_url: message.attributes.to.avatar
      }
    })
  })
  return {users:users, messageCount: messages.length}
}

class MessagesActions extends BaseActions {
  fetchByCurrentUser() {
    let url = Constants.API_ENDPOINTS.MESSAGES_INDEX
    $.ajax({
      url: url,
      type: 'get',
      dataType: 'json',
      headers: super.headersWithToken(),
      success: (data) => {
        this.actions.fetchByCurrentUserSuccess(groupMessagesByUser(data, 'agent'))
      }
    })
    this.dispatch();
  }

  fetch(positionId) {
    let url = Constants.API_ENDPOINTS.MESSAGES_INDEX
    $.ajax({
      url: url,
      type: 'get',
      dataType: 'json',
      headers: super.headersWithToken(),
      success: (data) => {
        this.actions.updatePositions(groupMessagesByPosition(data))
      }
    })
    this.dispatch();
  }

  fetchForPositionId(positionId) {
    let url = Constants.API_ENDPOINTS.MESSAGES_FOR_POSITION.replace(':position_id', positionId)
    $.ajax({
      url: url,
      type: 'get',
      dataType: 'json',
      headers: super.headersWithToken(),
      success: (data) => {
        this.actions.fetchForPositionIdSuccess(data)
      }
    })
    this.dispatch();
  }

  fetchForPositionIdWithAnotherUser(positionId, anotherUserId, anotherUserType) {
    let url = Constants.API_ENDPOINTS.MESSAGES_FOR_POSITION_WITH_USER
              .replace(':position_id', positionId).replace(':with_user_id', anotherUserId)
    $.ajax({
      url: url,
      type: 'get',
      dataType: 'json',
      headers: super.headersWithToken(),
      data: {
        other_user_type: anotherUserType
      },
      success: (data) => {
        this.actions.fetchForPositionIdSuccess(data)
      }
    })
    this.dispatch()
  }

  fetchWithAnotherUser(anotherUserId, anotherUserType) {
    let url = Constants.API_ENDPOINTS.MESSAGES_WITH_USER
              .replace(':with_user_id', anotherUserId)
    $.ajax({
      url: url,
      type: 'get',
      dataType: 'json',
      headers: super.headersWithToken(),
      data: {
        other_user_type: anotherUserType
      },
      success: (data) => {
        this.actions.fetchWithAnotherUserSuccess(data)
      }
    })
    this.dispatch()
  }

  sendMessage(positionId, text, toUserId) {
    let url = Constants.API_ENDPOINTS.MESSAGES_NEW
    $.ajax({
      url: url,
      type: 'post',
      dataType: 'json',
      headers: super.headersWithToken(),
      data: JSON.stringify({
        message: {
          position_id: positionId,
          body: text,
          to_user_id: toUserId
        }
      }),
      success: (data) => {
        this.actions.fetchForPositionIdWithAnotherUser(positionId, toUserId)
      }
    })
    this.dispatch()
  }

  replyMessageByAgent(text, toUserId) {
    let url = Constants.API_ENDPOINTS.MESSAGES_NEW
    $.ajax({
      url: url,
      type: 'post',
      dataType: 'json',
      headers: super.headersWithToken(),
      data: JSON.stringify({
        message: {
          body: text,
          to_user_id: toUserId
        }
      }),
      success: (data) => {
        this.actions.fetchByCurrentUser()
      }
    })
    this.dispatch()
  }

  replyMessageToAgent(text, toUserId) {
    let url = Constants.API_ENDPOINTS.MESSAGES_NEW
    $.ajax({
      url: url,
      type: 'post',
      dataType: 'json',
      headers: super.headersWithToken(),
      data: JSON.stringify({
        message: {
          body: text,
          to_user_id: toUserId
        },
        to_agent: 1
      }),
      success: (data) => {
        this.actions.fetchWithAnotherUser(toUserId, 'AdminUser')
      }
    })
    this.dispatch()
  }

  fetchByCurrentUserSuccess(data) {
    this.dispatch(data)
  }

	updatePositions(positions) {
    this.dispatch(positions)
  }

  fetchForPositionIdSuccess(messages) {
    this.dispatch(messages)
  }

  fetchWithAnotherUserSuccess(messages) {
    this.dispatch(messages)
  }

  sendMessageSuccess(data) {
    this.dispatch(data)
  }
}

export default alt.createActions(MessagesActions);

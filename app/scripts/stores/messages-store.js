import alt from '../dispatchers/alt'
import MessagesActions from '../actions/messages-actions'

class MessagesStore {
	constructor() {
		this.loading = false
    this.positions = []
		this.users = []
    this.disableSendButton = false
    this.messageSending = false
    this.messageSent = false
		this.messagesLoaded = 0
    this.bindListeners({
      fetchByCurrentUser: MessagesActions.FETCH_BY_CURRENT_USER,
      fetchByCurrentUserSuccess: MessagesActions.FETCH_BY_CURRENT_USER_SUCCESS,
			fetchWithAnotherUser: MessagesActions.FETCH_WITH_ANOTHER_USER,
			fetchWithAnotherUserSuccess: MessagesActions.FETCH_WITH_ANOTHER_USER_SUCCESS,
      handleUpdatePositions: MessagesActions.UPDATE_POSITIONS,
      handleMessageSending: MessagesActions.sendMessage,
      handleMessageSent: MessagesActions.sendMessageSuccess,
      fetchForPositionId: MessagesActions.fetchForPositionIdSuccess,
      fetchForPositionIdWithAnotherUser: MessagesActions.fetchForPositionIdWithAnotherUser
    });
  }

	fetchByCurrentUser() {
		this.users = []
		this.loading = true
		this.messagesLoaded = 0
	}

	fetchByCurrentUserSuccess(data) {
		this.loading = false
		this.users = data.users
		this.messagesLoaded = data.messageCount
	}

	fetchWithAnotherUser() {
		this.loading = true
		this.messages = []
	}

	fetchWithAnotherUserSuccess(messages) {
		this.loading = false
		this.messages = messages.data
	}

  handleUpdatePositions(positions) {
    this.positions = positions
  }

  handleMessageSending() {
    this.messageSent = false
    this.messageSending = true
    this.loading = true
  }

  fetchForPositionIdWithAnotherUser() {
    if (this.messageSending) {
      this.messageSent = true
      this.messageSending = false
    }
    this.loading = true
  }

  handleMessageSent(result) {
    this.messageSent = false
  }

  fetchForPositionId(messages) {
    this.loading = false
    this.messages = messages.data;
    this.messageSent = false
    this.messageSending = false
  }
}

module.exports = alt.createStore(MessagesStore, 'MessagesStore');

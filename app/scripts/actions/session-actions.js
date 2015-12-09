import alt from '../dispatchers/alt'
var Constants = require('../constants/api-constants')

class SessionActions {
  login(email, password) {
    let lowercaseEmail = (email !== undefined && email !== null && email.length > 0) ? email.toLowerCase() : ''
    $.ajax({
      url: Constants.API_ENDPOINTS.LOGIN,
      type: 'post',
      dataType: 'json',
      data: JSON.stringify({
        session: {
          email: lowercaseEmail,
          password: password
        }
      }),
      headers: {
        "Accept":"application/vnd.fetchapi.v1+json",
        "Content-Type":"application/json"
      },
      success: (data) => {
        this.actions.loginSuccess(data);
      },
      error: (xhr, ajaxOptions, thrownError) => {
        this.actions.loginFailed()
      }
    });
    this.dispatch();
  }

  logout(authToken) {
    $.ajax({
      url: Constants.API_ENDPOINTS.LOGOUT.replace(':id', authToken),
      type: 'post',
      dataType: 'json',
      method: 'delete',
      data: JSON.stringify({"_method":"delete"}),
      headers: {
        "Accept":"application/vnd.fetchapi.v1+json",
        "Content-Type":"application/json",
        "Authorization": "Token token=" + authToken
      },
      success: (data) => {
        this.actions.logoutSuccess(data)
      }
    })
    this.dispatch()
  }

  loginSuccess(loginData) {
    this.dispatch(loginData);
  }

  logoutSuccess(result) {
    this.dispatch(result)
  }

  loginFailed() {
    this.dispatch()
  }

  loginFromOmniAuth(auth_token) {
    $.ajax({
      url: Constants.API_ENDPOINTS.CURRENT_USER,
      type: 'get',
      dataType: 'json',
      headers: {
        "Accept":"application/vnd.fetchapi.v1+json",
        "Content-Type":"application/json",
        "Authorization": "Token token=" + auth_token
      },
      success: (data) => {
        console.log(data);
        this.actions.loginSuccess(data);
      },
      error: (xhr, ajaxOptions, thrownError) => {
        console.log(xhr.status);
        console.log(thrownError);
      }
    });
    this.dispatch();
  }
}

export default alt.createActions(SessionActions)

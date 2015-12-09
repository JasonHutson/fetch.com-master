var Constants = require("../constants/api-constants");
var SessionStore = require("../stores/session-store");

class BaseActions {
  headersWithoutAuth() {
    return {
      "Accept":"application/vnd.fetchapi.v1+json",
      "Content-Type":"application/json"
    };
  }

  headersWithToken() {
    let authToken = SessionStore.getAuthToken();
    return {
      "Accept":"application/vnd.fetchapi.v1+json",
      "Content-Type":"application/json",
      "Authorization": "Token token=" + authToken
    };
  }
}

export default BaseActions;
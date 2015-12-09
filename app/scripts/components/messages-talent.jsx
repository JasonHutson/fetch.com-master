var headers_without_auth = {
  "Accept":"application/vnd.fetchapi.v1+json", 
  "Content-Type":"application/json"
};
var headers_with_token = {
  "Accept":"application/vnd.fetchapi.v1+json", 
  "Content-Type":"application/json"  
};
var BASE_URL = 'http://localhost:3000';

class TalentButton extends React.Component {
  render() {
    return (<button onClick={this.props.onClick} className="ui button">4 - Create Talent User</button>);
  }
}

class ViewPositionsButton extends React.Component {
  render() {
    return (<button onClick={this.props.onClick} className="ui button">5 - View positions</button>);
  }
}

class SendMessageButton extends React.Component {
  render() {
    return (<button onClick={this.props.onClick} className="ui button">6 - Send message to last position</button>);
  }
}

class TalentMessagesList extends React.Component {
  render() {
    let items = this.props.items;

    return (
      <div>
        <h3>Messages</h3>
        <ul>{items.map(element => <li>{element}</li>)}</ul>
      </div>
    );
  }
}

class TalentApp extends React.Component {
  constructor(props) {
    super(props);
    this.userId = 0;
    this.state = {items: []};
  }

  handleTalentButtonClick() {
    var _this = this;

    $.ajax({
      type: 'post', dataType: 'json', url: BASE_URL + '/users', headers: headers_without_auth,
      data: JSON.stringify({
        user: {email:Math.random().toString(36).substr(2, 12)+"@example.com",password:"password123?",password_confirmation:"password123?",role:"talent"}
      }),
      success: function(data) {
        headers_with_token.Authorization = 'Token token=' + data.data.attributes.auth_token;
        _this.userId = data.data.id;
        let userEmail = data.data.attributes.email;
        let userText = 'Talent User was created with id: ' + _this.userId + ' and email: ' + userEmail;

        var updatedItems = _this.state.items.concat([userText]);
        _this.setState({items: updatedItems});

        $.ajax({
          type: 'post', dataType: 'json', url: BASE_URL + '/talent_profiles', headers: headers_with_token,
          data: JSON.stringify({
            talent_profile: {'name':'Talent name','time_zone':'CST'}
          }),
          success: function(data) {
            let talentId = data.data.id;
            let talentName = data.data.attributes.name;
            
            let talentText = 'Talent profile was created with id: ' + talentId + ' and name: ' + talentName;
            var updatedItems = _this.state.items.concat([talentText]);
            _this.setState({items: updatedItems});
          }
        });
      }
    });
  }

  handleViewPositionsButtonClick() {
    var _this = this;

    $.ajax({
      type: 'get', dataType: 'json', url: BASE_URL + '/positions', headers: headers_with_token,
      success: function(data) {
        let positions = [];

        if(data.data.length === 0) {
          let updatedItems = _this.state.items.concat(['No positions found']);
          _this.setState({items: updatedItems});
        }
        console.log(data);
        let updatedItems = [];
        $.each(data.data, function(index, value) {
          _this.positionId = value.id;
          let jobTitle = value.attributes.job_title;
          let positionText = 'Position id: ' + _this.positionId + ', job title: ' + jobTitle;
          // positions.push('Position id: ' + _this.positionId + ', job title: ' + jobTitle);
          updatedItems = _this.state.items.concat([positionText]);
          _this.setState({items: updatedItems});
        });
      }
    });
  }

  handleSendMessageButtonClick() {
    var _this = this;

    $.ajax({
      type: 'post', dataType: 'json', url: BASE_URL + '/messages', headers: headers_with_token,
      data: JSON.stringify({
        'message': {
          'body': 'This is the body of the message',
          'position_id': _this.positionId
        }
      }),
      success: function(data) {
        let messageId = data.data.id;
        let messageText = 'Message with id: ' + messageId + ' sent: ' + data.data.attributes.body;
        let updatedItems = _this.state.items.concat([messageText]);
        _this.setState({items: updatedItems});
      }
    });
  }

  render() {
    return (
      <div>
        <h4>Talent User</h4>
        <ul>
          <li><TalentButton onClick={this.handleTalentButtonClick.bind(this)} /></li>
          <li><ViewPositionsButton onClick={this.handleViewPositionsButtonClick.bind(this)} /></li>
          <li><SendMessageButton onClick={this.handleSendMessageButtonClick.bind(this)} /></li>
        </ul>
        <TalentMessagesList items={this.state.items} />
      </div>
    );
  }
}

React.render(
  <TalentApp />,
  document.getElementById('talentSection')
);
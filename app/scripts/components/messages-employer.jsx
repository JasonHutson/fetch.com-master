var headers_without_auth = {
  "Accept":"application/vnd.fetchapi.v1+json", 
  "Content-Type":"application/json"
};
var headers_with_token = {
  "Accept":"application/vnd.fetchapi.v1+json", 
  "Content-Type":"application/json"  
};
var BASE_URL = 'http://localhost:3000';

class EmployerButton extends React.Component {
  render() {
    return (<button onClick={this.props.onClick} className="ui button">1 - Create Employer Data</button>);
  }
}

class PositionButton extends React.Component {
  render() {
    return (<button onClick={this.props.onClick} className="ui button">2 - Create a position</button>);
  }
}

class EmployerMessagesButton extends React.Component {
  render() {
    return (<button onClick={this.props.onClick} className="ui button">3, 7 - View messages</button>);
  }
}

class EmployerMessagesList extends React.Component {
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

class EmployerApp extends React.Component {
  constructor(props) {
    super(props);
    this.userId = 0;
    this.accountId = 0;
    this.employerContactId = 0;
    this.positionId = 0;
    this.state = {items: []};
  }

  handleEmployerButtonClick() {
    var _this = this;

    $.ajax({
      type: 'post', dataType: 'json', url: BASE_URL + '/users', headers: headers_without_auth,
      data: JSON.stringify({
        user: {email:Math.random().toString(36).substr(2, 12)+"@email.com",password:"password123?",password_confirmation:"password123?",role:"account_admin"}
      }),
      success: function(data) {
        headers_with_token.Authorization = 'Token token=' + data.data.attributes.auth_token;
        _this.userId = data.data.id;
        let userEmail = data.data.attributes.email;
        let userText = 'Employer User was created with id: ' + _this.userId + ' and email: ' + userEmail;

        var updatedItems = _this.state.items.concat([userText]);
        _this.setState({items: updatedItems});

        $.ajax({
          type: 'post', dataType: 'json', url: BASE_URL + '/accounts', headers: headers_with_token,
          data: JSON.stringify({
            account: {'company_name':'Isotope11'}
          }),
          success: function(data) {
            _this.accountId = data.data.id;
            let companyName = data.data.attributes.company_name;
            
            let accountText = 'Account was created with id: ' + _this.accountId + ' and company name: ' + companyName;
            var updatedItems = _this.state.items.concat([accountText]);
            _this.setState({items: updatedItems});
 
            $.ajax({
              type: 'post', dataType: 'json', url: BASE_URL + '/employer_contacts', headers: headers_with_token,
              data: JSON.stringify({
                employer_contact: {'name':'Employer Contact Name','account_id':_this.accountId}
              }),
              success: function(data) {
                _this.employerContactId = data.data.id;
                let employerContactName = data.data.attributes.name;

                let employerText = 'Employer was created with id: ' + _this.employerContactId + ' and name: ' + employerContactName;
                var updatedItems = _this.state.items.concat([employerText]);
                _this.setState({items: updatedItems});
              }
            });
          }
        })
      }
    });
  }

  handlePositionClick() {
    var _this = this;

    let url = '/employer_contacts/' + this.employerContactId + '/positions';

    $.ajax({
      type: 'post', dataType: 'json', url: BASE_URL + url, headers: headers_with_token,
      data: JSON.stringify({
        position: {
          'job_title': 'Job title',
          'employment_type_id': 1
        }
      }),
      success: function(data) {
        _this.positionId = data.data.id;
        let positionTitle = data.data.attributes.job_title;
        let positionText = 'Position was created with id: ' + _this.positionId + ' and job title: ' + positionTitle;

        var updatedItems = _this.state.items.concat([positionText]);
        _this.setState({items: updatedItems});
      }
    });
  }

  handleMessagesClick() {
    var _this = this;

    let url = '/messages/for_position/' + this.positionId;

    $.ajax({
      type: 'get', dataType: 'json', url: BASE_URL + url, headers: headers_with_token,
      success: function(data) {
        let messages = [];

        if(data.data.length === 0) {
          var updatedItems = _this.state.items.concat(['No messages received for this position']);
          _this.setState({items: updatedItems});
        }
        console.log(data);
        $.each(data.data, function(index, value) {
          let id = value.id;
          let messageBody = value.attributes.body;
          let messageText = 'Message with id ' + id + ' received: ' + messageBody;
          updatedItems = _this.state.items.concat([messageText]);
          _this.setState({items: updatedItems});
        });
      }
    });
  }

  render() {
    return (
      <div>
        <h4>Employer User</h4>
        <ul>
          <li><EmployerButton onClick={this.handleEmployerButtonClick.bind(this)} /></li>
          <li><PositionButton onClick={this.handlePositionClick.bind(this)} /></li>
          <li><EmployerMessagesButton onClick={this.handleMessagesClick.bind(this)} /></li>
        </ul>
        <EmployerMessagesList items={this.state.items} />
      </div>
    );
  }
}

React.render(
  <EmployerApp />,
  document.getElementById('employerSection')
);

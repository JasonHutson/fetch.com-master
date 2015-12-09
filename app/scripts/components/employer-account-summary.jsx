
class EmployerAccountSummary extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let account = this.props.item

    if (account !== undefined && account !== null && account.data !== undefined) {
      return (
        <div className="account-info">
          <h3 className="ui aligned center title">{account.data.attributes.company_name}</h3>
          <div className="image-container">
            <img className="ui image" src={account.data.attributes.logo_url}></img>
          </div>
        </div>
      )
    }
    else {
      return (
        <div></div>
      )
    }

  }
}

export default EmployerAccountSummary;

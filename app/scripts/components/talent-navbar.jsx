class TalentNavbar extends React.Component {
  constructor(props) {
    super(props);
  }

  handleClick(index, e) {
    e.preventDefault();
    this.props.handleNavClick(index);
  }

  render() {
    return (
      <nav className="ui fixed menu green inverted navbar">
        <img className="logo"src="../images/get-fetched-circle.png"></img>
        <div className="nav-menu">
          {this.props.items.map((i, index) => {
            let style = 'item '
            style = style.concat(i.toLowerCase())
            if (this.props.selectedItem === i) {
              style = style.concat(' active black');
            }
            return <a href="" key={i} className={style} onClick={this.handleClick.bind(this, index)}><span className="text">{i}</span></a>;
          }.bind(this))}
        </div>

        <div className="ui button black right floated logout" onClick={this.props.onLogoutClick}>LOGOUT</div>
        <div className="logo fetch mobile"></div>
      </nav>
    );
  }
}

export default TalentNavbar;

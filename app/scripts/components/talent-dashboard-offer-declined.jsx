const BUTTON_DOESNT_MATCH = 1
const BUTTON_BETTER_OFFER = 2
const BUTTON_OTHER = 3

class TalentDashboardOfferDeclined extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedButton: BUTTON_OTHER,
      disableTextarea: false
    }

    this.buttons = [
      {
        id: BUTTON_DOESNT_MATCH,
        reason: "info doesn't match",
        text: "INFO DOESN'T MATCH WHAT WAS DISCUSSED"
      },
      {
        id: BUTTON_BETTER_OFFER,
        reason: "better offer",
        text: "YOU RECEIVED A BETTER OFFER"
      },
      {
        id: BUTTON_OTHER,
        reason: "other",
        text: "OTHER",
        extraClass: "other"
      }
    ]
  }

  onButtonClick(id) {
    let disableTextarea = false
    if (id !== BUTTON_OTHER) {
      disableTextarea = true
    }
    this.setState({
      selectedButton: id,
      disableTextarea: disableTextarea
    })
  }

  onSendReasonsClick() {
    let reason = ''
    if (this.state.selectedButton !== BUTTON_OTHER) {
      reason = this.buttons[this.state.selectedButton-1].reason
    }
    else {
      reason = React.findDOMNode(this.refs.reasons).value
    }
    this.props.onSubmitReasons(this.props.offer, reason)
  }

  render() {
    return (
      <div className="offer-declined-panel">
        <div className="ui grid header">
          <div className="twelve wide column">
            <div className="title">OFFER <span className="accent">DECLINED</span></div>
            <div className="position-name">{this.props.offer.attributes.position_title} WITH {this.props.offer.attributes.company_name}</div>
          </div>
        </div>

        <div className="content ui grid">
          <div className="sixteen wide column information">
            CHOOSE THE REASONS FOR DECLINING BELOW
          </div>

          <div className="sixteen wide column inner-content ui grid centered aligned">

            {this.buttons.map(button => {
              let selected = this.state.selectedButton === button.id
              return (
                <OfferDeclinedButton reason={button.reason} id={button.id} key={button.id}
                                     selected={selected}
                                     extraClass={button.extraClass}
                                     onClick={this.onButtonClick.bind(this)}>
                  {button.text}
                </OfferDeclinedButton>
              )
            })}

            <textarea className="ui input" ref="reasons"
                      disabled={this.state.disableTextarea}
                      placeholder="TYPE REASONS HERE...">
            </textarea>

            <div className="ui button green submit right floated" onClick={this.onSendReasonsClick.bind(this)}>SUBMIT</div>
          </div>

        </div>
      </div>
    )
  }
}

class OfferDeclinedButton extends React.Component {
  onClick() {
    this.props.onClick(this.props.id)
  }

  render() {
    let className = "ui button " + this.props.extraClass
    if (this.props.selected === true) {
      className = className.concat(" black")
    }
    else {
      className = className.concat(" green")
    }

    return (
      <div className={className} data-reason={this.props.reason} onClick={this.onClick.bind(this)}>
        {this.props.children}
      </div>
    )
  }
}

export default TalentDashboardOfferDeclined

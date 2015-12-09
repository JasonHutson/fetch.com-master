// Components
import DropDown from './drop-down'
import MessagePopup from './message-popup'
import Constants from '../constants/api-constants'

// Actions
import OffersActions from '../actions/offers-actions'
import FeeStructureActions from '../actions/fee-structure-actions'

// Stores
import OffersStore from '../stores/offers-store'
import SessionStore from '../stores/session-store'
import FeeStructureStore from '../stores/fee-structure-store'

/*
* Function to format number to currency.
* Parameters:
*     c: decimal places
*     d: decimal separator
*     t: thousands separator
* Return value:
*     Currency formatted string
* URL: http://stackoverflow.com/questions/149055/how-can-i-format-numbers-as-money-in-javascript
*/
Number.prototype.formatMoney = function(c, d, t){
var n = this,
    c = isNaN(c = Math.abs(c)) ? 2 : c,
    d = d == undefined ? "." : d,
    t = t == undefined ? "," : t,
    s = n < 0 ? "-" : "",
    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
    j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
 };

class EmployerOfferForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = OffersStore.getState()
  }

  componentWillMount() {
    OffersStore.listen(this.onOffersChange.bind(this))
    FeeStructureStore.listen(this.onFeeStructureChange.bind(this))
  }

  componentWillUnmount() {
    OffersStore.unlisten(this.onOffersChange.bind(this))
    FeeStructureStore.unlisten(this.onFeeStructureChange.bind(this))
  }

  onEmploymentTypeChange(newValue, text) {
    this.setState({employmentType: text})
  }

  onFeeStructureChange(state) {
    let feeStructure = {
      monthlySubscription: state.monthlySubscription,
      upfrontFee: state.upfrontFee
    }
    this.setState({feeStructure: feeStructure})
  }

  onOffersChange(state) {
    if (state.offerCreated === true) {
      this.setState({showConfirmationPopup: true})
    }
  }

  onSalaryBlur(event) {
    let salary = event.target.value.replace(/[^0-9.-]+/g, '')
    if (salary.trim().length > 0) {
      FeeStructureActions.fetch(salary)
    } else {
      let feeStructure = {
        monthlySubscription: 0,
        upfrontFee: 0
      }
      this.setState({feeStructure: feeStructure})
    }
  }

  getFieldValues() {
    let offer = {}
    offer['supervisor'] = React.findDOMNode(this.refs.supervisor).value
    offer['salary'] = React.findDOMNode(this.refs.salary).value
    offer['jobType'] = this.state.employmentType
    offer['details'] = React.findDOMNode(this.refs.details).value
    offer['disclaimer'] = React.findDOMNode(this.refs.disclaimer).value

    offer['employerContactId'] = SessionStore.getEmployerContactId()
    offer['talentProfileMatchId'] = this.props.match.id
    offer['companyName'] = this.props.account.data.attributes.company_name
    offer['positionTitle'] = this.props.position.attributes.job_title
    offer['hiringManagersName'] = this.props.position.attributes.employer_contact_name

    let dateMonth = React.findDOMNode(this.refs.dateMonth).value
    let dateDay = React.findDOMNode(this.refs.dateDay).value
    let dateYear = React.findDOMNode(this.refs.dateYear).value
    offer['startDate'] = moment(dateMonth+'-'+dateDay+'-'+dateYear, "MM-DD-YYYY").toDate()

    this.setState({offer: offer})
  }

  onAcceptAgreementChange(event) {
    this.setState({canSendOffer: event.target.checked})
  }

  confirmationPopupClose() {
    this.setState({showConfirmationPopup: false})
    this.props.onOfferSent()
  }

  onSendOfferClick(event) {
    this.getFieldValues()
    this.setState({canSendOffer: false})
    setTimeout(function() {
      OffersActions.makeOffer(this.state.offer)
    }.bind(this), 0)
  }

  render() {
    let position = this.props.position
    let match = this.props.match

    let agreementPdfUrl = Constants.FULL_AGREEMENT_PDF_URL

    let disableSubmitButton = (this.state.canSendOffer === true) ? '' : 'disabled'

    let monthlySubscription = 0
    if (this.state.feeStructure.monthlySubscription !== undefined) {
      monthlySubscription = this.state.feeStructure.monthlySubscription.formatMoney(2, '.', ',')
    }

    let upfrontFee = 0
    if (this.state.feeStructure.upfrontFee !== undefined) {
      upfrontFee = this.state.feeStructure.upfrontFee.formatMoney(2, '.', ',')
    }

    let offerSentClass = "offer-sent-message"
    if (this.state.showConfirmationPopup) {
      offerSentClass = offerSentClass.concat(" visible")
    }

    return (
      <div className="offer-form">
        <div className="header ui grid">
          <div className="twelve wide column">
            <div className="title">MAKE AN <span className="accent">OFFER</span> <span className="position">{position.attributes.job_title}</span></div>
          </div>
          <div className="four wide column buttons">
            <button className="ui button green right floated" onClick={this.props.onBackButtonClick}>BACK TO JOBS</button>
          </div>
        </div>

        <div className="content ui grid">

          <div className={offerSentClass}>
            <div className="content">
              <p>YOUR OFFER HAS BEEN SENT SUCCESSFULLY</p>
              <i className="icon remove" onClick={this.confirmationPopupClose.bind(this)} />
            </div>
          </div>

          <div className="five wide column field">
            <label>Job Title:</label>
            <div className="value">{position.attributes.job_title}</div>
          </div>
          <div className="five wide column field">
            <label>Start Date:</label>
              <div className="value">
                <div className="ui input date">
                  <input type="text" className="month" ref="dateMonth" /> <span className="date-separator">/</span> <input type="text" className="day" ref="dateDay" /> <span className="date-separator">/</span> <input type="text" className="year" ref="dateYear" />
                </div>
              </div>
          </div>
          <div className="six wide column field">
            <label>Supervisor:</label>
              <div className="value">
                <div className="ui input full-width">
                  <input type="text" ref="supervisor" />
                </div>
              </div>
          </div>

          <div className="five wide column field">
            <label>Salary / Pay Rate:</label>
            <div className="value">
              <div className="ui input">
                <input type="text" ref="salary" onBlur={this.onSalaryBlur.bind(this)} />
              </div>
            </div>
          </div>
          <div className="five wide column field">
            <label>Job Type:</label>
            <div className="value">
              <div className="ui input" >
                <DropDown name="employmentType"
                          defaultText="Select an option"
                          items={this.props.employmentTypes}
                          onChange={this.onEmploymentTypeChange.bind(this)} />
              </div>
            </div>
          </div>
          <div className="six wide column field">
            <label>Hiring Manager:</label>
            <div className="value">
              <span className="capitalize">{position.attributes.employer_contact_name}</span>
            </div>
          </div>


          <div className="sixteen wide column field details">
            <label>
              Offer Letter Details:
            </label>
            <div className="value">
              <textarea className="ui input" ref="details"></textarea>
            </div>
          </div>

          <div className="eleven wide column label disclaimer">
            <label>Disclaimer:</label>
          </div>
          <div className="five wide column label upload-benefits">
            <label>Upload Benefits Package:</label>
          </div>

          <div className="eleven wide column value-disclaimer">
            <div className="disclaimer">
              <textarea className="ui input" rows="10" ref="disclaimer" readOnly="true">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris feugiat molestie quam et gravida. Duis fermentum, tortor vel rutrum rutrum, erat lectus faucibus risus, cursus ultrices orci dui ac est. In feugiat quis enim eu volutpat. Nullam hendrerit libero dolor, vitae porta risus sodales at. Etiam non leo ut purus elementum lobortis. Donec convallis lorem elit, non mollis dui molestie in. Aliquam nec orci risus. Aliquam consequat congue lacus a tincidunt. Nam id urna id quam consectetur auctor at eget eros. Nunc id vehicula lorem. Fusce maximus lectus nulla, sed pellentesque enim bibendum in. Donec et hendrerit est. Nulla cursus vulputate orci, eu auctor justo accumsan eget. Curabitur at nisi nec mi bibendum auctor. Vestibulum at facilisis turpis.
                In ornare, enim ac placerat rhoncus, felis odio tincidunt purus, consequat accumsan magna sapien nec orci. Aliquam pretium egestas efficitur. Praesent rhoncus, tortor at pretium aliquet, turpis magna pharetra erat, quis tristique ligula quam vitae nisi. Fusce ac faucibus leo, ac malesuada ante. Praesent a elit a tellus ornare euismod vitae eget nisi. Donec in lacinia orci, vel hendrerit mi. Praesent venenatis dolor gravida, efficitur dui ut, tincidunt nisi. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
              </textarea>
            </div>
          </div>
          <div className="five wide column value ui grid">
            <div className="sixteen wide column">
              <button className="ui button file-upload">
                <span>Browse</span>
                <input type="file" className="upload"/>
              </button>
              <span className="file-upload-status">Upload Complete...</span>
            </div>
          </div>

          <div className="twelve wide column fee-structure">
            <div className="monthly">
              YOUR MONTHLY PAYMENT WILL BE <span className="accent fee">${monthlySubscription} </span>
              <div className="checkbox">
                <input type="checkbox" id="acceptAgreement" ref="acceptAgreement" onChange={this.onAcceptAgreementChange.bind(this)} />
                <label htmlFor="acceptAgreement"></label>
              </div>
              <span className="accept-agreement">
                ACCEPT AGREEMENT
                <span className="accent"> (<a href={agreementPdfUrl} target="_blank">full agreement</a>)</span>
              </span>
            </div>
            <div className="one-time">
              ONE-TIME FETCH FEE OF <span className="accent fee">${upfrontFee}</span> <span className="small">(half of this fee will be passed on to the hired talent)</span>
            </div>
          </div>

          <div className="four wide column submit-button">
            <button className="ui button green right floated" onClick={this.onSendOfferClick.bind(this)} disabled={disableSubmitButton}>Send Offer</button>
          </div>

        </div>
      </div>
    )
  }
}

export default EmployerOfferForm

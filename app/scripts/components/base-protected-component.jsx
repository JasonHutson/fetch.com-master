
class BaseProtectedComponent extends React.Component {
  constructor(props) {
    super(props)

    $( document ).ajaxError(function( event, jqxhr, settings, thrownError ) {
      if (jqxhr.status === 401) {
        window.location.href = "/"
      }
    })
  }
}

export default BaseProtectedComponent
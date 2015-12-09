let Router = window.ReactRouter
let Route = Router.Route
import LandingPage from '../components/landing-page'
import OmniAuth from '../components/omniauth'
import FromEmailHandler from '../components/from-email-handler'
import SignupEmployerWithInvitation from '../components/signup-employer-with-invitation'
import ResetPasswordHandler from '../components/reset-password'

class App extends React.Component {
  render() {
    return (
      <div>
        <RouteHandler />
      </div>
    )
  }
}

let routes = (
  <Route handler={App}>
    <Route path="/" handler={LandingPage} />
    <Route path="/omniauth" handler={OmniAuth} />
    <Route path="/from_email" handler={FromEmailHandler} />
    <Route path="/reset_password" handler={ResetPasswordHandler} />
    <Route path="/invite_employer_contact" handler={SignupEmployerWithInvitation} />
  </Route>
)

let RouteHandler = Router.RouteHandler

Router.run(routes, Router.HashLocation, (Root) => {
  React.render(<Root/>, document.getElementById("landing-page"));
});

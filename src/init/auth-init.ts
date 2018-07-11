import Container from "../util/container";
import AuthUserLogin from "../routes/auth-user-login";
import AuthWhoami from "../routes/auth-whoami";
import AuthUserLogout from "../routes/auth-user-logout";

export default function(container: Container) {
  container.set('route-auth-user-login', function() {
    return new AuthUserLogin(container.get('auth'));
  });

  container.set('route-auth-whoami', function() {
    return new AuthWhoami(container.get('auth'));
  });

  container.set('route-auth-user-logout', function () {
    return new AuthUserLogout(container.get('auth'));
  });
}
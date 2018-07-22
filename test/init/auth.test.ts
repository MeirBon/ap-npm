import "mocha";
import { expect } from "chai";
import * as TypeMoq from "typemoq";
import authInit from "../../src/init/auth-init";
import Container from "../../src/util/container";
import AuthUserLogin from "../../src/routes/auth-user-login";
import AuthWhoami from "../../src/routes/auth-whoami";
import AuthUserLogout from "../../src/routes/auth-user-logout";
import Auth from "../../src/auth";

describe("init:auth", () => {
  it("should init correctly", async () => {
    const container = new Container();
    authInit(container);

    expect(container.has("route-auth-user-login")).true;
    expect(container.has("route-auth-whoami")).true;
    expect(container.has("route-auth-user-logout")).true;

    container.set("auth", TypeMoq.Mock.ofType<Auth>().object);
    expect(container.get("route-auth-user-login"))
      .to.be.instanceOf(AuthUserLogin);
    expect(container.get("route-auth-whoami"))
      .to.be.instanceOf(AuthWhoami);
    expect(container.get("route-auth-user-logout"))
      .to.be.instanceOf(AuthUserLogout);
  });
});

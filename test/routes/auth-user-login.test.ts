import "mocha";
import { expect } from "chai";
import * as TypeMoq from "typemoq";
import ApiAuthenticate from "../../src/routes/api-authenticate";
import { Auth } from "../../src/auth";

import * as httpMocks from "node-mocks-http";
import AuthUserLogin from "../../src/routes/auth-user-login";

describe("routes:auth-user-login", () => {
  it("should login a user", async () => {
    const authMock = TypeMoq.Mock.ofType<Auth>();
    authMock
      .setup(x => x.userLogin("test", "test", "test"))
      .returns(async () => {
        return "test";
      });
    const route = new AuthUserLogin(authMock.object);

    const req = httpMocks.createRequest({
      body: {
        username: "test",
        password: "test",
        email: "test"
      },
      send: function(body: any) {
        expect(body).to.equal({
          token: "test"
        });
        return this;
      }
    });

    const res = httpMocks.createResponse();

    await route.process(req, res);
    expect(res.statusCode).to.equal(200);
  });

  it("should create a user", async () => {

  });

  it("should send correct errors", async () => {

  });
});

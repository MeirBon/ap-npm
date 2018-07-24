import "mocha";
import { expect } from "chai";
import * as TypeMoq from "typemoq";
import { Auth } from "../../src/auth";
import * as httpMocks from "node-mocks-http";
import AuthUserLogout from "../../src/routes/auth-user-logout";

describe("routes:auth-user-logout", () => {
  it("should logout from authorization header", async () => {
    const authMock = TypeMoq.Mock.ofType<Auth>();
    const route = new AuthUserLogout(authMock.object);

    const req = httpMocks.createRequest({
      headers: {
        authorization: "test"
      }
    });

    const res = httpMocks.createResponse();

    await route.process(req, res);
    expect(res.statusCode).to.equal(200);
  });

  it("should logout from request parameter", async () => {
    const authMock = TypeMoq.Mock.ofType<Auth>();
    const route = new AuthUserLogout(authMock.object);

    const req = httpMocks.createRequest({
      params: {
        token: "test"
      }
    });

    const res = httpMocks.createResponse();

    await route.process(req, res);
    expect(res.statusCode).to.equal(200);
  });

  it("should act as if successful if auth throws", async () => {
    const authMock = TypeMoq.Mock.ofType<Auth>();
    authMock.setup(x => x.userLogout("test"))
      .returns(async () => {
        throw Error();
      });
    const route = new AuthUserLogout(authMock.object);

    const req = httpMocks.createRequest({
      headers: {
        authorization: "test"
      }
    });

    const res = httpMocks.createResponse();

    await route.process(req, res);
    expect(res.statusCode).to.equal(200);
  });
});

import "mocha";
import { expect } from "chai";
import * as TypeMoq from "typemoq";
import { Auth } from "../../src/auth";
import * as httpMocks from "node-mocks-http";
import AuthUserLogin from "../../src/routes/auth-user-login";

describe("routes:auth-user-login", () => {
  it("should login a user", async () => {
    const authMock = TypeMoq.Mock.ofType<Auth>();
    authMock.setup(x => x.userLogin("test", "test")).returns(async () => {
      return "test";
    });
    const route = new AuthUserLogin(authMock.object);

    const req = httpMocks.createRequest({
      body: {
        name: "test",
        password: "test"
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
    const authMock = TypeMoq.Mock.ofType<Auth>();
    authMock.setup(x => x.userLogin("test", "test")).returns(async () => {
      throw Error();
    });
    authMock.setup(x => x.userAdd("test", "test")).returns(async () => "test");
    const route = new AuthUserLogin(authMock.object);

    const req = httpMocks.createRequest({
      body: {
        name: "test",
        password: "test"
      }
    });

    const res = httpMocks.createResponse();

    await route.process(req, res);
    expect(res.statusCode).to.equal(200);
  });

  it("should send a 401 if user cannot be created", async () => {
    const authMock = TypeMoq.Mock.ofType<Auth>();
    authMock.setup(x => x.userLogin("test", "test")).returns(async () => {
      throw Error();
    });
    authMock.setup(x => x.userAdd("test", "test")).returns(async () => {
      throw Error();
    });
    const route = new AuthUserLogin(authMock.object);

    const req = httpMocks.createRequest({
      body: {
        name: "test",
        password: "test"
      }
    });

    const res = httpMocks.createResponse();

    await route.process(req, res);
    expect(res.statusCode).to.equal(401);
  });
});

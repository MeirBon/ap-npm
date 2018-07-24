import "mocha";
import { expect } from "chai";
import * as TypeMoq from "typemoq";
import { Auth } from "../../src/auth";
import * as httpMocks from "node-mocks-http";
import AuthWhoami from "../../src/routes/auth-whoami";

describe("routes:auth-whoami", () => {
  it("should return username from authorization header", async () => {
    const authMock = TypeMoq.Mock.ofType<Auth>();
    authMock.setup(x => x.verifyToken("test")).returns(async () => {
      return "test";
    });

    const route = new AuthWhoami(authMock.object);

    const req = httpMocks.createRequest({
      headers: {
        authorization: "Bearer test"
      }
    });

    const res = httpMocks.createResponse();

    await route.process(req, res);
    expect(res.statusCode).to.equal(200);
    expect(res._getData()).to.haveOwnProperty("username");
    expect(res._getData().username).to.equal("test");
  });

  it("should return a 401 on invalid token", async () => {
    const authMock = TypeMoq.Mock.ofType<Auth>();
    authMock.setup(x => x.verifyToken("test")).returns(async () => {
      throw Error();
    });

    const route = new AuthWhoami(authMock.object);

    const req = httpMocks.createRequest({
      headers: {
        authorization: "Bearer test"
      }
    });

    const res = httpMocks.createResponse();

    await route.process(req, res);
    expect(res.statusCode).to.equal(401);
  });

  it("should return a 401 on no header", async () => {
    const authMock = TypeMoq.Mock.ofType<Auth>();
    authMock.setup(x => x.verifyToken("test")).returns(async () => {
      throw Error();
    });

    const route = new AuthWhoami(authMock.object);

    const req = httpMocks.createRequest();

    const res = httpMocks.createResponse();

    await route.process(req, res);
    expect(res.statusCode).to.equal(401);
  });
});

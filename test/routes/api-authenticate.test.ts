import "mocha";
import { expect } from "chai";
import * as TypeMoq from "typemoq";
import ApiAuthenticate from "../../src/routes/api-authenticate";
import { Auth } from "../../src/auth";

import * as httpMocks from "node-mocks-http";

describe("routes:api-authenticate", () => {
  it("should return status 200 with body", async () => {
    const authMock = TypeMoq.Mock.ofType<Auth>();
    authMock
      .setup(x => x.userLogin("test", "test", "test"))
      .returns(async () => {
        return "test";
      });
    const route = new ApiAuthenticate(authMock.object);

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

  it("should return status 400 without body", async () => {
    const authMock = TypeMoq.Mock.ofType<Auth>();
    const route = new ApiAuthenticate(authMock.object);

    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    await route.process(req, res);
    expect(res.statusCode).to.equal(400);
  });

  it("should return status 401 when auth throws", async () => {
    const authMock = TypeMoq.Mock.ofType<Auth>();
    authMock.setup(x => x.userLogin("test", "test", "test")).returns(() => {
      throw Error();
    });

    const route = new ApiAuthenticate(authMock.object);

    const req = httpMocks.createRequest({
      body: {
        username: "test",
        password: "test",
        email: "test"
      }
    });
    const res = httpMocks.createResponse();

    await route.process(req, res);
    expect(res.statusCode).to.equal(401);
  });
});

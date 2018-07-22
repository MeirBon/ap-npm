import "mocha";
import { expect } from "chai";
import * as TypeMoq from "typemoq";
import { AccessType, Auth } from "../../src/auth";
import Access from "../../src/auth/access";
import { NextFunction } from "express";

const httpMocks = require("node-mocks-http");

describe("auth:access", () => {
  it("should call next on success", async () => {
    const type = AccessType.Access;
    const authMock = TypeMoq.Mock.ofType<Auth>();
    authMock
      .setup(x => x.shouldBeAbleTo(type, "test", "Bearer test"))
      .returns(async () => true);

    let called = false;

    const next: NextFunction = () => {
      called = true;
    };

    const access = new Access(authMock.object);

    const req = httpMocks.createRequest({
      headers: {
        authorization: "Bearer test"
      },
      params: {
        "package": "test"
      }
    });

    const res = httpMocks.createResponse();
    await access.can(type)(req, res, next);
    expect(called).true;
  });

  it("should return 400 on invalid header", async () => {
    const type = AccessType.Access;
    const authMock = TypeMoq.Mock.ofType<Auth>();
    authMock.setup(x => x.shouldBeAbleTo(type, "test", "test")).returns(
      async (): Promise<boolean> => {
        expect(type).to.equal(AccessType.Access);
        return true;
      }
    );

    const next: NextFunction = () => 0;

    const access = new Access(authMock.object);

    const req = httpMocks.createRequest({
      headers: {
        authorization: "test"
      },
      send: function(body: any) {
        expect(body).to.equal({
          message: "Invalid authorization header"
        });
        return this;
      }
    });

    const res = httpMocks.createResponse();
    await access.can(type)(req, res, next);
    expect(res.statusCode).to.equal(400);
  });

  it("should return 401 when unauthorized", async () => {
    const type = AccessType.Access;
    const authMock = TypeMoq.Mock.ofType<Auth>();
    authMock.setup(x => x.shouldBeAbleTo(type, "test", "test")).returns(
      async (): Promise<boolean> => {
        expect(type).to.equal(AccessType.Access);
        return false;
      }
    );

    const next: NextFunction = () => expect(true);

    const access = new Access(authMock.object);

    const req = httpMocks.createRequest({
      headers: {
        authorization: "Bearer test"
      },
      send: function(body: any) {
        expect(body).to.equal({
          message: "Unauthorized"
        });
        return this;
      }
    });

    const res = httpMocks.createResponse();
    await access.can(type)(req, res, next);
    expect(res.statusCode).to.equal(401);
  });

  it("should return 401 when auth throws error", async () => {
    const type = AccessType.Publish;
    const authMock = TypeMoq.Mock.ofType<Auth>();
    authMock.setup(x => x.shouldBeAbleTo(type, "test", "test")).returns(
      async (): Promise<boolean> => {
        expect(type).to.equal(AccessType.Access);
        throw Error();
      }
    );

    const next: NextFunction = () => expect(true);

    const access = new Access(authMock.object);

    const req = httpMocks.createRequest({
      headers: {
        authorization: "Bearer test"
      },
      send: function(body: any) {
        expect(body).to.equal({
          message: "Unauthorized"
        });
        return this;
      }
    });

    const res = httpMocks.createResponse();
    await access.can(type)(req, res, next);
    expect(res.statusCode).to.equal(401);
  });

  it("should return true when public", async () => {
    const authMock = TypeMoq.Mock.ofType<Auth>();
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const access = new Access(authMock.object, true);
    let called = false;
    const next: NextFunction = () => expect((called = true));
    await access.can(AccessType.Access)(req, res, next);
    expect(called).true;
    called = false;
    await access.can(AccessType.Publish)(req, res, next);
    expect(called).true;
  });

  it("should return 400 when authorization header is not present", async () => {
    const type = AccessType.Access;
    const authMock = TypeMoq.Mock.ofType<Auth>();
    let called = false;
    const next: NextFunction = () => {
      called = true;
    };

    const access = new Access(authMock.object);

    const req = httpMocks.createRequest({
      headers: {
        authorization: undefined
      },
      send: function(body: any) {
        expect(body).to.equal({
          message: "Unauthorized"
        });
        return this;
      }
    });

    const res = httpMocks.createResponse();
    await access.can(type)(req, res, next);
    expect(res.statusCode).to.equal(401);
    expect(called).false;
  });
});

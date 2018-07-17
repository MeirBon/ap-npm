import "mocha";
import { expect } from "chai";
import requestParser from "../../../src/util/request-parser";

const httpMocks = require("node-mocks-http");

describe("utils:request-parser", () => {
  it("should call next on api call", async () => {
    const req = httpMocks.createRequest({
      url: "/api"
    });
    const res = httpMocks.createResponse();
    let isCalled = false;

    const next = () => {
      isCalled = true;
    };

    requestParser(req, res, next);
    expect(isCalled).true;
  });

  it("should parse string body as npm-args", async () => {
    const req = httpMocks.createRequest({
      body: "test",
      url: "/"
    });
    const res = httpMocks.createResponse();

    requestParser(req, res, () => 0);

    expect(req.body).to.haveOwnProperty("npm-args");
    expect(req.body["npm-args"]).to.equal("test");
  });

  it("should parse package name", async () => {
    const req = httpMocks.createRequest({
      body: {},
      url: "/-/package/test"
    });
    const res = httpMocks.createResponse();

    requestParser(req, res, () => 0);

    expect(req.body).to.haveOwnProperty("_packageName");
    expect(req.body._packageName).to.equal("test");
  });

  it("should parse package name & scope", async () => {
    const req = httpMocks.createRequest({
      body: {},
      url: "/-/package/@scope/test"
    });
    const res = httpMocks.createResponse();

    requestParser(req, res, () => 0);

    expect(req.body).to.haveOwnProperty("_packageName");
    expect(req.body).to.haveOwnProperty("_scope");
    expect(req.body._packageName).to.equal("test");
    expect(req.body._scope).to.equal("@scope");
  });

  it("should parse package name & dist-tag", async () => {
    const req = httpMocks.createRequest({
      body: {},
      url: "/-/package/test/dist-tags/latest"
    });
    const res = httpMocks.createResponse();

    requestParser(req, res, () => 0);

    expect(req.body).to.haveOwnProperty("_packageName");
    expect(req.body).to.haveOwnProperty("_disttag");
    expect(req.body._packageName).to.equal("test");
    expect(req.body._disttag).to.equal("latest");
  });

  it("should parse package name, scope & dist-tag", async () => {
    const req = httpMocks.createRequest({
      body: {},
      url: "/-/package/@scope/test/dist-tags/latest"
    });
    const res = httpMocks.createResponse();

    requestParser(req, res, () => 0);

    expect(req.body).to.haveOwnProperty("_packageName");
    expect(req.body).to.haveOwnProperty("_scope");
    expect(req.body).to.haveOwnProperty("_disttag");
    expect(req.body._packageName).to.equal("test");
    expect(req.body._scope).to.equal("@scope");
    expect(req.body._disttag).to.equal("latest");
  });

  it("should parse requested file", async () => {
    const req = httpMocks.createRequest({
      body: {},
      url: "/test/-/test-1.0.0.tgz"
    });
    const res = httpMocks.createResponse();

    requestParser(req, res, () => 0);

    expect(req.body).to.haveOwnProperty("_packageName");
    expect(req.body).to.haveOwnProperty("_requestedFile");
    expect(req.body._packageName).to.equal("test");
    expect(req.body._requestedFile).to.equal("test-1.0.0.tgz");
  });

  it("should parse scoped requested file", async () => {
    const req = httpMocks.createRequest({
      body: {},
      url: "/@scope/test/-/test-1.0.0.tgz"
    });
    const res = httpMocks.createResponse();

    requestParser(req, res, () => 0);
    console.log(req.body);

    expect(req.body).to.haveOwnProperty("_packageName");
    expect(req.body).to.haveOwnProperty("_scope");
    expect(req.body).to.haveOwnProperty("_requestedFile");
    expect(req.body._packageName).to.equal("test");
    expect(req.body._scope).to.equal("scope");
    expect(req.body._requestedFile).to.equal("test-1.0.0.tgz");
  });
});

import "mocha";
import { expect } from "chai";
import paramParser from "../../../src/util/param-parser";

const httpMocks = require("node-mocks-http");

describe("utils:param-parser", () => {
  it("should parse a single argument", async () => {
    const req = httpMocks.createRequest({
      url: "/test?a=b"
    });
    const res = httpMocks.createResponse();
    const next = () => {
      expect(true).to.equal(true);
    };

    paramParser(req, res, next);
    expect(req.params.a).to.equal("b");
  });

  it("should parse multiple arguments", async () => {
    const req = httpMocks.createRequest({
      url: "/test?a=b&b=a"
    });
    const res = httpMocks.createResponse();
    const next = () => {
      expect(true).to.equal(true);
    };

    paramParser(req, res, next);
    expect(req.params.a).to.equal("b");
    expect(req.params.b).to.equal("a");
  });

  it("should parse arrays", async () => {
    const req = httpMocks.createRequest({
      url: "/test?a[]=a&a[]=b&a[]=c"
    });
    const res = httpMocks.createResponse();
    const next = () => {
      expect(true).to.equal(true);
    };

    paramParser(req, res, next);
    const v = ["a", "b", "c"];
    for (let i = 0; i < req.params.a.length; i++) {
      expect(req.params.a[i]).to.equal(v[i]);
    }
  });

  it("should parse multiple arguments & arrays", async () => {
    const req = httpMocks.createRequest({
      url: "/test?a[]=a&a[]=b&a[]=c&b=a&c=b"
    });
    const res = httpMocks.createResponse();
    const next = () => {
      expect(true).to.equal(true);
    };

    paramParser(req, res, next);
    const v = ["a", "b", "c"];
    for (let i = 0; i < req.params.a.length; i++) {
      expect(req.params.a[i]).to.equal(v[i]);
    }
    expect(req.params.b).to.equal("a");
    expect(req.params.c).to.equal("b");
  });

  it("should call next when no querystring is given", async () => {
    const req = httpMocks.createRequest({
      url: "/test"
    });
    const res = httpMocks.createResponse();
    const next = () => {
      expect(true).to.equal(true);
    };

    paramParser(req, res, next);
  });
});

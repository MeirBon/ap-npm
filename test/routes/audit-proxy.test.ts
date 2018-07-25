import "mocha";
import { expect } from "chai";
import * as TypeMoq from "typemoq";
import { AxiosInstance } from "@contentful/axios";
import * as httpMock from "node-mocks-http";
import AuditProxy from "../../src/routes/audit-proxy";

describe("routes:audit-proxy", () => {
  it("should proxy audit requests", async () => {
    const axios = TypeMoq.Mock.ofType<AxiosInstance>();
    axios.setup(x => x.post("https://test.nl/test", "test")).returns(async () => {
      return {
        data: {
          test: "test"
        },
        status: 200,
        request: {},
        headers: [],
        config: {},
        statusText: "OK"
      };
    });
    const auditProxy = new AuditProxy("https://test.nl/", axios.object, true);

    const req = httpMock.createRequest({ url: "test" });
    req.body = "test";
    const res = httpMock.createResponse();

    await auditProxy.process(req, res);
    expect(res.statusCode).to.equal(200);
    expect(res._getData()).to.haveOwnProperty("test");
    expect(res._getData().test).to.equal("test");
  });

  it("should return 500 when axios throws", async () => {
    const axios = TypeMoq.Mock.ofType<AxiosInstance>();
    axios.setup(x => x.post("https://test.nl/test", { test: "test" })).returns(async () => {
      throw Error();
    });
    const auditProxy = new AuditProxy("https://test.nl/", axios.object, true);

    const req = httpMock.createRequest({
      url: "test",
      body: {
        test: "test"
      }
    });
    const res = httpMock.createResponse();
    await auditProxy.process(req, res);
    expect(res.statusCode).to.equal(500);
  });

  it("should return 500 when disabled", async () => {
    const axios = TypeMoq.Mock.ofType<AxiosInstance>();
    const auditProxy = new AuditProxy("https://test.nl", axios.object, false);

    const req = httpMock.createRequest({
      body: {
        test: "test"
      }
    });
    const res = httpMock.createResponse();
    await auditProxy.process(req, res);
    expect(res.statusCode).to.equal(500);
  });
});

import "mocha";
import { expect } from "chai";
import * as TypeMoq from "typemoq";
import { AxiosInstance } from "@contentful/axios";
import PackageProxy from "../../src/routes/package-proxy";

import * as httpMock from "node-mocks-http";

describe("routes:package-proxy", () => {
  it("should return true on valid higher version", async () => {
    const axios = TypeMoq.Mock.ofType<AxiosInstance>();
    axios.setup(x => x.get("https://test.nl/@scope/test")).returns(async () => {
      return {
        data: "test",
        status: 200,
        request: {},
        headers: [],
        config: {},
        statusText: "OK"
      };
    });
    axios.setup(x => x.get("https://test.nl/crash")).returns(async () => {
      throw Error("test");
    });
    let packageProxy = new PackageProxy("https://test.nl/", axios.object);

    let req = httpMock.createRequest({
      params: {
        "package": "test",
        scope: "@scope"
      }
    });
    let res = httpMock.createResponse();
    await packageProxy.process(req, res);

    expect(res.statusCode).to.equal(200);
    packageProxy = new PackageProxy("https://test.nl", axios.object);

    res = httpMock.createResponse();
    req = httpMock.createRequest({
      params: {
        "package": "crash"
      }
    });

    await packageProxy.process(req, res);
    expect(res._getData()).to.equal("Internal server error");
    expect(res.statusCode).to.equal(500);
  });
});

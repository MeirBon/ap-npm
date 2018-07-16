import "mocha";
import { expect } from "chai";
import paramParser from "../../../src/util/param-parser";

const httpMocks = require("node-mocks-http");

describe("utils:logger", () => {
  it("routerLogger should call next", async () => {
    const req = httpMocks.createRequest({});
    const res = httpMocks.createResponse();
  });
});

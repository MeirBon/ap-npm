import "mocha";
import { expect } from "chai";
import * as TypeMoq from "typemoq";
import Logger from "../../../src/util/logger";
import WriteStream = NodeJS.WriteStream;

const httpMocks = require("node-mocks-http");

describe("utils:logger", () => {
  it("should log router calls correctly", async () => {
    const stream = TypeMoq.Mock.ofType<WriteStream>();
    stream.setup(x => x.write(TypeMoq.It.isValue("\nMETHOD: GET, URL: /test")));

    const req = httpMocks.createRequest({
      method: "GET",
      originalUrl: "/test"
    });
    const res = httpMocks.createResponse();
    const next = () => {
      expect(true);
    };

    const logger = new Logger(stream.object);
    logger.routerLogger(req, res, next);
  });

  it("should log correctly", () => {
    const stream = TypeMoq.Mock.ofType<WriteStream>();
    const message = "test";
    stream.setup(x => x.write(TypeMoq.It.isValue("test")));

    const logger = new Logger(stream.object);
    logger.log(message);
    logger.info(message);
    logger.debug(message);
    logger.error(message);
    logger.warn(message);
  });
});

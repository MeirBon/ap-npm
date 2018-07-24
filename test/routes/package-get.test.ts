import "mocha";
import { expect } from "chai";
import * as TypeMoq from "typemoq";
import * as httpMock from "node-mocks-http";
import Filesystem from "../../src/storage/filesystem";
import PackageGet from "../../src/routes/package-get";

describe("routes:package-get", () => {
  it("should return package file", async () => {
    const storage = TypeMoq.Mock.ofType<Filesystem>();

    const req = httpMock.createRequest({
      params: {
        package: "test",
        filename: "file"
      }
    });
    const res = httpMock.createResponse();
    const buffer = Buffer.from("test");

    storage
      .setup(x => x.getPackage({ name: "test", scope: undefined, file: "file" }))
      .returns(async () => {
        return buffer;
      });

    const route = new PackageGet(storage.object);

    await route.process(req, res);
    const data = res._getData();
    expect(data).to.equal(buffer);
    expect(res.statusCode).to.equal(200);
  });

  it("should return a 404 if package not found", async () => {
    const storage = TypeMoq.Mock.ofType<Filesystem>();

    const req = httpMock.createRequest({
      params: {
        package: "test",
        filename: "file"
      }
    });
    const res = httpMock.createResponse();

    storage
      .setup(x => x.getPackage({ name: "test", scope: undefined, file: "file" }))
      .returns(async () => {
        throw Error();
      });

    const route = new PackageGet(storage.object);

    await route.process(req, res);
    expect(res.statusCode).to.equal(404);
  });
});

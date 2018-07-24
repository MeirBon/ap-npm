import "mocha";
import { expect } from "chai";
import * as TypeMoq from "typemoq";
import * as httpMock from "node-mocks-http";
import Filesystem from "../../src/storage/filesystem";
import PackageDelete from "../../src/routes/package-delete";
import Validator from "../../src/util/validator";

describe("routes:package-delete", () => {
  it("should not allow deletion when missing config", async () => {
    const storage = TypeMoq.Mock.ofType<Filesystem>();
    const validator = TypeMoq.Mock.ofType<Validator>();
    const config = new Map<string, any>();

    const req = httpMock.createRequest();
    const res = httpMock.createResponse();

    const route = new PackageDelete(storage.object, validator.object, config);

    await route.process(req, res);
    expect(res.statusCode).to.equal(403);
  });

  it("should not allow deletion when config set to false", async () => {
    const storage = TypeMoq.Mock.ofType<Filesystem>();
    const validator = TypeMoq.Mock.ofType<Validator>();
    const config = new Map<string, any>();
    config.set("auth", { remove: false });

    const req = httpMock.createRequest();
    const res = httpMock.createResponse();

    const route = new PackageDelete(storage.object, validator.object, config);

    await route.process(req, res);
    expect(res.statusCode).to.equal(403);
  });

  it("should return a 400 if no referer given", async () => {
    const storage = TypeMoq.Mock.ofType<Filesystem>();
    const validator = TypeMoq.Mock.ofType<Validator>();
    const config = new Map<string, any>();
    config.set("auth", { remove: true });

    const req = httpMock.createRequest();
    const res = httpMock.createResponse();

    const route = new PackageDelete(storage.object, validator.object, config);

    await route.process(req, res);
    expect(res.statusCode).to.equal(400);
  });

  it("should return a 400 on invalid referer [1/2]", async () => {
    const storage = TypeMoq.Mock.ofType<Filesystem>();
    const validator = TypeMoq.Mock.ofType<Validator>();
    const config = new Map<string, any>();
    config.set("auth", { remove: true });

    const req = httpMock.createRequest();
    req.headers.referer = "Invalid";
    const res = httpMock.createResponse();

    const route = new PackageDelete(storage.object, validator.object, config);

    await route.process(req, res);
    expect(res.statusCode).to.equal(400);
  });

  it("should return a 400 on invalid referer [2/2]", async () => {
    const storage = TypeMoq.Mock.ofType<Filesystem>();
    const validator = TypeMoq.Mock.ofType<Validator>();
    const config = new Map<string, any>();
    config.set("auth", { remove: true });

    const req = httpMock.createRequest();
    req.headers.referer = ["Invalid"];
    const res = httpMock.createResponse();

    const route = new PackageDelete(storage.object, validator.object, config);

    await route.process(req, res);
    expect(res.statusCode).to.equal(400);
  });

  it('should return a 400 if command does not equal "unpublish"', async () => {
    const storage = TypeMoq.Mock.ofType<Filesystem>();
    const validator = TypeMoq.Mock.ofType<Validator>();
    const config = new Map<string, any>();
    config.set("auth", { remove: true });

    const req = httpMock.createRequest();
    req.headers.referer = "Invalid pkg";
    const res = httpMock.createResponse();

    const route = new PackageDelete(storage.object, validator.object, config);

    await route.process(req, res);
    expect(res.statusCode).to.equal(400);
  });

  it("should remove a package", async () => {
    const storage = TypeMoq.Mock.ofType<Filesystem>();
    const validator = TypeMoq.Mock.ofType<Validator>();
    const config = new Map<string, any>();
    config.set("auth", { remove: true });

    storage
      .setup(x => x.removePackage({ name: "test", scope: undefined }))
      .returns(async () => true);

    const req = httpMock.createRequest({
      params: {
        package: "test"
      }
    });
    req.headers.referer = "unpublish test";
    const res = httpMock.createResponse();

    const route = new PackageDelete(storage.object, validator.object, config);

    await route.process(req, res);
    expect(res.statusCode).to.equal(200);
  });

  it("should remove a package version", async () => {
    const storage = TypeMoq.Mock.ofType<Filesystem>();
    const validator = TypeMoq.Mock.ofType<Validator>();
    const config = new Map<string, any>();
    config.set("auth", { remove: true });

    storage
      .setup(x =>
        x.removePackageVersion({
          name: "test",
          scope: undefined,
          version: "1.0.0"
        })
      )
      .returns(async () => true);

    const req = httpMock.createRequest({
      params: {
        package: "test"
      }
    });
    req.headers.referer = "unpublish test@1.0.0";
    const res = httpMock.createResponse();

    const route = new PackageDelete(storage.object, validator.object, config);

    await route.process(req, res);
    expect(res.statusCode).to.equal(200);
    expect(res._getData().message).to.equal("Package version: 1.0.0 deleted");
  });

  it("should return a 500 on removal error", async () => {
    const storage = TypeMoq.Mock.ofType<Filesystem>();
    const validator = TypeMoq.Mock.ofType<Validator>();
    const config = new Map<string, any>();
    config.set("auth", { remove: true });

    const req = httpMock.createRequest({
      params: {
        package: "test"
      }
    });
    req.headers.referer = "unpublish test@1.0.0";
    const res = httpMock.createResponse();

    const route = new PackageDelete(storage.object, validator.object, config);

    await route.process(req, res);
    expect(res.statusCode).to.equal(500);
  });
});

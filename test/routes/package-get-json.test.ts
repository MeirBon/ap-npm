import "mocha";
import { expect } from "chai";
import * as TypeMoq from "typemoq";
import PackageProxy from "../../src/routes/package-proxy";
import * as httpMock from "node-mocks-http";
import PackageGetJson from "../../src/routes/package-get-json";
import Filesystem from "../../src/storage/filesystem";

describe("routes:package-get-json", () => {
  it("should return package.json data", async () => {
    const storage = TypeMoq.Mock.ofType<Filesystem>();
    const proxy = TypeMoq.Mock.ofType<PackageProxy>();

    const req = httpMock.createRequest({
      params: {
        package: "test"
      }
    });
    const res = httpMock.createResponse();

    storage
      .setup(x => x.getPackageJson({ name: "test", scope: undefined }))
      .returns(async () => {
        return {
          a: "b"
        };
      });

    const route = new PackageGetJson(storage.object, proxy.object, false);

    await route.process(req, res);
    const data = res._getData();
    expect(data).to.haveOwnProperty("a");
    expect(data.a).to.equal("b");
    expect(res.statusCode).to.equal(200);
  });

  it("should return a 404 if getting package.json failed", async () => {
    const storage = TypeMoq.Mock.ofType<Filesystem>();
    const proxy = TypeMoq.Mock.ofType<PackageProxy>();

    const req = httpMock.createRequest({
      params: {
        package: "test"
      }
    });
    const res = httpMock.createResponse();

    storage
      .setup(x => x.getPackageJson({ name: "test", scope: undefined }))
      .returns(async () => {
        return "";
      });

    const route = new PackageGetJson(storage.object, proxy.object, false);

    await route.process(req, res);
    expect(res.statusCode).to.equal(404);
  });

  it("should call proxy if getting package.json fails", async () => {
    const storage = TypeMoq.Mock.ofType<Filesystem>();
    const proxy = TypeMoq.Mock.ofType<PackageProxy>();

    const req = httpMock.createRequest({
      params: {
        package: "test"
      }
    });
    const res = httpMock.createResponse();
    let called = false;

    storage
      .setup(x => x.getPackageJson({ name: "test", scope: undefined }))
      .returns(async () => {
        throw Error();
      });
    proxy.setup(x => x.process(req, res))
      .returns(async () => {
        res.status(200);
        called = true;
      });

    const route = new PackageGetJson(storage.object, proxy.object, true);

    await route.process(req, res);
    expect(res.statusCode).to.equal(200);
    expect(called).true;
  });

  it("should call proxy if getting package.json fails", async () => {
    const storage = TypeMoq.Mock.ofType<Filesystem>();
    const proxy = TypeMoq.Mock.ofType<PackageProxy>();

    const req = httpMock.createRequest({
      params: {
        package: "test"
      }
    });
    const res = httpMock.createResponse();

    storage
      .setup(x => x.getPackageJson({ name: "test", scope: undefined }))
      .returns(async () => {
        throw Error();
      });

    const route = new PackageGetJson(storage.object, proxy.object, false);

    await route.process(req, res);
    expect(res.statusCode).to.equal(500);
  });
});

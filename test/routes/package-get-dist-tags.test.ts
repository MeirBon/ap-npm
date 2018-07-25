import "mocha";
import { expect } from "chai";
import * as TypeMoq from "typemoq";
import * as httpMock from "node-mocks-http";
import Filesystem from "../../src/storage/filesystem";
import PackageGetDistTags from "../../src/routes/package-get-dist-tags";

describe("routes:package-get-dist-tags", () => {
  it("should return a 404 if storage throws", async () => {
    const storage = TypeMoq.Mock.ofType<Filesystem>();
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

    const route = new PackageGetDistTags(storage.object);

    await route.process(req, res);
    expect(res.statusCode).to.equal(404);
  });

  it("should return dist-tags", async () => {
    const storage = TypeMoq.Mock.ofType<Filesystem>();
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
          "dist-tags": {
            latest: "1.0.0"
          }
        };
      });

    const route = new PackageGetDistTags(storage.object);

    await route.process(req, res);
    expect(res.statusCode).to.equal(200);
    expect(res._getData()).to.haveOwnProperty("latest");
    expect(res._getData().latest).to.equal("1.0.0");
  });

  it("should return empty dist-tags if undefined", async () => {
    const storage = TypeMoq.Mock.ofType<Filesystem>();
    const req = httpMock.createRequest({
      params: {
        package: "test"
      }
    });
    const res = httpMock.createResponse();

    storage
      .setup(x => x.getPackageJson({ name: "test", scope: undefined }))
      .returns(async () => {
        return {};
      });

    const route = new PackageGetDistTags(storage.object);

    await route.process(req, res);
    expect(res.statusCode).to.equal(200);
    expect(res._getData()).to.not.haveOwnProperty("latest");
  });

  it("should return 404 if package.json is not an object", async () => {
    const storage = TypeMoq.Mock.ofType<Filesystem>();
    const req = httpMock.createRequest({
      params: {
        package: "test"
      }
    });
    const res = httpMock.createResponse();

    storage
      .setup(x => x.getPackageJson({ name: "test", scope: undefined }))
      .returns(async () => "test");

    const route = new PackageGetDistTags(storage.object);

    await route.process(req, res);
    expect(res.statusCode).to.equal(404);
  });
});

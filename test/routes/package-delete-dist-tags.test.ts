import "mocha";
import { expect } from "chai";
import * as TypeMoq from "typemoq";
import * as httpMock from "node-mocks-http";
import Filesystem from "../../src/storage/filesystem";
import PackageDeleteDistTags from "../../src/routes/package-delete-dist-tags";

describe("routes:package-delete-dist-tags", () => {
  it("should return a 404 if getting package.json errors", async () => {
    const storage = TypeMoq.Mock.ofType<Filesystem>();
    const req = httpMock.createRequest({
      params: {
        package: "test",
        tag: "latest"
      }
    });
    const res = httpMock.createResponse();

    storage
      .setup(x => x.getPackageJson({ name: "test", scope: undefined }))
      .returns(async () => {
        throw Error();
      });

    const route = new PackageDeleteDistTags(storage.object);

    await route.process(req, res);
    expect(res.statusCode).to.equal(404);
  });

  it("should return a 404 if updating was unsuccessful", async () => {
    const storage = TypeMoq.Mock.ofType<Filesystem>();
    const req = httpMock.createRequest({
      params: {
        package: "test",
        tag: "latest"
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

    storage
      .setup(x =>
        x.updatePackageJson(
          { name: "test", scope: undefined },
          { "dist-tags": {} }
        )
      )
      .returns(async () => false);

    const route = new PackageDeleteDistTags(storage.object);

    await route.process(req, res);
    expect(res.statusCode).to.equal(404);
  });

  it("should delete a dist-tag", async () => {
    const storage = TypeMoq.Mock.ofType<Filesystem>();
    const req = httpMock.createRequest({
      params: {
        package: "test",
        tag: "latest"
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

    storage
      .setup(x =>
        x.updatePackageJson(
          { name: "test", scope: undefined },
          { "dist-tags": {} }
        )
      )
      .returns(async () => true);

    const route = new PackageDeleteDistTags(storage.object);

    await route.process(req, res);
    expect(res.statusCode).to.equal(200);
  });
});

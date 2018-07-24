import "mocha";
import { expect } from "chai";
import * as TypeMoq from "typemoq";
import * as httpMock from "node-mocks-http";
import Filesystem from "../../src/storage/filesystem";
import PackageAddDistTags from "../../src/routes/package-add-dist-tags";

describe("routes:package-add-dist-tags", () => {
  it("should return a 400 for an invalid request", async () => {
    const storage = TypeMoq.Mock.ofType<Filesystem>();
    const req = httpMock.createRequest();
    req.body = 0;
    const res = httpMock.createResponse();

    const route = new PackageAddDistTags(storage.object);

    await route.process(req, res);
    expect(res.statusCode).to.equal(400);
  });

  it("should send a 404 if a package is not found", async () => {
    const storage = TypeMoq.Mock.ofType<Filesystem>();
    const req = httpMock.createRequest();
    req.body = "1.0.0";
    req.params = {
      package: "test",
      tag: "latest"
    };

    const res = httpMock.createResponse();

    storage
      .setup(x =>
        x.getPackageJson({
          name: "test",
          scope: undefined
        })
      )
      .returns(async () => {
        throw Error();
      });

    const route = new PackageAddDistTags(storage.object);

    await route.process(req, res);
    expect(res.statusCode).to.equal(404);
  });

  it("should send a 404 if version does not exist", async () => {
    const storage = TypeMoq.Mock.ofType<Filesystem>();
    const req = httpMock.createRequest();
    req.body = "1.0.0";
    req.params = {
      package: "test",
      tag: "latest"
    };

    const res = httpMock.createResponse();

    storage
      .setup(x =>
        x.getPackageJson({
          name: "test",
          scope: undefined
        })
      )
      .returns(async () => {
        return {
          versions: {
            "0.9.0": {}
          },
          "dist-tags": {
            latest: "0.9.0"
          }
        };
      });

    const route = new PackageAddDistTags(storage.object);

    await route.process(req, res);
    expect(res.statusCode).to.equal(404);
  });

  it("should add a dist-tag", async () => {
    const storage = TypeMoq.Mock.ofType<Filesystem>();
    const req = httpMock.createRequest();
    req.body = "1.0.0";
    req.params = {
      package: "test",
      tag: "latest"
    };

    const res = httpMock.createResponse();

    storage
      .setup(x =>
        x.getPackageJson({
          name: "test",
          scope: undefined
        })
      )
      .returns(async () => {
        return {
          versions: {
            "1.0.0": {},
            "0.9.0": {}
          },
          "dist-tags": {
            latest: "0.9.0"
          }
        };
      });

    storage
      .setup(x =>
        x.updatePackageJson(
          { name: "test", scope: undefined },
          {
            versions: {
              "1.0.0": {},
              "0.9.0": {}
            },
            "dist-tags": {
              latest: "1.0.0"
            }
          }
        )
      )
      .returns(async () => true);

    const route = new PackageAddDistTags(storage.object);

    await route.process(req, res);
    expect(res.statusCode).to.equal(200);
  });

  it("should send a 404 if updating package.json fails", async () => {
    const storage = TypeMoq.Mock.ofType<Filesystem>();
    const req = httpMock.createRequest();
    req.body = "1.0.0";
    req.params = {
      package: "test",
      tag: "latest"
    };

    const res = httpMock.createResponse();

    storage
      .setup(x =>
        x.getPackageJson({
          name: "test",
          scope: undefined
        })
      )
      .returns(async () => {
        return {
          versions: {
            "1.0.0": {},
            "0.9.0": {}
          },
          "dist-tags": {
            latest: "0.9.0"
          }
        };
      });

    storage
      .setup(x =>
        x.updatePackageJson(
          { name: "test", scope: undefined },
          {
            versions: {
              "1.0.0": {},
              "0.9.0": {}
            },
            "dist-tags": {
              latest: "1.0.0"
            }
          }
        )
      )
      .returns(async () => false);

    const route = new PackageAddDistTags(storage.object);

    await route.process(req, res);
    expect(res.statusCode).to.equal(404);
  });
});

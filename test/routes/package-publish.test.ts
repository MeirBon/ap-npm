import "mocha";
import { expect } from "chai";
import * as TypeMoq from "typemoq";

import * as httpMock from "node-mocks-http";
import PackagePublish from "../../src/routes/package-publish";
import Filesystem from "../../src/storage/filesystem";
import Validator from "../../src/util/validator";

describe("routes:package-publish", () => {
  it("should update package.json if no _attachments", async () => {
    const storageProvider = TypeMoq.Mock.ofType<Filesystem>();
    const validator = TypeMoq.Mock.ofType<Validator>();
    const req = httpMock.createRequest({
      params: {
        package: "test"
      },
      body: {}
    });
    let res = httpMock.createResponse();

    storageProvider
      .setup(x => x.updatePackageJson({ name: "test", scope: undefined }, {}))
      .returns(async () => true);

    let route = new PackagePublish(storageProvider.object, validator.object);
    await route.process(req, res);
    expect(res.statusCode).to.equal(200);

    storageProvider
      .setup(x => x.updatePackageJson({ name: "test", scope: undefined }, {}))
      .returns(async () => false);
    route = new PackagePublish(storageProvider.object, validator.object);
    res = httpMock.createResponse();
    await route.process(req, res);
    expect(res.statusCode).to.equal(500);
  });

  it("should publish a package", async () => {
    const storageProvider = TypeMoq.Mock.ofType<Filesystem>();
    const validator = TypeMoq.Mock.ofType<Validator>();
    const body = {
      _attachments: {},
      "dist-tags": {
        latest: "1.0.0"
      }
    };
    const req = httpMock.createRequest({
      params: {
        package: "test"
      },
      body: body
    });
    const res = httpMock.createResponse();

    validator.setup(x => x.hasDistTag({name: "test", scope: undefined}, "latest"))
      .returns(async () => true);
    validator.setup(x => x.isVersionHigher(
      {
        name: "test",
        scope: undefined,
        version: "1.0.0"
      },
      "latest"
    )).returns(async () => true);

    storageProvider
      .setup(x => x.updatePackageJson({ name: "test", scope: undefined }, body))
      .returns(async () => true);
    storageProvider
      .setup(x => x.isPackageAvailable({ name: "test", scope: undefined }))
      .returns(async () => true);
    storageProvider
      .setup(x => x.writePackage({ name: "test", scope: undefined }, body))
      .returns(async () => true);

    const route = new PackagePublish(storageProvider.object, validator.object);
    await route.process(req, res);
    expect(res.statusCode).to.equal(201);
  });

  it("should publish a new package", async () => {
    const storageProvider = TypeMoq.Mock.ofType<Filesystem>();
    const validator = TypeMoq.Mock.ofType<Validator>();
    const body = {
      _attachments: {}
    };
    const req = httpMock.createRequest({
      params: {
        package: "test"
      },
      body: body
    });
    const res = httpMock.createResponse();

    storageProvider
      .setup(x => x.updatePackageJson({ name: "test", scope: undefined }, body))
      .returns(async () => true);
    storageProvider
      .setup(x => x.isPackageAvailable({ name: "test", scope: undefined }))
      .returns(async () => false);
    storageProvider
      .setup(x => x.writeNewPackage({ name: "test", scope: undefined }, body))
      .returns(async () => true);

    const route = new PackagePublish(storageProvider.object, validator.object);
    await route.process(req, res);
    expect(res.statusCode).to.equal(201);
  });

  it("should return a 500 on write error of a new package", async () => {
    const storageProvider = TypeMoq.Mock.ofType<Filesystem>();
    const validator = TypeMoq.Mock.ofType<Validator>();
    const body = {
      _attachments: {}
    };
    const req = httpMock.createRequest({
      params: {
        package: "test"
      },
      body: body
    });
    const res = httpMock.createResponse();

    storageProvider
      .setup(x => x.updatePackageJson({ name: "test", scope: undefined }, body))
      .returns(async () => true);
    storageProvider
      .setup(x => x.isPackageAvailable({ name: "test", scope: undefined }))
      .returns(async () => false);
    storageProvider
      .setup(x => x.writeNewPackage({ name: "test", scope: undefined }, body))
      .returns(async () => false);

    const route = new PackagePublish(storageProvider.object, validator.object);
    await route.process(req, res);
    expect(res.statusCode).to.equal(500);
  });

  it("should return a 400 when no dist-tags are given", async () => {
    const storageProvider = TypeMoq.Mock.ofType<Filesystem>();
    const validator = TypeMoq.Mock.ofType<Validator>();
    const body = {
      _attachments: {}
    };
    const req = httpMock.createRequest({
      params: {
        package: "test"
      },
      body: body
    });
    const res = httpMock.createResponse();

    storageProvider
      .setup(x => x.updatePackageJson({ name: "test", scope: undefined }, body))
      .returns(async () => true);
    storageProvider
      .setup(x => x.isPackageAvailable({ name: "test", scope: undefined }))
      .returns(async () => true);
    storageProvider
      .setup(x => x.writePackage({ name: "test", scope: undefined }, body))
      .returns(async () => true);

    const route = new PackagePublish(storageProvider.object, validator.object);
    await route.process(req, res);
    expect(res.statusCode).to.equal(400);
  });

  it("should return a 400 when version is not higher", async () => {
    const storageProvider = TypeMoq.Mock.ofType<Filesystem>();
    const validator = TypeMoq.Mock.ofType<Validator>();
    const body = {
      _attachments: {},
      "dist-tags": {
        latest: "1.0.0"
      }
    };
    const req = httpMock.createRequest({
      params: {
        package: "test"
      },
      body: body
    });
    const res = httpMock.createResponse();

    validator.setup(x => x.hasDistTag({name: "test", scope: undefined}, "latest"))
      .returns(async () => true);
    validator.setup(x => x.isVersionHigher(
      {
        name: "test",
        scope: undefined,
        version: "1.0.0"
      },
      "latest"
    )).returns(async () => false);

    storageProvider
      .setup(x => x.updatePackageJson({ name: "test", scope: undefined }, body))
      .returns(async () => true);
    storageProvider
      .setup(x => x.isPackageAvailable({ name: "test", scope: undefined }))
      .returns(async () => true);
    storageProvider
      .setup(x => x.writePackage({ name: "test", scope: undefined }, body))
      .returns(async () => true);

    const route = new PackagePublish(storageProvider.object, validator.object);
    await route.process(req, res);
    expect(res.statusCode).to.equal(400);
  });

  it("should return a 400 if hasDistTag returns false", async () => {
    const storageProvider = TypeMoq.Mock.ofType<Filesystem>();
    const validator = TypeMoq.Mock.ofType<Validator>();
    const body = {
      _attachments: {},
      "dist-tags": {
        latest: "1.0.0"
      }
    };
    const req = httpMock.createRequest({
      params: {
        package: "test"
      },
      body: body
    });
    const res = httpMock.createResponse();

    validator.setup(x => x.hasDistTag({name: "test", scope: undefined}, "latest"))
      .returns(async () => false);
    validator.setup(x => x.isVersionHigher(
      {
        name: "test",
        scope: undefined,
        version: "1.0.0"
      },
      "latest"
    )).returns(async () => true);

    storageProvider
      .setup(x => x.updatePackageJson({ name: "test", scope: undefined }, body))
      .returns(async () => true);
    storageProvider
      .setup(x => x.isPackageAvailable({ name: "test", scope: undefined }))
      .returns(async () => true);
    storageProvider
      .setup(x => x.writePackage({ name: "test", scope: undefined }, body))
      .returns(async () => true);

    const route = new PackagePublish(storageProvider.object, validator.object);
    await route.process(req, res);
    expect(res.statusCode).to.equal(400);
  });

  it("should return a 500 if writePackage throws", async () => {
    const storageProvider = TypeMoq.Mock.ofType<Filesystem>();
    const validator = TypeMoq.Mock.ofType<Validator>();
    const body = {
      _attachments: {},
      "dist-tags": {
        latest: "1.0.0"
      }
    };
    const req = httpMock.createRequest({
      params: {
        package: "test"
      },
      body: body
    });
    const res = httpMock.createResponse();

    validator.setup(x => x.hasDistTag({name: "test", scope: undefined}, "latest"))
      .returns(async () => true);
    validator.setup(x => x.isVersionHigher(
      {
        name: "test",
        scope: undefined,
        version: "1.0.0"
      },
      "latest"
    )).returns(async () => true);

    storageProvider
      .setup(x => x.updatePackageJson({ name: "test", scope: undefined }, body))
      .returns(async () => true);
    storageProvider
      .setup(x => x.isPackageAvailable({ name: "test", scope: undefined }))
      .returns(async () => true);
    storageProvider
      .setup(x => x.writePackage({ name: "test", scope: undefined }, body))
      .returns(async () => {
        throw Error();
      });

    const route = new PackagePublish(storageProvider.object, validator.object);
    await route.process(req, res);
    expect(res.statusCode).to.equal(500);
  });
});

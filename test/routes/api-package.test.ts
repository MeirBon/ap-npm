import "mocha";
import { expect } from "chai";
import * as TypeMoq from "typemoq";
import * as httpMocks from "node-mocks-http";
import ApiPackage from "../../src/routes/api-package";
import PackageRepository from "../../src/api/package-repository";
import Package from "../../src/api/entities/package";

describe("routes:api-package", () => {
  it("should return package.json of a single package", async () => {
    const packageRepo = TypeMoq.Mock.ofType<PackageRepository>();
    const pkg = new Package("test", [], {});
    packageRepo
      .setup(x => x.getPackage("test", undefined))
      .returns(async () => {
        return pkg;
      });

    const route = new ApiPackage(packageRepo.object);

    const req = httpMocks.createRequest({
      params: {
        package: "test"
      }
    });

    const res = httpMocks.createResponse();

    await route.process(req, res);
    expect(res.statusCode).to.equal(200);
    expect(res._getData()).to.haveOwnProperty("package");
  });

  it("should return a 404 getPackage throws", async () => {
    const packageRepo = TypeMoq.Mock.ofType<PackageRepository>();
    packageRepo
      .setup(x => x.getPackage("test", undefined))
      .returns(async () => {
        throw Error();
      });

    const route = new ApiPackage(packageRepo.object);

    const req = httpMocks.createRequest({
      params: {
        package: "test"
      }
    });

    const res = httpMocks.createResponse();

    await route.process(req, res);
    expect(res.statusCode).to.equal(404);
  });

  it("should return all packages if no package param given", async () => {
    const packageRepo = TypeMoq.Mock.ofType<PackageRepository>();
    const pkg = new Package("test", [], {});
    packageRepo.setup(x => x.getPackages()).returns(async () => [pkg]);

    const route = new ApiPackage(packageRepo.object);

    const req = httpMocks.createRequest();

    const res = httpMocks.createResponse();

    await route.process(req, res);
    expect(res.statusCode).to.equal(200);
    expect(res._getData()).to.haveOwnProperty("packages");
    Object.keys(pkg.toObject()).forEach((value: string) => {
      expect(res._getData().packages).to.haveOwnProperty(value);
    });
  });

  it("should return 500 if package repository throws", async () => {
    const packageRepo = TypeMoq.Mock.ofType<PackageRepository>();
    const pkg = new Package("test", [], {});
    packageRepo.setup(x => x.getPackages()).returns(async () => { throw Error(); });

    const route = new ApiPackage(packageRepo.object);

    const req = httpMocks.createRequest();

    const res = httpMocks.createResponse();

    await route.process(req, res);
    expect(res.statusCode).to.equal(500);
  });
});

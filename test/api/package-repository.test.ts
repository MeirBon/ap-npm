import "mocha";
import { expect } from "chai";
import * as TypeMoq from "typemoq";
import PackageRepository from "../../src/api/package-repository";
import Filesystem from "../../src/storage/filesystem";
import Package from "../../src/api/entities/package";

describe("api:package-repository", () => {
  it("should return a package", async () => {
    const storage = TypeMoq.Mock.ofType<Filesystem>();
    storage
      .setup(x => x.getPackageJson({ name: "test", scope: "@test" }))
      .returns(async () => {
        return {
          versions: {
            "1.0.0": {}
          }
        };
      });

    const repo = new PackageRepository(storage.object);
    const result = await repo.getPackage("test", "@test");
    expect(result).to.be.instanceOf(Package);
    expect(await result.getName()).to.equal("test");
    expect(await result.getScope()).to.equal("@test");
  });

  it("should return a package listing", async () => {
    const storage = TypeMoq.Mock.ofType<Filesystem>();
    storage.setup(x => x.getPackageListing()).returns(async () => {
      const map = new Map<string, any>();
      map.set("@test", { test: ["1.0.0"] });
      map.set("test", ["1.0.0"]);
      return map;
    });

    storage
      .setup(x => x.getPackageJson({ name: "test", scope: "@test" }))
      .returns(async () => {
        return {
          versions: {
            "1.0.0": {}
          }
        };
      });

    storage.setup(x => x.getPackageJson({ name: "test" })).returns(async () => {
      return {
        versions: {
          "1.0.0": {}
        }
      };
    });

    const repo = new PackageRepository(storage.object);
    const result = await repo.getPackages();
    expect(result.length).to.equal(2);
  });
});

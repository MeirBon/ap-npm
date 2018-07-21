import "mocha";
import * as TypeMoq from "typemoq";
import { expect } from "chai";
import isPackageAvailable from "../../../src/storage/filesystem/utils/is-package-available";
import IFS from "../../../src/storage/filesystem/fs-interface";

describe("storage:filesystem:utils:is-package-available", () => {
  it("should return true when package is available", async () => {
    const fs = TypeMoq.Mock.ofType<IFS>();

    fs.setup(x => x.exists("/a/package.json")).returns(async () => true);
    fs.setup(x => x.exists("\\a\\package.json")).returns(async () => true);

    expect(await isPackageAvailable(fs.object, { name: "a" }, "/")).to.equal(
      true
    );
  });

  it("should return true when scoped package is available", async () => {
    const fs = TypeMoq.Mock.ofType<IFS>();

    fs.setup(x => x.exists("/b/a/package.json")).returns(async () => true);
    fs.setup(x => x.exists("\\b\\a\\package.json")).returns(async () => true);

    expect(
      await isPackageAvailable(fs.object, { name: "a", scope: "b" }, "/")
    ).to.equal(true);
  });

  it("should return false when package is unavailable", async () => {
    const fs = TypeMoq.Mock.ofType<IFS>();

    fs.setup(x => x.exists("/a/package.json")).returns(async () => false);
    fs.setup(x => x.exists("\\a\\package.json")).returns(async () => false);

    expect(await isPackageAvailable(fs.object, { name: "a" }, "/")).to.equal(
      false
    );
  });

  it("should return true when scoped package is unavailable", async () => {
    const fs = TypeMoq.Mock.ofType<IFS>();

    fs.setup(x => x.exists("/b/a/package.json")).returns(async () => false);
    fs.setup(x => x.exists("\\b\\a\\package.json")).returns(async () => false);

    expect(
      await isPackageAvailable(fs.object, { name: "a", scope: "b" }, "/")
    ).to.equal(false);
  });
});

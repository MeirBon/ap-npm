import "mocha";
import * as TypeMoq from "typemoq";
import { expect } from "chai";
import removePackage from "../../../src/storage/filesystem/utils/remove-package";
import IFS from "../../../src/storage/filesystem/fs-interface";

describe("storage:filesystem:utils:remove-package", () => {
  it("should throw when package does not exist", async () => {
    const fs = TypeMoq.Mock.ofType<IFS>();

    fs.setup(x => x.exists("/a/package.json")).returns(async () => false);
    fs.setup(x => x.exists("\\a\\package.json")).returns(async () => false);

    try {
      await removePackage(fs.object, { name: "a" }, "/");
    } catch (err) {
      expect(err.message).to.equal("Package does not exist");
    }
  });

  it("should throw when scoped package does not exist", async () => {
    const fs = TypeMoq.Mock.ofType<IFS>();

    fs.setup(x => x.exists("/b/a/package.json")).returns(async () => false);
    fs.setup(x => x.exists("\\b\\a\\package.json")).returns(async () => false);

    try {
      await removePackage(fs.object, { name: "a", scope: "b" }, "/");
    } catch (err) {
      expect(err.message).to.equal("Package does not exist");
    }
  });

  it("should return true when package exists", async () => {
    const fs = TypeMoq.Mock.ofType<IFS>();

    fs.setup(x => x.exists("/a/package.json")).returns(async () => true);
    fs.setup(x => x.exists("\\a\\package.json")).returns(async () => true);

    expect(await removePackage(fs.object, { name: "a" }, "/")).true;
  });

  it("should return true when scoped package exists", async () => {
    const fs = TypeMoq.Mock.ofType<IFS>();

    fs.setup(x => x.exists("/b/a/package.json")).returns(async () => true);
    fs.setup(x => x.exists("\\b\\a\\package.json")).returns(async () => true);

    expect(await removePackage(fs.object, { name: "a", scope: "b" }, "/")).true;
  });
});

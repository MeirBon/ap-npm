import "mocha";
import * as TypeMoq from "typemoq";
import { expect } from "chai";
import getPackageJson from "../../src/storage/filesystem/utils/get-package-json";
import IFS from "../../src/storage/filesystem/fs-interface";

describe("storage:filesystem:utils:get-package-json", () => {
  it("should throw when package.json does not exist", async () => {
    const fs = TypeMoq.Mock.ofType<IFS>();

    fs.setup(x => x.exists("/a/package.json")).returns(async () => false);
    fs.setup(x => x.exists("\\a\\package.json")).returns(async () => false);

    try {
      await getPackageJson(fs.object, { name: "a" }, "/");
    } catch (err) {
      expect(err.message).to.equal("package.json of a does not exist");
    }
  });

  it("should throw when scoped package.json does not exist", async () => {
    const fs = TypeMoq.Mock.ofType<IFS>();

    fs.setup(x => x.exists("/b/a/package.json")).returns(async () => false);
    fs.setup(x => x.exists("\\b\\a\\package.json")).returns(async () => false);

    try {
      await getPackageJson(fs.object, { name: "a", scope: "b" }, "/");
    } catch (err) {
      expect(err.message).to.equal("package.json of b/a does not exist");
    }
  });

  it("should return parsed package.json", async () => {
    const fs = TypeMoq.Mock.ofType<IFS>();

    fs.setup(x => x.exists("/a/package.json")).returns(async () => true);
    fs.setup(x => x.exists("\\a\\package.json")).returns(async () => true);

    fs.setup(x => x.readFile("/a/package.json")).returns(async () =>
      Buffer.from(`{ "a": "b" }`)
    );
    fs.setup(x => x.readFile("\\a\\package.json")).returns(async () =>
      Buffer.from(`{ "a": "b" }`)
    );

    const result = await getPackageJson(fs.object, { name: "a" }, "/");
    expect(result).to.haveOwnProperty("a");
    expect(result.a).to.equal("b");
  });

  it("should return parsed package.json when scoped", async () => {
    const fs = TypeMoq.Mock.ofType<IFS>();

    fs.setup(x => x.exists("/b/a/package.json")).returns(async () => true);
    fs.setup(x => x.exists("\\b\\a\\package.json")).returns(async () => true);

    fs.setup(x => x.readFile("/b/a/package.json")).returns(async () =>
      Buffer.from(`{ "a": "b" }`)
    );
    fs.setup(x => x.readFile("\\b\\a\\package.json")).returns(async () =>
      Buffer.from(`{ "a": "b" }`)
    );

    const result = await getPackageJson(
      fs.object,
      { name: "a", scope: "b" },
      "/"
    );
    expect(result).to.haveOwnProperty("a");
    expect(result.a).to.equal("b");
  });
});

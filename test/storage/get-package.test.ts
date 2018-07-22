import "mocha";
import * as TypeMoq from "typemoq";
import { expect } from "chai";
import packageGet from "../../src/storage/filesystem/utils/get-package";
import IFS from "../../src/storage/filesystem/fs-interface";

describe("storage:filesystem:utils:get-package", () => {
  it("should throw when no file was given", async () => {
    const fs = TypeMoq.Mock.ofType<IFS>();

    try {
      await packageGet(fs.object, { name: "", scope: "" }, "/");
    } catch (err) {
      expect(err.message).to.equal("No filename given");
    }
  });

  it("should return buffer given by fs", async () => {
    const fs: TypeMoq.IMock<IFS> = TypeMoq.Mock.ofType<IFS>();
    const buffer = Buffer.from("test");

    // *nix
    fs.setup(x => x.readFile("/a/1.0")).returns(
      async (): Promise<Buffer> => {
        return buffer;
      }
    );

    // Windows
    fs.setup(x => x.readFile("\\a\\1.0")).returns(
      async (): Promise<Buffer> => {
        return buffer;
      }
    );

    expect(
      await packageGet(fs.object, { name: "a", file: "1.0" }, "/")
    ).to.equal(buffer);
  });

  it("should return buffer given by fs of scoped package", async () => {
    const fs: TypeMoq.IMock<IFS> = TypeMoq.Mock.ofType<IFS>();
    const buffer = Buffer.from("test");

    // *nix
    fs.setup(x => x.readFile("/b/a/1.0")).returns(
      async (): Promise<Buffer> => {
        return buffer;
      }
    );

    // Windows
    fs.setup(x => x.readFile("\\b\\a\\1.0")).returns(
      async (): Promise<Buffer> => {
        return buffer;
      }
    );

    expect(
      await packageGet(fs.object, { name: "a", scope: "b", file: "1.0" }, "/")
    ).to.equal(buffer);
  });
});

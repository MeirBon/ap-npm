import "mocha";
import * as TypeMoq from "typemoq";
import { expect } from "chai";
import getPackageListing from "../../src/storage/filesystem/utils/get-package-listing";
import IFS from "../../src/storage/filesystem/fs-interface";
import { join } from "path";

describe("storage:filesystem:utils:get-package-listing", () => {
  it("should properly read filesystem and return correct listing", async () => {
    const fs = TypeMoq.Mock.ofType<IFS>();
    fs.setup(x => x.readdir("/")).returns(async () => {
      return ["test", "@test", "@empty"];
    });

    fs.setup(x => x.readdir(join("/", "@test"))).returns(async () => ["test"]);
    fs.setup(x => x.readdir(join("/", "@empty"))).returns(async () => []);
    fs.setup(x => x.readFile(join("/", "test", "package.json"))).returns(async () => {
      return JSON.stringify({
        versions: {
          "1.0.0": {}
        }
      });
    });
    fs.setup(x => x.readFile(join("/", "@test", "test", "package.json"))).returns(async () => {
      return JSON.stringify({
        versions: {
          "1.0.0": {}
        }
      });
    });
    fs.setup(x => x.lstat(join("/", "@test", "test"))).returns(async () => {
      return {
        isFile(): boolean {
          return false;
        },
      isDirectory(): boolean {
          return true;
      },
      isBlockDevice(): boolean {
          return false;
      },
      isCharacterDevice(): boolean {
          return false;
      },
      isSymbolicLink(): boolean {
          return false;
      },
      isFIFO(): boolean {
          return false;
      },
      isSocket(): boolean {
          return false;
      },
      dev: 0,
      ino: 0,
      mode: 0,
      nlink: 0,
      uid: 0,
      gid: 0,
      rdev: 0,
      size: 0,
      blksize: 0,
      blocks: 0,
      atimeMs: 0,
      mtimeMs: 0,
      ctimeMs: 0,
      birthtimeMs: 0,
      atime: new Date(),
      mtime: new Date(),
      ctime: new Date(),
      birthtime: new Date()
      };
    });

    const listing = await getPackageListing(fs.object, "/");
    expect(listing.has("@test")).true;
    expect(listing.has("@empty")).false;
    expect(listing.has("test")).true;
    expect(listing.get("@test")).to.haveOwnProperty("test");
    expect(listing.get("@test").test[0]).to.equal("1.0.0");
    expect(listing.get("test")[0]).to.equal("1.0.0");
  });
});

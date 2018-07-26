import "mocha";
import * as TypeMoq from "typemoq";
import { expect } from "chai";
import Filesystem from "../../src/storage/filesystem";
import IFS from "../../src/storage/filesystem/fs-interface";
import Logger from "../../src/util/logger";
import { join } from "path";

describe("storage:filesystem:index", () => {
  it("should try to create storage directory", async () => {
    const map = new Map<string, any>();
    map.set("workDir", "/");
    map.set("storage", { directory: "a" });

    const fs = TypeMoq.Mock.ofType<IFS>();
    fs.setup(x => x.exists(join("/", "a"))).returns(async () => {
      expect(true);
      return false;
    });
    fs.setup(x => x.createDirectory(join("/", "a"))).returns(async () => {
      expect(true);
    });

    const logger = TypeMoq.Mock.ofType<Logger>();

    new Filesystem(map, logger.object, fs.object);
  });

  it("should not try to create storage location if it exists", async () => {
    const map = new Map<string, any>();
    map.set("workDir", "/");
    map.set("storage", { directory: "a" });

    const fs = TypeMoq.Mock.ofType<IFS>();
    fs.setup(x => x.exists(join("/", "a"))).returns(async () => {
      expect(true);
      return true
    });
    fs.setup(x => x.createDirectory(join("/", "a"))).returns(async () => {
      expect(true);
    });

    const logger = TypeMoq.Mock.ofType<Logger>();

    new Filesystem(map, logger.object, fs.object);
  });

  it("should log if creating directory fails", async () => {
    const map = new Map<string, any>();
    map.set("workDir", "/");
    map.set("storage", { directory: "a" });

    const fs = TypeMoq.Mock.ofType<IFS>();
    fs.setup(x => x.exists(join("/", "a"))).returns(async () => {
      expect(true);
      return false;
    });
    fs.setup(x => x.createDirectory(join("/", "a"))).returns(async () => {
      expect(true);
      throw Error("test");
    });

    const logger = TypeMoq.Mock.ofType<Logger>();
    logger
      .setup(x =>
        x.error(
          "Failed to initialize filesystem-structure in" + join("/", "a"),
          "test"
        )
      )
      .returns(async () => {
        expect(true);
      });

    new Filesystem(map, logger.object, fs.object);
  });
});

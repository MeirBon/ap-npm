import "mocha";
import { expect } from "chai";
import * as TypeMoq from "typemoq";
import storageInit from "../../src/init/storage-init";
import Container from "../../src/util/container";
import Logger from "../../src/util/logger";
import IFS from "../../src/storage/filesystem/fs-interface";
import Filesystem from "../../src/storage/filesystem";
import { join } from "path";
import * as fs from "fs";
import { Buffer } from "buffer";

describe("init:storage", () => {
  it("should init correctly", async () => {
    let container = new Container();
    storageInit(container);

    expect(container.has("storage")).true;
    expect(container.has("storage-filesystem")).true;

    const config = new Map<string, any>();
    const fs = new _testFS(true);

    container.set("fs", fs);
    config.set("workDir", "/");
    config.set("storage", {
      directory: "test"
    });
    container.set("config", config);
    container.set("logger", TypeMoq.Mock.ofType<Logger>(Logger).object);

    expect(container.get("storage")).to.be.instanceof(Filesystem);

    container = new Container();
    storageInit(container);
    fs.bool = false;
    container.set("fs", fs);
    config.set("workDir", "/");
    config.set("storage", {
      directory: "test"
    });
    container.set("config", config);
    container.set("logger", TypeMoq.Mock.ofType<Logger>(Logger).object);
    expect(container.get("storage")).to.be.instanceof(Filesystem);

  });
});

class _testFS implements IFS {
  bool: boolean;

  constructor(bool: boolean) {
    this.bool = bool;
  }

  async access(path: string, mode?: number | string): Promise<void> {
    return;
  }

  async appendFile(
    file: string | number,
    data: any,
    options?: {
      encoding?:
        | "ascii"
        | "base64"
        | "binary"
        | "hex"
        | "ucs2"
        | "utf16le"
        | "utf8";
      mode?: number | string;
      flag?:
        | "r"
        | "r+"
        | "rs"
        | "rs+"
        | "w"
        | "wx"
        | "w+"
        | "wx+"
        | "a"
        | "ax"
        | "a+"
        | "ax+";
    }
  ): Promise<void> {
    return;
  }

  async chmod(path: string, mode: number | string): Promise<void> {
    return;
  }

  async chown(path: string, uid: number, gid: number): Promise<void> {
    return;
  }

  async close(fd: number): Promise<void> {
    return;
  }

  async fchmod(fd: number, mode: number | string): Promise<void> {
    return;
  }

  async fchown(fd: number, uid: number, gid: number): Promise<void> {
    return;
  }

  async fstat(fd: number): Promise<fs.Stats> {
    return TypeMoq.Mock.ofType<fs.Stats>().object;
  }

  async ftruncate(fd: number, len?: number): Promise<void> {
    return;
  }

  async futimes(
    fd: number,
    atime: Date | number,
    mtime: Date | number
  ): Promise<void> {
    return;
  }

  async fsync(fd: number): Promise<void> {
    return;
  }

  async lchmod(path: string, mode: number | string): Promise<void> {
    return;
  }

  async lchown(path: string, uid: number, gid: number): Promise<void> {
    return;
  }

  async link(srcpath: string, dstpath: string): Promise<void> {
    return;
  }

  async lstat(path: string): Promise<fs.Stats> {
    return TypeMoq.Mock.ofType<fs.Stats>().object;
  }

  async mkdir(path: string, mode?: number | string): Promise<void> {
    return;
  }

  async mkdtemp(path: string): Promise<string> {
    return "";
  }

  async open(
    path: string,
    flags:
      | "r"
      | "r+"
      | "rs"
      | "rs+"
      | "w"
      | "wx"
      | "w+"
      | "wx+"
      | "a"
      | "ax"
      | "a+"
      | "ax+",
    mode?: number | string
  ): Promise<number> {
    return 0;
  }

  async read(
    fd: number,
    buffer: Buffer,
    offset: number,
    length: number,
    position: number
  ): Promise<{
    bytesRead: number;
    buffer: Buffer;
  }> {
    return { bytesRead: 0, buffer: new Buffer("") };
  }

  async readdir(path: string): Promise<string[]> {
    return [];
  }

  async readFile(
    file: string | number,
    options?:
      | {
      encoding?:
        | "ascii"
        | "base64"
        | "binary"
        | "hex"
        | "ucs2"
        | "utf16le"
        | "utf8";
      flag?:
        | "r"
        | "r+"
        | "rs"
        | "rs+"
        | "w"
        | "wx"
        | "w+"
        | "wx+"
        | "a"
        | "ax"
        | "a+"
        | "ax+";
    }
      | "ascii"
      | "base64"
      | "binary"
      | "hex"
      | "ucs2"
      | "utf16le"
      | "utf8"
      | "r"
      | "r+"
      | "rs"
      | "rs+"
      | "w"
      | "wx"
      | "w+"
      | "wx+"
      | "a"
      | "ax"
      | "a+"
      | "ax+"
  ): Promise<any> {
    return 0;
  }

  async readlink(path: string): Promise<string> {
    return "";
  }

  async realpath(
    path: string,
    cache?: {
      [path: string]: string;
    }
  ): Promise<string> {
    return "";
  }

  async rename(oldPath: string, newPath: string): Promise<void> {
    return;
  }

  async rmdir(path: string): Promise<void> {
    return;
  }

  async stat(path: string): Promise<fs.Stats> {
    return TypeMoq.Mock.ofType<fs.Stats>().object;
  }

  async symlink(
    srcpath: string,
    dstpath: string,
    type?: string
  ): Promise<void> {
    return;
  }

  async truncate(path: string, len?: number): Promise<void> {
    return;
  }

  async unlink(path: string): Promise<void> {
    return;
  }

  async utimes(
    path: string,
    atime: Date | number,
    mtime: Date | number
  ): Promise<void> {
    return;
  }

  async writeFile(
    file: string | number,
    data: string | any,
    options?:
      | {
      encoding?:
        | "ascii"
        | "base64"
        | "binary"
        | "hex"
        | "ucs2"
        | "utf16le"
        | "utf8";
      flag?:
        | "r"
        | "r+"
        | "rs"
        | "rs+"
        | "w"
        | "wx"
        | "w+"
        | "wx+"
        | "a"
        | "ax"
        | "a+"
        | "ax+";
      mode?: number | string;
    }
      | "ascii"
      | "base64"
      | "binary"
      | "hex"
      | "ucs2"
      | "utf16le"
      | "utf8"
      | "r"
      | "r+"
      | "rs"
      | "rs+"
      | "w"
      | "wx"
      | "w+"
      | "wx+"
      | "a"
      | "ax"
      | "a+"
      | "ax+"
  ): Promise<void> {
    return;
  }

  async readTextFile(
    file: string | number,
    encoding?:
      | "ascii"
      | "base64"
      | "binary"
      | "hex"
      | "ucs2"
      | "utf16le"
      | "utf8",
    flags?:
      | "r"
      | "r+"
      | "rs"
      | "rs+"
      | "w"
      | "wx"
      | "w+"
      | "wx+"
      | "a"
      | "ax"
      | "a+"
      | "ax+"
  ): Promise<string> {
    return "";
  }

  async writeTextFile(
    file: string | number,
    data: string,
    encoding?:
      | "ascii"
      | "base64"
      | "binary"
      | "hex"
      | "ucs2"
      | "utf16le"
      | "utf8",
    flags?:
      | "r"
      | "r+"
      | "rs"
      | "rs+"
      | "w"
      | "wx"
      | "w+"
      | "wx+"
      | "a"
      | "ax"
      | "a+"
      | "ax+",
    mode?: number | string
  ): Promise<void> {
    return;
  }

  async createDirectory(path: string, mode?: number | string): Promise<void> {
    return;
  }

  async del(path: string): Promise<void> {
    return;
  }

  async exists(path: string): Promise<boolean> {
    return this.bool;
  }

  async write(
    fd: number,
    data: any,
    offset?: number,
    encoding?:
      | "ascii"
      | "base64"
      | "binary"
      | "hex"
      | "ucs2"
      | "utf16le"
      | "utf8"
  ): Promise<{ written: number; buffer: Buffer }> {
    return {
      buffer: new Buffer(""),
      written: 0
    };
  }
}

import "mocha";
import { expect } from "chai";
import * as TypeMoq from "typemoq";
import * as fs from "async-file";
import * as axios from "@contentful/axios";
import utilInit from "../../src/init/util-init";
import Container from "../../src/util/container";
import { AuthManager } from "../../src/auth";
import AuthProvider from "../../src/auth/auth-provider";
import IFS from "../../src/storage/filesystem/fs-interface";
import { Buffer } from "buffer";
import Filesystem from "../../lib/src/storage/filesystem";
import Validator from "../../src/util/validator";
import Logger from "../../src/util/logger";
import { join } from "path";

describe("init:util", () => {
  it("should init correctly", async () => {
    let container = new Container();
    utilInit(container);

    expect(container.has("fs")).true;
    expect(container.has("express")).true;
    expect(container.has("validator")).true;
    expect(container.has("auth")).true;
    expect(container.has("auth-adapter")).true;
    expect(container.has("axios")).true;
    expect(container.has("logger")).true;
    expect(container.get("fs")).to.be.a("object");

    const config = new Map<string, any>();
    config.set("auth", {
      adapter: "default"
    });
    config.set("workDir", "/");
    container.set("config", config);
    container.set("fs", new _testFS(true));
    container.set("storage", TypeMoq.Mock.ofType<Filesystem>());

    expect(container.get("express"));
    expect(container.get("validator")).to.be.instanceof(Validator);
    expect(container.get("auth")).to.be.instanceof(AuthManager);
    expect(container.get("auth-adapter")).to.be.instanceof(AuthProvider);
    expect(container.get("axios"));
    expect(container.get("logger")).to.be.instanceof(Logger);

    container = new Container();
    config.set("auth", {
      adapter: join(__dirname, "custom-auth-provider.ts")
    });
    container.set("config", config);
    utilInit(container);
    expect(container.get("auth-adapter")).to.be.instanceof(AuthProvider);
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

import * as fs from "fs";

export default interface IFS {

  access(path: string, mode?: number | string): Promise<void>;

  appendFile(file: string | number, data: any, options?: {
    encoding?: "ascii" | "base64" | "binary" | "hex" | "ucs2" | "utf16le" | "utf8";
    mode?: number | string;
    flag?: "r" | "r+" | "rs" | "rs+" | "w" | "wx" | "w+" | "wx+" | "a" | "ax" | "a+" | "ax+";
  }): Promise<void>;

  chmod(path: string, mode: number | string): Promise<void>;

  chown(path: string, uid: number, gid: number): Promise<void>;

  close(fd: number): Promise<void>;

  fchmod(fd: number, mode: number | string): Promise<void>;

  fchown(fd: number, uid: number, gid: number): Promise<void>;

  fstat(fd: number): Promise<fs.Stats>;

  ftruncate(fd: number, len?: number): Promise<void>;

  futimes(fd: number, atime: Date | number, mtime: Date | number): Promise<void>;

  fsync(fd: number): Promise<void>;

  lchmod(path: string, mode: number | string): Promise<void>;

  lchown(path: string, uid: number, gid: number): Promise<void>;

  link(srcpath: string, dstpath: string): Promise<void>;

  lstat(path: string): Promise<fs.Stats>;

  mkdir(path: string, mode?: number | string): Promise<void>;

  mkdtemp(path: string): Promise<string>;

  open(path: string, flags: "r" | "r+" | "rs" | "rs+" | "w" | "wx" | "w+" | "wx+" | "a" | "ax" | "a+" | "ax+", mode?: number | string): Promise<number>;

  read(fd: number, buffer: Buffer, offset: number, length: number, position: number): Promise<{
    bytesRead: number;
    buffer: Buffer;
  }>;

  readdir(path: string): Promise<string[]>;

  readFile(file: string | number, options?: {
    encoding?: "ascii" | "base64" | "binary" | "hex" | "ucs2" | "utf16le" | "utf8";
    flag?: "r" | "r+" | "rs" | "rs+" | "w" | "wx" | "w+" | "wx+" | "a" | "ax" | "a+" | "ax+";
  } | "ascii" | "base64" | "binary" | "hex" | "ucs2" | "utf16le" | "utf8" | "r" | "r+" | "rs" | "rs+" | "w" | "wx" | "w+" | "wx+" | "a" | "ax" | "a+" | "ax+"): Promise<any>;

  readlink(path: string): Promise<string>;

  realpath(path: string, cache?: {
    [path: string]: string;
  }): Promise<string>;

  rename(oldPath: string, newPath: string): Promise<void>;

  rmdir(path: string): Promise<void>;

  stat(path: string): Promise<fs.Stats>;

  symlink(srcpath: string, dstpath: string, type?: string): Promise<void>;

  truncate(path: string, len?: number): Promise<void>;

  unlink(path: string): Promise<void>;

  utimes(path: string, atime: Date | number, mtime: Date | number): Promise<void>;

  write(fd: number, data: any, offset?: number, encoding?: "ascii" | "base64" | "binary" | "hex" | "ucs2" | "utf16le" | "utf8"): Promise<{
    written: number;
    buffer: Buffer;
  }>;

  writeFile(file: string | number, data: string | any, options?: {
    encoding?: "ascii" | "base64" | "binary" | "hex" | "ucs2" | "utf16le" | "utf8";
    flag?: "r" | "r+" | "rs" | "rs+" | "w" | "wx" | "w+" | "wx+" | "a" | "ax" | "a+" | "ax+";
    mode?: number | string;
  } | "ascii" | "base64" | "binary" | "hex" | "ucs2" | "utf16le" | "utf8" | "r" | "r+" | "rs" | "rs+" | "w" | "wx" | "w+" | "wx+" | "a" | "ax" | "a+" | "ax+"): Promise<void>;

  readTextFile(file: string | number, encoding?: "ascii" | "base64" | "binary" | "hex" | "ucs2" | "utf16le" | "utf8", flags?: "r" | "r+" | "rs" | "rs+" | "w" | "wx" | "w+" | "wx+" | "a" | "ax" | "a+" | "ax+"): Promise<string>;

  writeTextFile(file: string | number, data: string, encoding?: "ascii" | "base64" | "binary" | "hex" | "ucs2" | "utf16le" | "utf8", flags?: "r" | "r+" | "rs" | "rs+" | "w" | "wx" | "w+" | "wx+" | "a" | "ax" | "a+" | "ax+", mode?: number | string): Promise<void>;

  createDirectory(path: string, mode?: number | string): Promise<void>;

  del(path: string): Promise<void>;

  exists(path: string): Promise<boolean>;
}

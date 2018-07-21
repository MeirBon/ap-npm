import "mocha";
import * as TypeMoq from "typemoq";
import { expect } from "chai";
import removePackageVersion from "../../../src/storage/filesystem/utils/remove-package-version";
import IFS from "../../../src/storage/filesystem/fs-interface";
import { IRequest } from "../../../src";

describe("storage:filesystem:utils:get-package", () => {
  it("should throw when version does not exist", async () => {
    const fs = TypeMoq.Mock.ofType<IFS>();

    fs.setup(x => x.exists("/a/a1.0.tgz")).returns(async () => false);
    fs.setup(x => x.exists("\\a\\a1.0.tgz")).returns(async () => false);

    try {
      await removePackageVersion(
        fs.object,
        { name: "a", version: "1.0" },
        "/",
        (request: IRequest) => {},
        (request: IRequest) => {},
        (request: IRequest) => {}
      );
    } catch (err) {
      expect(err.message).to.equal("Version does not exist");
    }
  });

  it("should throw when scoped version does not exist", async () => {
    const fs = TypeMoq.Mock.ofType<IFS>();

    fs.setup(x => x.exists("/b/a/a1.0.tgz")).returns(async () => false);
    fs.setup(x => x.exists("\\b\\a\\a-.0.tgz")).returns(async () => false);

    try {
      await removePackageVersion(
        fs.object,
        { name: "a", scope: "b", version: "1.0" },
        "/",
        (request: IRequest) => {},
        (request: IRequest) => {},
        (request: IRequest) => {}
      );
    } catch (err) {
      expect(err.message).to.equal("Version does not exist");
    }
  });

  it("should remove package if version was last", async () => {
    const fs = TypeMoq.Mock.ofType<IFS>();

    fs.setup(x => x.exists("/a/a1.0.tgz")).returns(async () => true);
    fs.setup(x => x.exists("\\a\\a1.0.tgz")).returns(async () => true);
    fs.setup(x => x.unlink("/a/a1.0.tgz")).returns(async () => {});
    fs.setup(x => x.unlink("\\a\\a1.0.tgz")).returns(async () => {});

    let called = false;

    await removePackageVersion(
      fs.object,
      { name: "a", version: "1.0" },
      "/",
      (request: IRequest) => {
        return {
          versions: {
            "1.0": {}
          },
          "dist-tags": {
            latest: "1.0"
          }
        };
      },
      (request: IRequest) => {
        called = true;
      },
      (request: IRequest) => {}
    );

    expect(called).true;
  });

  it("should remove scoped package if version was last", async () => {
    const fs = TypeMoq.Mock.ofType<IFS>();

    fs.setup(x => x.exists("/b/a/a1.0.tgz")).returns(async () => true);
    fs.setup(x => x.exists("\\b\\a\\a1.0.tgz")).returns(async () => true);
    fs.setup(x => x.unlink("/b/a/a1.0.tgz")).returns(async () => {});
    fs.setup(x => x.unlink("\\b\\a\\a1.0.tgz")).returns(async () => {});

    let called = false;

    await removePackageVersion(
      fs.object,
      { name: "a", scope: "b", version: "1.0" },
      "/",
      (request: IRequest) => {
        return {
          versions: {
            "1.0": {}
          },
          "dist-tags": {
            latest: "1.0"
          }
        };
      },
      (request: IRequest) => {
        called = true;
      },
      (request: IRequest) => {}
    );

    expect(called).true;
  });

  it("should remove package version", async () => {
    const fs = TypeMoq.Mock.ofType<IFS>();

    fs.setup(x => x.exists("/a/a1.0.tgz")).returns(async () => true);
    fs.setup(x => x.exists("\\a\\a1.0.tgz")).returns(async () => true);
    fs.setup(x => x.unlink("/a/a1.0.tgz")).returns(async () => {});
    fs.setup(x => x.unlink("\\a\\a1.0.tgz")).returns(async () => {});

    let called = false;

    await removePackageVersion(
      fs.object,
      { name: "a", version: "1.0" },
      "/",
      (request: IRequest) => {
        return {
          versions: {
            "1.0": {},
            "0.9.0": {},
            "0.9.1": {}
          },
          "dist-tags": {
            latest: "1.0"
          }
        };
      },
      (request: IRequest) => {
        called = true;
      },
      (request: IRequest, data: any) => {
        expect(data).to.haveOwnProperty("versions");
        expect(data.versions).to.not.haveOwnProperty("1.0");
        expect(data.versions).to.haveOwnProperty("0.9.0");
        expect(data.versions).to.haveOwnProperty("0.9.1");
        expect(data).to.haveOwnProperty("dist-tags");
        expect(data["dist-tags"].latest).to.equal("0.9.1");
      }
    );

    expect(called).false;
  });

  it("should remove scoped package version", async () => {
    const fs = TypeMoq.Mock.ofType<IFS>();

    fs.setup(x => x.exists("/b/a/a1.0.tgz")).returns(async () => true);
    fs.setup(x => x.exists("\\b\\a\\a1.0.tgz")).returns(async () => true);
    fs.setup(x => x.unlink("/b/a/a1.0.tgz")).returns(async () => {});
    fs.setup(x => x.unlink("\\b\\a\\a1.0.tgz")).returns(async () => {});

    let called = false;

    await removePackageVersion(
      fs.object,
      { name: "a", scope: "b", version: "1.0" },
      "/",
      (request: IRequest) => {
        return {
          versions: {
            "1.0": {},
            "0.9.0": {},
            "0.9.1": {}
          },
          "dist-tags": {
            latest: "1.0"
          }
        };
      },
      (request: IRequest) => {
        called = true;
      },
      (request: IRequest, data: any) => {
        expect(data).to.haveOwnProperty("versions");
        expect(data.versions).to.not.haveOwnProperty("1.0");
        expect(data.versions).to.haveOwnProperty("0.9.0");
        expect(data.versions).to.haveOwnProperty("0.9.1");
        expect(data).to.haveOwnProperty("dist-tags");
        expect(data["dist-tags"].latest).to.equal("0.9.1");
      }
    );

    expect(called).false;
  });
});

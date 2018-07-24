import "mocha";
import * as TypeMoq from "typemoq";
import { expect } from "chai";
import writeNewPackage from "../../src/storage/filesystem/utils/write-new-package";
import IFS from "../../src/storage/filesystem/fs-interface";
import Logger from "../../src/util/logger";
import { join } from "path";

describe("storage:filesystem:utils:write-new-package", () => {
  it("should return false when fs throws on package.json throw", async () => {
    const fs = TypeMoq.Mock.ofType<IFS>();
    const logger = TypeMoq.Mock.ofType<Logger>();
    const packageData = {
      versions: {
        "1.0.0": {}
      },
      _attachments: {
        "file": {
          data: (Buffer.from("test")).toString("base64")
        }
      },
      "dist-tags": {
        latest: "1.0.0"
      }
    };

    const packageJson = JSON.stringify({
      versions: {
        "1.0.0": {}
      },
      "dist-tags": {
        latest: "1.0.0"
      }
    });

    fs.setup(x => x.writeFile(join("/", "a", "package.json"), packageJson)).returns(
      async () => {
        throw Error();
      }
    );

    expect(await writeNewPackage(fs.object, {
      name: "a",
      version: "1.0.0"
    }, packageData, "/", logger.object)).false;
  });

  it("should return false when fs throws", async () => {
    const fs = TypeMoq.Mock.ofType<IFS>();
    const logger = TypeMoq.Mock.ofType<Logger>();
    const packageData = {
      versions: {
        "1.0.0": {}
      },
      _attachments: {
        "file": {
          data: (Buffer.from("test")).toString("base64")
        }
      },
      "dist-tags": {
        latest: "1.0.0"
      }
    };

    fs.setup(x => x.writeFile(join("/", "a", "a-1.0.0.tgz"),
      Buffer.from(packageData._attachments.file.data, "base64"), { mode: "0777" }))
      .returns(async () => {
          throw Error();
        }
      );

    expect(await writeNewPackage(fs.object, {
      name: "a",
      version: "1.0.0"
    }, packageData, "/", logger.object)).false;
  });

  it("should pick highest available version", async () => {
    const fs = TypeMoq.Mock.ofType<IFS>();
    const logger = TypeMoq.Mock.ofType<Logger>();
    const packageData = {
      versions: {
        "1.0.0": {},
        "1.1.0": {}
      },
      _attachments: {
        "file": {
          data: (Buffer.from("test")).toString("base64")
        }
      },
      "dist-tags": {
        latest: "1.0.0"
      }
    };

    let called = false;

    fs.setup(x => x.writeFile(join("/", "a", "a-1.1.0.tgz"),
      Buffer.from(packageData._attachments.file.data, "base64"), { mode: "0777" }))
      .returns(async () => {
          called = true;
        }
      );

    await writeNewPackage(fs.object, {
      name: "a",
      version: "1.0.0"
    }, packageData, "/", logger.object);
    expect(called).true;
  });

  it("should throw on invalid attachment", async () => {
    const fs = TypeMoq.Mock.ofType<IFS>();
    const logger = TypeMoq.Mock.ofType<Logger>();
    const packageData = {
      versions: {
        "1.0.0": {}
      },
      _attachments: {},
      "dist-tags": {
        latest: "1.0.0"
      }
    };

    try {
      await writeNewPackage(fs.object, {
        name: "a",
        version: "1.0.0"
      }, packageData, "/", logger.object);
    } catch (err) {
      expect(err.message).to.equal("Invalid attachment");
    }
  });

  it("should throw on invalid attachment", async () => {
    const fs = TypeMoq.Mock.ofType<IFS>();
    const logger = TypeMoq.Mock.ofType<Logger>();
    const packageData = {
      versions: {},
      _attachments: {
        "file": {
          data: (Buffer.from("test")).toString("base64")
        }
      },
      "dist-tags": {
        latest: "1.0.0"
      }
    };

    try {
      await writeNewPackage(fs.object, {
        name: "a",
        version: "1.0.0"
      }, packageData, "/", logger.object);
    } catch (err) {
      expect(err.message).to.equal("Invalid version");
    }
  });

  it("should correctly write a package", async () => {
    const fs = TypeMoq.Mock.ofType<IFS>();
    const logger = TypeMoq.Mock.ofType<Logger>();
    const packageData = {
      versions: {
        "1.0.0": {}
      },
      _attachments: {
        "file": {
          data: (Buffer.from("test")).toString("base64")
        }
      },
      "dist-tags": {
        latest: "1.0.0"
      }
    };

    fs.setup(x => x.readFile(join("/", "a", "package.json"))).returns(async () => {
      return JSON.stringify({
        versions: {
          "0.9.0": {}
        },
        "dist-tags": {
          latest: "0.9.0"
        }
      });
    });

    let called = false;
    logger.setup(x => x.info("Published package: a")).returns(() => {
      called = true;
    });

    expect(await
      writeNewPackage(fs.object, {
        name: "a",
        version: "1.0.0"
      }, packageData, "/", logger.object)
    ).true;
    expect(called).true;
  });

  it("should correctly write a scoped package", async () => {
    const fs = TypeMoq.Mock.ofType<IFS>();
    const logger = TypeMoq.Mock.ofType<Logger>();
    const packageData = {
      versions: {
        "1.0.0": {}
      },
      _attachments: {
        "file": {
          data: (Buffer.from("test")).toString("base64")
        }
      },
      "dist-tags": {
        latest: "1.0.0"
      }
    };

    fs.setup(x => x.readFile(join("/", "b", "a", "package.json"))).returns(async () => {
      return JSON.stringify({
        versions: {
          "0.9.0": {}
        },
        "dist-tags": {
          latest: "0.9.0"
        }
      });
    });

    let called = false;
    logger.setup(x => x.info("Published package: b/a")).returns(() => {
      called = true;
    });

    let writeCalled = false;
    fs.setup(x => x.writeFile(join("/", "b", "a", "a-1.0.0.tgz"),
      Buffer.from(packageData._attachments.file.data, "base64"), { mode: "0777" })).returns(
      async () => {
        writeCalled = true;
      }
    );

    expect(await
      writeNewPackage(fs.object, {
        name: "a",
        scope: "b",
        version: "1.0.0"
      }, packageData, "/", logger.object)
    ).true;
    expect(called).true;
    expect(writeCalled).true;
  });
});

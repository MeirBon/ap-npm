import "mocha";
import * as TypeMoq from "typemoq";
import { expect } from "chai";
import writePackage from "../../src/storage/filesystem/utils/write-package";
import IFS from "../../src/storage/filesystem/fs-interface";
import Logger from "../../src/util/logger";
import { join } from "path";

describe("storage:filesystem:utils:write-package", () => {
  it("should return false when fs throws", async () => {
    const fs = TypeMoq.Mock.ofType<IFS>();
    const logger = TypeMoq.Mock.ofType<Logger>();
    const packageData = {
      versions: {
        "1.0.0": {}
      },
      _attachments: {
        "file": (Buffer.from("test")).toString("base64")
      },
      "dist-tags": {
        latest: "1.0.0"
      }
    };

    fs.setup(x => x.readFile(join("/", "a", "package.json"))).returns(async () => {
      throw Error();
    });

    fs.setup(x => x.writeFile(join("/", "a", "package.json"), "{\"a\":\"b\"}")).returns(
      async () => {
        throw Error();
      }
    );

    expect(await writePackage(fs.object, {
      name: "a",
      version: "1.0.0"
    }, packageData, "/", logger.object)).false;
  });

  it("should throw on invalid new version", async () => {
    const fs = TypeMoq.Mock.ofType<IFS>();
    const logger = TypeMoq.Mock.ofType<Logger>();
    const packageData = {
      versions: {
        "1,0,0": {}
      },
      _attachments: {
        "file": (Buffer.from("test")).toString("base64")
      },
      "dist-tags": {
        latest: "1,0,0"
      }
    };

    fs.setup(x => x.readFile(join("/", "a", "package.json"))).returns(async () => {
      return JSON.stringify({
        versions: {
          "0.9.0": {}
        },
        _attachments: {},
        "dist-tags": {
          latest: "0.9.0"
        }
      });
    });

    try {
      await writePackage(fs.object, {
        name: "a",
        version: "1.0.0"
      }, packageData, "/", logger.object);
    } catch (err) {
      expect(err.message).to.equal("Invalid new version");
    }
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

    fs.setup(x => x.readFile(join("/", "a", "package.json"))).returns(async () => {
      return JSON.stringify({
        versions: {
          "0.9.0": {}
        },
        _attachments: {},
        "dist-tags": {
          latest: "0.9.0"
        }
      });
    });

    try {
      await writePackage(fs.object, {
        name: "a",
        version: "1.0.0"
      }, packageData, "/", logger.object);
    } catch (err) {
      expect(err.message).to.equal("Invalid attachment-name or new-version");
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

    fs.setup(x => x.readFile(join("/", "a", "package.json"))).returns(async () => {
      return JSON.stringify({
        versions: {
          "0.9.0": {}
        },
        _attachments: {},
        "dist-tags": {
          latest: "0.9.0"
        }
      });
    });

    try {
      await writePackage(fs.object, {
        name: "a",
        version: "1.0.0"
      }, packageData, "/", logger.object);
    } catch (err) {
      expect(err.message).to.equal("Invalid attachment-name or new-version");
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

    fs.setup(x => x.writeFile(join("/", "a", "package.json"), "{\"a\":\"b\"}")).returns(
      async () => {
      }
    );

    fs.setup(x => x.writeFile(join("/", "a", "a-1.0.0.tgz"),
      Buffer.from(packageData._attachments.file.data, "base64"), { mode: "0777" })).returns(
      async () => {
      }
    );

    let called = false;
    logger.setup(x => x.info("Published new package: a")).returns(() => {
      called = true;
    });

    expect(await
      writePackage(fs.object, {
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

    fs.setup(x => x.writeFile(join("/", "b", "a", "package.json"), "{\"a\":\"b\"}")).returns(
      async () => {
      }
    );

    fs.setup(x => x.writeFile(join("/", "b", "a", "a-1.0.0.tgz"),
      Buffer.from(packageData._attachments.file.data, "base64"), { mode: "0777" })).returns(
      async () => {
      }
    );

    let called = false;
    logger.setup(x => x.info("Published new package: b/a")).returns(() => {
      called = true;
    });

    expect(await
      writePackage(fs.object, {
        name: "a",
        scope: "b",
        version: "1.0.0"
      }, packageData, "/", logger.object)
    ).true;
    expect(called).true;
  });

  it("should return false on writing error", async () => {
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

    fs.setup(x => x.writeFile(join("/", "b", "a", "package.json"), "{\"a\":\"b\"}")).returns(
      async () => {
        throw Error();
      }
    );

    fs.setup(x => x.writeFile(join("/", "b", "a", "a-1.0.0.tgz"),
      Buffer.from(packageData._attachments.file.data, "base64"), { mode: "0777" })).returns(
      async () => {
        throw Error();
      }
    );

    expect(await
      writePackage(fs.object, {
        name: "a",
        scope: "b",
        version: "1.0.0"
      }, packageData, "/", logger.object)
    ).false;
  });
});

import "mocha";
import { expect } from "chai";
import Validator from "../../../src/util/validator";
import * as TypeMoq from "typemoq";
import Filesystem from "../../../src/storage/filesystem";

describe("utils:validator", () => {
  it("should return true on valid higher version", async () => {
    const request = {
      name: "test",
      version: "1.0.0"
    };
    const config = new Map<string, any>([
      ["workDir", "/"],
      ["storage", { directory: "" }]
    ]);
    const storage = TypeMoq.Mock.ofType<Filesystem>(Filesystem,
      undefined,
      undefined,
      config
    );
    storage.setup(x => x.getPackageJson(request)).returns(async () => {
      return {
        "dist-tags": {
          latest: "0.9.0"
        }
      };
    });

    const validator = new Validator(storage.object);

    expect(await validator.isVersionHigher({
      name: request.name,
      version: "1.0.0"
    }, "latest")).true;
  });

  it("should return false on invalid higher version", async () => {
    const request = {
      name: "test",
      scope: "test",
      version: "1.0.0"
    };

    const config = new Map<string, any>([
      ["workDir", "/"],
      ["storage", { directory: "" }]
    ]);

    const storage = TypeMoq.Mock.ofType<Filesystem>(Filesystem, undefined, undefined, config);
    storage.setup(x => x.getPackageJson(request)).returns(async () => {
      return {
        "dist-tags": {
          latest: "1.1.0"
        }
      };
    });

    const validator = new Validator(storage.object);

    expect(await validator.isVersionHigher(request, "latest")).false;
  });

  it("should throw on no given version", async () => {
    const request = {
      name: "test"
    };

    const config = new Map<string, any>([
      ["workDir", "/"],
      ["storage", { directory: "" }]
    ]);

    const storage = TypeMoq.Mock.ofType<Filesystem>(Filesystem, undefined, undefined, config);

    const validator = new Validator(storage.object);

    try {
      await validator.isVersionHigher(request, "test");
    } catch (err) {
      expect(err.message).to.equal("No version given to check");
    }
  });

  it("should check for dist-tags", async () => {
    const request = {
      name: "test",
      version: "1.0.0"
    };

    const config = new Map<string, any>([
      ["workDir", "/"],
      ["storage", { directory: "" }]
    ]);

    const storage = TypeMoq.Mock.ofType<Filesystem>(Filesystem, undefined, undefined, config);
    storage.setup(x => x.getPackageJson(request)).returns(async () => {
      return {
        "dist-tags": {
          latest: "1.1.0"
        }
      };
    });

    const validator = new Validator(storage.object);

    expect(await validator.hasDistTag(request, "latest")).true;
    expect(await validator.hasDistTag(request, "test")).false;
  });
});

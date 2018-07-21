import "mocha";
import * as TypeMoq from "typemoq";
import { expect } from "chai";
import updatePackageJson from "../../../src/storage/filesystem/utils/update-packagejson";
import IFS from "../../../src/storage/filesystem/fs-interface";

describe("storage:filesystem:utils:update-package-json", () => {
  it("should return false when fs throws", async () => {
    const fs = TypeMoq.Mock.ofType<IFS>();
    fs.setup(x => x.writeFile("/a/package.json", '{"a":"b"}')).returns(
      async () => {
        throw Error();
      }
    );
    fs.setup(x => x.writeFile("\\a\\package.json", '{"a":"b"}')).returns(
      async () => {
        throw Error();
      }
    );

    expect(await updatePackageJson(fs.object, { name: "a" }, { a: "b" }, "/"))
      .false;
  });

  it("should return false when fs throws on scoped package", async () => {
    const fs = TypeMoq.Mock.ofType<IFS>();
    fs.setup(x => x.writeFile("/b/a/package.json", '{"a":"b"}')).returns(
      async () => {
        throw Error();
      }
    );
    fs.setup(x => x.writeFile("\\b\\a\\package.json", '{"a":"b"}')).returns(
      async () => {
        throw Error();
      }
    );

    expect(
      await updatePackageJson(
        fs.object,
        { name: "a", scope: "b" },
        { a: "b" },
        "/"
      )
    ).false;
  });

  it("should return true when write was successful", async () => {
    const fs = TypeMoq.Mock.ofType<IFS>();
    fs.setup(x => x.writeFile("/a/package.json", '{"a":"b"}')).returns(
      async () => {}
    );
    fs.setup(x => x.writeFile("\\a\\package.json", '{"a":"b"}')).returns(
      async () => {}
    );

    expect(await updatePackageJson(fs.object, { name: "a" }, { a: "b" }, "/"))
      .true;
  });

  it("should return true when scoped write was successful", async () => {
    const fs = TypeMoq.Mock.ofType<IFS>();
    fs.setup(x => x.writeFile("/b/a/package.json", '{"a":"b"}')).returns(
      async () => {}
    );
    fs.setup(x => x.writeFile("\\b\\a/package.json", '{"a":"b"}')).returns(
      async () => {}
    );

    expect(
      await updatePackageJson(
        fs.object,
        { name: "a", scope: "b" },
        { a: "b" },
        "/"
      )
    ).true;
  });
});

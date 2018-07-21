import "mocha";
import * as TypeMoq from "typemoq";
import { expect } from "chai";
import writePackage from "../../../src/storage/filesystem/utils/write-package";
import IFS from "../../../src/storage/filesystem/fs-interface";
import WriteStream = NodeJS.WriteStream;
import Logger from "../../../src/util/logger";

describe("storage:filesystem:utils:write-package", () => {
  it("should return false when fs throws", async () => {
    const fs = TypeMoq.Mock.ofType<IFS>();
    const stream = TypeMoq.Mock.ofType<WriteStream>();
    const logger = new Logger(stream.object);

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
  });
});

import "mocha";
import { expect } from "chai";
import { sha512 } from "js-sha512";
import * as TypeMoq from "typemoq";
import JsonProvider from "../../src/auth/json-provider";
import IFS from "../../src/storage/filesystem/fs-interface";
import { join } from "path";

describe("auth:json-provider", () => {
  it("init correctly", async () => {
    const config = new Map<string, any>();
    config.set("workDir", "/");
    config.set("auth", { register: true, remove: true });
    const fs = TypeMoq.Mock.ofType<IFS>();

    const location = join("/", "db");
    const userDb = join(location, "user_db.json");
    const userTokenDb = join(location, "user_tokens.json");

    let created = false;
    fs.setup(x => x.exists(location)).returns(async () => false);
    fs.setup(x => x.createDirectory(location)).returns(async () => {
      created = true;
    });

    fs.setup(x => x.readFile(userDb)).returns(async () => {
      return JSON.stringify({
        test: {
          username: "test",
          password: sha512("test"),
          email: ""
        }
      });
    });
    fs.setup(x => x.readFile(userTokenDb)).returns(async () => {
      return {
        token: "test"
      };
    });

    const jsonProvider = new JsonProvider(config, fs.object);
    await jsonProvider.storageInit();

    expect(await jsonProvider.userLogin("test", "test")).to.be.a("string");
    expect(await jsonProvider.userAdd("test2", "test", "")).to.be.a("string");
    expect(await jsonProvider.userRemove("test", "test")).true;
    expect(await jsonProvider.userLogout("token")).true;
    expect(created).true;
  });
});

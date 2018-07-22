import "mocha";
import { expect } from "chai";
import Package from "../../../src/api/entities/package";
import { Md5 } from "ts-md5";

describe("api:entities:package", () => {
  it("should work without scope", async () => {
    const pkg = new Package("test", [], {});
    expect(await pkg.getName()).to.equal("test");
    expect(await pkg.getScope()).to.equal(undefined);
    expect(pkg.entityIdentifier).to.equal("package");

    const object = await pkg.toObject();

    expect(object.id).to.equal(Md5.hashStr("test"));
    expect(object).to.haveOwnProperty("id");
    expect(object).to.haveOwnProperty("name");
    expect(object).to.haveOwnProperty("scope");
    expect(object).to.haveOwnProperty("versions");
    expect(object).to.haveOwnProperty("packageJson");
  });

  it("should work with scope", async () => {
    const pkg = new Package("test", [], {}, "test");
    expect(await pkg.getName()).to.equal("test");
    expect(await pkg.getScope()).to.equal("test");
    expect(pkg.entityIdentifier).to.equal("package");

    const object = await pkg.toObject();

    expect(object.id).to.equal(Md5.hashStr("test/test"));
    expect(object).to.haveOwnProperty("id");
    expect(object).to.haveOwnProperty("name");
    expect(object).to.haveOwnProperty("scope");
    expect(object).to.haveOwnProperty("versions");
    expect(object).to.haveOwnProperty("packageJson");
  });
});

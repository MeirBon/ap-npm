import "mocha";
import { expect } from "chai";
import storageInit from "../../src/init/storage-init";
import Container from "../../src/util/container";

describe("init:storage", () => {
  it("should init correctly", async () => {
    const container = new Container();
    storageInit(container);

    expect(container.has("storage")).true;
    expect(container.has("storage-filesystem")).true;
  });
});

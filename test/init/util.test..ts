import "mocha";
import { expect } from "chai";
import utilInit from "../../src/init/util-init";
import Container from "../../src/util/container";

describe("init:util", () => {
  it("should init correctly", async () => {
    const container = new Container();
    utilInit(container);

    expect(container.has("fs")).true;
    expect(container.has("express")).true;
    expect(container.has("validator")).true;
    expect(container.has("auth")).true;
    expect(container.has("auth-adapter")).true;
    expect(container.has("axios")).true;
    expect(container.has("logger")).true;
  });
});

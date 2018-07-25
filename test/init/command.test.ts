import "mocha";
import { expect } from "chai";
import * as TypeMoq from "typemoq";
import commandInit from "../../src/init/command-init";
import Container from "../../src/util/container";
import ServeCommand from "../../src/commands/serve";
import InitCommand from "../../src/commands/init";
import Logger from "../../src/util/logger";
import { Express } from "express";

describe("init:command", () => {
  it("should init correctly", async () => {
    const container = new Container();
    commandInit(container);

    expect(container.has("command-serve")).true;
    expect(container.has("command-init")).true;

    const config = new Map<string, any>();
    config.set("ssl", {});
    container.set("config", config);
    container.set("logger", TypeMoq.Mock.ofType<Logger>());
    container.set("express", TypeMoq.Mock.ofType<Express>());
    expect(container.get("command-serve"))
      .to.be.instanceOf(ServeCommand);
    expect(container.get("command-init"))
      .to.be.instanceOf(InitCommand);
  });
});

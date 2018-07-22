import "mocha";
import { expect } from "chai";
import Container from "../../src/util/container";

describe("utils:container", () => {
  it("should set and get a variable", async () => {
    const container = new Container();
    container.set("a", "b");
    expect(container.get("a")).to.equal("b");
  });

  it("should set and get a callable", async () => {
    const container = new Container();
    container.set("a", () => "b");
    expect(container.get("a")).to.equal("b");
  });

  it("should return same object in every call", async () => {
    const container = new Container();
    container.set("a", () => "b");
    expect(container.get("a")).to.equal("b");
    expect(container.get("a")).to.equal("b");
  });

  it("should throw error when service does not exist", async () => {
    const container = new Container();
    try {
      container.get("a");
    } catch (err) {
      expect(err.message).to.equal("Cannot find service: a");
    }
  });

  it("should correctly return whether container has service", async () => {
    const container = new Container();
    container.set("a", "b");
    expect(container.has("a")).true;
  });
});

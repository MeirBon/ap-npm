import "mocha";
import { expect } from "chai";
import routesInit from "../../src/init/routes-init";
import Container from "../../src/util/container";

describe("init:routes", () => {
  it("should init correctly", async () => {
    const container = new Container();
    routesInit(container);

    expect(container.has("route-package-get-json")).true;
    expect(container.has("route-package-publish")).true;
    expect(container.has("route-package-get")).true;
    expect(container.has("route-package-delete")).true;
    expect(container.has("route-package-get-dist-tags")).true;
    expect(container.has("route-package-delete-dist-tags")).true;
    expect(container.has("route-package-add-dist-tags")).true;
    expect(container.has("route-search")).true;
    expect(container.has("route-package-proxy")).true;
    expect(container.has("route-audit-proxy")).true;
  });
});

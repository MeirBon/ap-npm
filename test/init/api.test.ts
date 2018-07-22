import "mocha";
import { expect } from "chai";
import apiInit from "../../src/init/api-init";
import Container from "../../src/util/container";
import * as TypeMoq from "typemoq";
import PackageRepository from "../../src/api/package-repository";
import ApiPackage from "../../src/routes/api-package";
import ApiAuthenticate from "../../src/routes/api-authenticate";
import IStorageProvider from "../../src/storage/storage-provider";
import Auth from "../../src/auth";

describe("init:api", () => {
  it("should init correctly", async () => {
    const container = new Container();
    apiInit(container);

    expect(container.has("package-repository")).true;
    expect(container.has("route-api-package")).true;
    expect(container.has("route-api-authenticate")).true;

    container.set("storage", TypeMoq.Mock.ofType<IStorageProvider>().object);
    expect(container.get("package-repository")).to.be.instanceOf(PackageRepository);
    expect(container.get("route-api-package")).to.be.instanceOf(ApiPackage);
    container.set("auth", TypeMoq.Mock.ofType<Auth>());
    expect(container.get("route-api-authenticate")).to.be.instanceOf(ApiAuthenticate);
  });
});

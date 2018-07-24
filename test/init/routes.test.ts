import "mocha";
import { expect } from "chai";
import * as TypeMoq from "typemoq";
import axios, { AxiosInstance } from "@contentful/axios";
import routesInit from "../../src/init/routes-init";
import Container from "../../src/util/container";
import IStorageProvider from "../../src/storage/storage-provider";
import Validator from "../../src/util/validator";
import PackageGetJson from "../../src/routes/package-get-json";
import PackagePublish from "../../src/routes/package-publish";
import PackageGet from "../../src/routes/package-get";
import PackageDelete from "../../src/routes/package-delete";
import PackageGetDistTags from "../../src/routes/package-get-dist-tags";
import PackageDeleteDistTags from "../../src/routes/package-delete-dist-tags";
import PackageAddDistTags from "../../src/routes/package-add-dist-tags";
import Search from "../../src/routes/search";
import PackageProxy from "../../src/routes/package-proxy";
import AuditProxy from "../../src/routes/audit-proxy";

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

    const config = new Map<string, any>();
    config.set("proxyEnabled", false);
    config.set("proxyUrl", "http://localhost:4444");
    config.set("proxyAudit", false);
    container.set("storage", TypeMoq.Mock.ofType<IStorageProvider>().object);
    container.set("config", config);
    container.set("validator", TypeMoq.Mock.ofType<Validator>().object);
    container.set("axios", function () {
      return axios;
    });

    expect(container.get("route-package-get-json")).to.be.instanceof(PackageGetJson);
    expect(container.get("route-package-publish")).to.be.instanceof(PackagePublish);
    expect(container.get("route-package-get")).to.be.instanceof(PackageGet);
    expect(container.get("route-package-delete")).to.be.instanceof(PackageDelete);
    expect(container.get("route-package-get-dist-tags")).to.be.instanceof(PackageGetDistTags);
    expect(container.get("route-package-delete-dist-tags")).to.be.instanceof(PackageDeleteDistTags);
    expect(container.get("route-package-add-dist-tags")).to.be.instanceof(PackageAddDistTags);
    expect(container.get("route-search")).to.be.instanceof(Search);
    expect(container.get("route-package-proxy")).to.be.instanceof(PackageProxy);
    expect(container.get("route-audit-proxy")).to.be.instanceof(AuditProxy);
  });
});

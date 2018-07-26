import "mocha";
import { expect } from "chai";
import * as TypeMoq from "typemoq";
import Search from "../../src/routes/search";
import IStorageProvider from "../../src/storage/storage-provider";
import * as httpMock from "node-mocks-http";

describe("routes:search", () => {
  it("should return search results", async () => {
    const storage = TypeMoq.Mock.ofType<IStorageProvider>();
    storage.setup(x => x.getPackageListing()).returns(async () => {
      const map = new Map();
      map.set("test", ["1.0.0"]);
      map.set("@test", { test: ["1.0.0"] });
      return map;
    });
    storage.setup(x => x.getPackageJson({ name: "test" })).returns(async () => {
      return {
        author: "a",
        "dist-tags": { latest: "1.0.0" },
        description: "This is a test",
        keywords: []
      };
    });
    storage
      .setup(x => x.getPackageJson({ name: "test", scope: "@test" }))
      .returns(async () => {
        return {
          author: "a",
          "dist-tags": { latest: "1.0.0" },
          description: "This is a test",
          keywords: []
        };
      });

    const route = new Search(storage.object);
    const req = httpMock.createRequest();
    const res = httpMock.createResponse();
    await route.process(req, res);
    expect(res._getData()).to.haveOwnProperty("objects");
    expect(res._getData().objects.length).to.equal(2);
  });

  it("should return filtered search results", async () => {
    const storage = TypeMoq.Mock.ofType<IStorageProvider>();
    storage.setup(x => x.getPackageListing()).returns(async () => {
      const map = new Map();
      map.set("test", ["1.0.0"]);
      map.set("@test", { tst: ["1.0.0"] });
      return map;
    });
    storage.setup(x => x.getPackageJson({ name: "test" })).returns(async () => {
      return {
        author: "a",
        "dist-tags": { latest: "1.0.0" },
        description: "This is a test",
        keywords: []
      };
    });
    storage
      .setup(x => x.getPackageJson({ name: "tst", scope: "@test" }))
      .returns(async () => {
        return {
          author: "a",
          "dist-tags": { latest: "1.0.0" },
          description: "This is a test",
          keywords: []
        };
      });

    const route = new Search(storage.object);
    const req = httpMock.createRequest({ query: { text: "test", size: 20 } });
    const res = httpMock.createResponse();
    await route.process(req, res);
    expect(res._getData()).to.haveOwnProperty("objects");
    expect(res._getData().objects.length).to.equal(1);
  });

  it("should return search results of max query size", async () => {
    const storage = TypeMoq.Mock.ofType<IStorageProvider>();
    storage.setup(x => x.getPackageListing()).returns(async () => {
      const map = new Map();
      map.set("test", ["1.0.0"]);
      map.set("@test", { test: ["1.0.0"] });
      return map;
    });
    storage.setup(x => x.getPackageJson({ name: "test" })).returns(async () => {
      return {
        author: "a",
        "dist-tags": { latest: "1.0.0" },
        description: "This is a test",
        keywords: []
      };
    });
    storage
      .setup(x => x.getPackageJson({ name: "test", scope: "@test" }))
      .returns(async () => {
        return {
          author: "a",
          "dist-tags": { latest: "1.0.0" },
          description: "This is a test",
          keywords: []
        };
      });

    const route = new Search(storage.object);
    const req = httpMock.createRequest({ query: { text: "test", size: 1 } });
    const res = httpMock.createResponse();
    await route.process(req, res);
    expect(res._getData()).to.haveOwnProperty("objects");
    expect(res._getData().objects.length).to.equal(1);
  });

  it("should check for max query size in different places [1/2]", async () => {
    const storage = TypeMoq.Mock.ofType<IStorageProvider>();
    storage.setup(x => x.getPackageListing()).returns(async () => {
      const map = new Map();
      map.set("test", ["1.0.0"]);
      map.set("@test", { test: ["1.0.0"], test2: ["1.0.0"] });
      return map;
    });
    storage.setup(x => x.getPackageJson({ name: "test" })).returns(async () => {
      return {
        author: "a",
        "dist-tags": { latest: "1.0.0" },
        description: "This is a test",
        keywords: []
      };
    });
    storage
      .setup(x => x.getPackageJson({ name: "test", scope: "@test" }))
      .returns(async () => {
        return {
          author: "a",
          "dist-tags": { latest: "1.0.0" },
          description: "This is a test"
        };
      });
    storage
      .setup(x => x.getPackageJson({ name: "test2", scope: "@test" }))
      .returns(async () => {
        return {
          author: "a",
          "dist-tags": { latest: "1.0.0" },
          description: "This is a test",
          keyword: []
        };
      });

    const route = new Search(storage.object);
    const req = httpMock.createRequest({ query: { text: "test", size: 20 } });
    const res = httpMock.createResponse();
    await route.process(req, res);
    expect(res._getData()).to.haveOwnProperty("objects");
    expect(res._getData().objects.length).to.equal(3);
  });

  it("should filter query in non-scoped packages", async () => {
    const storage = TypeMoq.Mock.ofType<IStorageProvider>();
    storage.setup(x => x.getPackageListing()).returns(async () => {
      const map = new Map();
      map.set("test", ["1.0.0"]);
      map.set("test2", ["1.0.0"]);
      return map;
    });
    storage.setup(x => x.getPackageJson({ name: "test" })).returns(async () => {
      return {
        author: "a",
        "dist-tags": { latest: "1.0.0" },
        description: "This is a test",
        keywords: []
      };
    });
    storage
      .setup(x => x.getPackageJson({ name: "test2" }))
      .returns(async () => {
        return {
          author: "a",
          "dist-tags": { latest: "1.0.0" },
          description: "This is a test"
        };
      });

    const route = new Search(storage.object);
    const req = httpMock.createRequest({ query: { text: "tst", size: 2 } });
    const res = httpMock.createResponse();
    await route.process(req, res);
    expect(res._getData()).to.haveOwnProperty("objects");
    expect(res._getData().objects.length).to.equal(0);
  });
});

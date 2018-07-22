import "mocha";
import { expect } from "chai";
import * as TypeMoq from "typemoq";
import { AccessType, AuthManager } from "../../src/auth";
import AuthProvider from "../../src/auth/auth-provider";

describe("auth:auth-manager", () => {
  it("should login user", async () => {
    const adapter = TypeMoq.Mock.ofType<AuthProvider>();
    const config = new Map<string, any>(
      Object.entries({
        workDir: "/",
        storage: {
          directory: "a"
        },
        auth: {
          adapter: "default",
          users: {
            canPublish: true,
            canAccess: true
          },
          register: true,
          public: false,
          remove: true
        }
      })
    );

    adapter
      .setup(x => x.userLogin("a", "b", "a@a.com"))
      .returns(async () => "true");
    adapter.setup(x => x.userLogin("b", "a", "a@a.com")).returns(async () => {
      throw Error();
    });

    const authManager = new AuthManager(adapter.object, config);
    expect(await authManager.userLogin("a", "b", "a@a.com")).to.equal("true");
    try {
      await authManager.userLogin("b", "a", "a@a.com");
    } catch (err) {
      expect(err.message).to.equal("Unauthorized");
    }
  });

  it("should logout user", async () => {
    const adapter = TypeMoq.Mock.ofType<AuthProvider>();
    const config = new Map<string, any>(
      Object.entries({
        workDir: "/",
        storage: {
          directory: "a"
        },
        auth: {
          adapter: "default",
          users: {
            canPublish: true,
            canAccess: true
          },
          register: true,
          public: false,
          remove: true
        }
      })
    );

    const authManager = new AuthManager(adapter.object, config);
    expect(authManager.userLogout("token"));
  });

  it("should check access of accessToken", async () => {
    const adapter = TypeMoq.Mock.ofType<AuthProvider>();
    const config = new Map<string, any>(
      Object.entries({
        workDir: "/",
        storage: {
          directory: "a"
        },
        auth: {
          adapter: "default",
          users: {
            canPublish: true,
            canAccess: true
          },
          register: true,
          public: true,
          remove: true
        }
      })
    );

    let authManager = new AuthManager(adapter.object, config);
    expect(await authManager.shouldBeAbleTo(AccessType.Access, "a", "Bearer "))
      .true;

    config.get("auth").public = false;
    authManager = new AuthManager(adapter.object, config);
    adapter.setup(x => x.verifyToken("a")).returns(async () => "user");
    adapter.setup(x => x.verifyToken("b")).returns(async () => {
      throw Error();
    });
    expect(await authManager.shouldBeAbleTo(AccessType.Access, "a", "Bearer a"))
      .true;
    expect(await authManager.shouldBeAbleTo(AccessType.Access, "a", "Bearer b"))
      .false;

    expect(
      await authManager.shouldBeAbleTo(AccessType.Publish, "a", "Bearer a")
    ).true;
    expect(
      await authManager.shouldBeAbleTo(AccessType.Publish, "a", "Bearer b")
    ).false;

    config.get("auth").users.canPublish = false;
    config.get("auth").users.canAccess = false;

    authManager = new AuthManager(adapter.object, config);
    try {
      await authManager.shouldBeAbleTo(AccessType.Access, "a", "Bearer a");
    } catch (e) {
      expect(e.message).to.equal("Unauthorized");
    }

    try {
      await authManager.shouldBeAbleTo(AccessType.Publish, "a", "Bearer a");
    } catch (e) {
      expect(e.message).to.equal("Unauthorized");
    }
  });

  it("should add user", async () => {
    const adapter = TypeMoq.Mock.ofType<AuthProvider>();
    const config = new Map<string, any>(
      Object.entries({
        workDir: "/",
        storage: {
          directory: "a"
        },
        auth: {
          adapter: "default",
          users: {
            canPublish: true,
            canAccess: true
          },
          register: true,
          public: false,
          remove: true
        }
      })
    );

    adapter
      .setup(x => x.userAdd("a", "a", "a@a.com"))
      .returns(async () => "token");
    adapter.setup(x => x.userAdd("b", "a", "a@a.com")).returns(async () => {
      throw Error();
    });

    const authManager = new AuthManager(adapter.object, config);
    expect(await authManager.userAdd("a", "a", "a@a.com")).to.equal("token");
    try {
      await authManager.userAdd("b", "a", "a@a.com");
    } catch (err) {
      expect(err.message).to.equal("Unauthorized");
    }
  });

  it("should remove user", async () => {
    const adapter = TypeMoq.Mock.ofType<AuthProvider>();
    const config = new Map<string, any>(
      Object.entries({
        workDir: "/",
        storage: {
          directory: "a"
        },
        auth: {
          adapter: "default",
          users: {
            canPublish: true,
            canAccess: true
          },
          register: true,
          public: false,
          remove: true
        }
      })
    );

    adapter.setup(x => x.userRemove("a", "a")).returns(async () => true);
    adapter.setup(x => x.userRemove("b", "a")).returns(async () => {
      throw Error();
    });

    let authManager = new AuthManager(adapter.object, config);
    expect(await authManager.userRemove("a", "a")).true;
    expect(await authManager.userRemove("b", "a")).false;

    config.get("auth").remove = false;
    authManager = new AuthManager(adapter.object, config);
    expect(await authManager.userRemove("a", "a")).false;
  });

  it("should verify login", async () => {
    const adapter = TypeMoq.Mock.ofType<AuthProvider>();
    const config = new Map<string, any>(
      Object.entries({
        workDir: "/",
        storage: {
          directory: "a"
        },
        auth: {
          adapter: "default",
          users: {
            canPublish: true,
            canAccess: true
          },
          register: true,
          public: false,
          remove: true
        }
      })
    );

    adapter.setup(x => x.userLogin("a", "a")).returns(async () => "token");
    adapter.setup(x => x.userLogin("b", "a")).returns(async () => {
      throw Error();
    });

    const authManager = new AuthManager(adapter.object, config);
    expect(await authManager.verifyLogin("a", "a")).to.equal("token");
    try {
      await authManager.verifyLogin("b", "a");
    } catch (err) {
      expect(err.message).to.equal("Unauthorized");
    }
  });

  it("should verify token", async () => {
    const adapter = TypeMoq.Mock.ofType<AuthProvider>();
    const config = new Map<string, any>(
      Object.entries({
        workDir: "/",
        storage: {
          directory: "a"
        },
        auth: {
          adapter: "default",
          users: {
            canPublish: true,
            canAccess: true
          },
          register: true,
          public: false,
          remove: true
        }
      })
    );

    adapter.setup(x => x.verifyToken("a")).returns(async () => "true");
    adapter.setup(x => x.verifyToken("b")).returns(async () => {
      throw Error();
    });

    const authManager = new AuthManager(adapter.object, config);
    expect(await authManager.verifyToken("a")).to.equal("true");
    try {
      await authManager.verifyToken("b");
    } catch (err) {
      expect(err.message).to.equal("Unauthorized");
    }
  });
});

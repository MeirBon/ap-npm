import Container from "../util/container";
import ApiPackage from "../routes/api-package";
import PackageRepository from "../api/package-repository";
import ApiAuthenticate from "../routes/api-authenticate";

export default function(container: Container) {
  container.set("package-repository", () => {
    return new PackageRepository(container.get("storage"));
  });

  container.set("route-api-package", () => {
    return new ApiPackage(container.get("package-repository"));
  });

  container.set("route-api-authenticate", () => {
    return new ApiAuthenticate(container.get("auth"));
  });
}

import Filesystem from "../storage/filesystem";
import Package from "./entities/package";

class PackageRepository {
  private storage: Filesystem;

  public constructor(storage: Filesystem) {
    this.storage = storage;
  }

  public async getPackages(): Promise<Package[]> {
    const pkgs: Package[] = [];
    const packages = await this.storage.getPackageListing();

    for (const key of packages.keys()) {
      if (key.charAt(0) === "@") {
        for (const k of Object.keys(packages.get(key))) {
          try {
            pkgs.push(
              new Package(
                k,
                packages.get(key)[k],
                await this.storage.getPackageJson({ name: k, scope: key }),
                key
              )
            );
          } catch (err) {}
        }
      } else {
        try {
          pkgs.push(
            new Package(
              key,
              packages.get(key),
              await this.storage.getPackageJson({
                name: key
              })
            )
          );
        } catch (err) {}
      }
    }

    return pkgs;
  }

  public async getPackage(name: string, scope?: string): Promise<Package> {
    const pkgJson = await this.storage.getPackageJson({ name, scope });
    return new Package(name, Object.keys(pkgJson.versions), pkgJson, scope);
  }
}

export default PackageRepository;

import * as path from "path";
import IFS from "../fs-interface";

const getVersions = async function(
  fs: IFS,
  packageLocation: string
): Promise<string[]> {
  const versionArray = [];
  const packageJson: any = JSON.parse(
    await fs.readFile(path.join(packageLocation, "package.json"))
  );

  const versionsObject = packageJson.versions;

  if (versionsObject) {
    for (const key in versionsObject) {
      if (versionsObject.hasOwnProperty(key)) {
        versionArray.push(key);
      }
    }
  }

  return versionArray;
};

export default async function(
  fs: IFS,
  storageLocation: string
): Promise<Map<string, any>> {
  const storageListing = new Map();

  const parts = await fs.readdir(storageLocation);

  await Promise.all(
    parts.map(async (part: string) => {
      if (part.indexOf("@") !== -1) {
        if (!storageListing.has(part)) {
          storageListing.set(part, {});
        }

        const scopedParts = await fs.readdir(path.join(storageLocation, part));
        if (scopedParts.length === 0) {
          storageListing.delete(part);
          return;
        }

        for (let i = 0; i < scopedParts.length; i++) {
          const scopedLocation = path.join(
            storageLocation,
            part,
            scopedParts[i]
          );

          if ((await fs.lstat(scopedLocation)).isDirectory()) {
            try {
              storageListing.get(part)[scopedParts[i]] = await getVersions(
                fs,
                scopedLocation
              );
            } catch (err) {}
          }
        }
      } else {
        const location = path.join(storageLocation, part);
        try {
          storageListing.set(part, await getVersions(fs, location));
        } catch (err) {}
      }
    })
  );

  return storageListing;
}

import * as fs from "async-file";
import * as path from "path";

const getVersions = async function(packageLocation: string): Promise<string[]> {
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

        for (let i = 0; i < scopedParts.length; i++) {
          const scopedLocation = path.join(
            storageLocation,
            part,
            scopedParts[i]
          );
          if ((await fs.lstat(scopedLocation)).isDirectory()) {
            try {
              storageListing.get(part)[scopedParts[i]] = await getVersions(
                scopedLocation
              );
            } catch (err) {
              // invalid pkg
            }
          }
        }
      } else {
        const location = path.join(storageLocation, part);
        try {
          storageListing.set(part, await getVersions(location));
        } catch (err) {
          // invalid pkg
        }
      }
    })
  );

  return storageListing;
}

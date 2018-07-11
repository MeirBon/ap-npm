import * as fs from "async-file";
import * as path from "path";

const getVersions = async function(packageLocation: string): Promise<string[]> {
  const versionArray = [];
  const packageJson: any = JSON.parse(await fs.readFile(path.join(packageLocation, "package.json")));

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


export default async function(storageLocation: string): Promise<Map<string, any>> {
  const storageListing: any = {};

  const parts = await fs.readdir(storageLocation);

  await Promise.all(parts.map(async (part: string) => {
    if (part.indexOf("@") !== -1) {
      if (typeof storageListing[part] !== "object") {
        storageListing[part] = {};
      }

      const scopedParts = await
        fs.readdir(path.join(storageLocation, part));

      await scopedParts.forEach(async (scopedPart) => {
        const scopedLocation = path.join(storageLocation, part, scopedPart);
        if ((await fs.lstat(scopedLocation)).isDirectory()) {
          if (!storageListing[part].hasOwnProperty(scopedPart)) {
            storageListing[part][scopedPart] = await getVersions(scopedLocation);
          }
        }
      });
    } else {
      const location = path.join(storageLocation, part);
      storageListing[part] = await getVersions(location);
    }
  }));

  return storageListing;
}
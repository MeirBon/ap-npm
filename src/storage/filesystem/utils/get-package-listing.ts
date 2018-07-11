import * as fs from "async-file";
import * as path from "path";

let getVersions = async function(packageLocation: string): Promise<string[]> {
  let versionArray = [];
  const packageJson = new Map(JSON.parse(
    await fs.readFile(path.join(packageLocation, "package.json"))
  ));

  const versionsObject = packageJson.get("versions");

  if (versionsObject) {
    for (let key in versionsObject) {
      if (versionsObject.hasOwnProperty(key)) {
        versionArray.push(key);
      }
    }
  }
  return versionArray;
};


export default async function(storageLocation: string): Promise<Map<string, any>> {
  let storageListing = new Map<string, any>();

  const parts = await fs.readdir(storageLocation);

  for (const part in parts) {
    if (part.indexOf("@") !== -1) {
      if (!storageListing.has(part)) {
        storageListing.set(part, new Map<string, any>());
      }

      const scopedParts = await
        fs.readdir(path.join(storageLocation, part));

      for (const scopedPart in scopedParts) {
        let scopedLocation = path.join(storageLocation, part, scopedPart);
        if ((await fs.lstat(scopedLocation)).isDirectory()) {
          const prt: Map<string, any> = storageListing.get(part);

          if (prt) {
            if (!prt.hasOwnProperty(scopedPart)) {
              prt.set(scopedPart, await getVersions(scopedLocation));
            }
          }
        }
      }
    } else {
      let location = path.join(storageLocation, part);
      storageListing.set(part, await getVersions(location));
    }
  }

  return storageListing;
}
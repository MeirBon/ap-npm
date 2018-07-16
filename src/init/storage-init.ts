import { join } from "path";
import * as fs from "async-file";
import Container from "../util/container";
import Filesystem from "../storage/filesystem";

export default function(container: Container) {
  const storageLocation = join(
    container.get("config").get("workDir"),
    container.get("config").get("storage").directory
  );
  fs.exists(storageLocation)
    .then(result => {
      if (!result) {
        return fs.mkdirp(storageLocation);
      }
    })
    .catch(err => {
      container
        .get("logger")
        .error(
          "Failed to initialize filesystem-structure in " + storageLocation,
          err
        );
    });

  container.set("storage-filesystem", function() {
    return new Filesystem(container.get("config"), container.get("logger"));
  });

  container.set("storage", function() {
    return container.get("storage-filesystem");
  });
}

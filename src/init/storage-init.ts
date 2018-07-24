import * as fs from "async-file";
import Container from "../util/container";
import Filesystem from "../storage/filesystem";

export default function(container: Container) {
  container.set("storage-filesystem", function() {
    return new Filesystem(
      container.get("config"),
      container.get("logger"),
      container.get("fs")
    );
  });

  container.set("storage", function() {
    return container.get("storage-filesystem");
  });
}

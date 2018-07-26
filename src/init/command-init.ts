import Container from "../util/container";
import InitCommand from "../commands/init";
import ServeCommand from "../commands/serve";

export default function(container: Container) {
  container.set("command-serve", function() {
    return new ServeCommand(
      container.get("express"),
      container.get("config"),
      container.get("logger")
    );
  });

  container.set("command-init", function() {
    return new InitCommand(container.get("config"), container.get("logger"));
  });
}

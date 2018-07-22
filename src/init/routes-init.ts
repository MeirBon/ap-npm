import Container from "../util/container";
import PackageGetJson from "../routes/package-get-json";
import PackagePublish from "../routes/package-publish";
import PackageGet from "../routes/package-get";
import PackageDelete from "../routes/package-delete";
import PackageGetDistTags from "../routes/package-get-dist-tags";
import PackageDeleteDistTags from "../routes/package-delete-dist-tags";
import PackageAddDistTags from "../routes/package-add-dist-tags";
import Search from "../routes/search";
import PackageProxy from "../routes/package-proxy";
import AuditProxy from "../routes/audit-proxy";

export default function(container: Container) {
  container.set("route-package-get-json", function() {
    return new PackageGetJson(
      container.get("storage"),
      container.get("route-package-proxy"),
      container.get("config").get("proxyEnabled")
    );
  });

  container.set("route-package-publish", function() {
    return new PackagePublish(
      container.get("storage"),
      container.get("validator")
    );
  });

  container.set("route-package-get", function() {
    return new PackageGet(container.get("storage"));
  });

  container.set("route-package-delete", function() {
    return new PackageDelete(
      container.get("storage"),
      container.get("validator"),
      container.get("config")
    );
  });

  container.set("route-package-get-dist-tags", function() {
    return new PackageGetDistTags(container.get("storage"));
  });

  container.set("route-package-delete-dist-tags", function() {
    return new PackageDeleteDistTags(container.get("storage"));
  });

  container.set("route-package-add-dist-tags", function() {
    return new PackageAddDistTags(container.get("storage"));
  });

  container.set("route-search", function() {
    return new Search(container.get("storage"));
  });

  container.set("route-package-proxy", function() {
    return new PackageProxy(container.get("config").get("proxyUrl"), container.get("axios"));
  });

  container.set("route-audit-proxy", function() {
    return new AuditProxy(container.get("config").get("proxyUrl"), container.get("axios"), container.get("config").get("proxyAudit"));
  });
}

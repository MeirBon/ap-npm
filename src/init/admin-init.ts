import Container from "../util/container";
import AdminRoute from "../routes/admin";
import AdminAllRoute from "../routes/admin-all";
import AdminConfigRoute from "../routes/admin-config";
import AdminAccess from "../admin/admin-access";

export default function(container: Container) {
  container.set("route-admin", function() {
    return new AdminRoute();
  });

  container.set("route-admin-all", function() {
    return new AdminAllRoute(container.get("storage"));
  });

  container.set("route-admin-config", function() {
    return new AdminConfigRoute(container.get("config"));
  });

  container.set("admin-access", function() {
    return new AdminAccess(container.get("auth"));
  });
}
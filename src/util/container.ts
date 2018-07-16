export default class Container {
  private services: Map<string, any>;
  private resolved: Map<string, any>;

  constructor() {
    this.services = new Map<string, any>();
    this.resolved = new Map<string, any>();
  }

  public set(name: string, service: any) {
    this.services.set(name, service);
  }

  public get(name: string): any {
    const resolved = this.resolved.get(name);
    if (resolved) {
      return resolved;
    }

    if (this.services.has(name)) {
      let service = this.services.get(name);
      if (typeof service === "function") {
        service = service.call();
      }
      this.resolved.set(name, service);
      return this.resolved.get(name);
    }

    throw new Error(`Cannot find service: ${name}`);
  }
}

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
      this.resolved.set(name, this.services.get(name).call());
      return this.resolved.get(name);
    }

    throw new Error(`Cannot find service: ${name}`);
  }
}

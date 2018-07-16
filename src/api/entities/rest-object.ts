export default abstract class RestObject {
  public abstract entityIdentifier: string;
  public abstract async toObject(): Promise<object>;
}

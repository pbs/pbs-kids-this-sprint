export default class LocalStorage {
  private keyprefix: string;

  constructor(keyprefix: string) {
    this.keyprefix = keyprefix;
  }

  public get <T>(key: string): T | undefined {
    // TODO: Set a cache expire time.
    const dataString = localStorage.getItem(this.keyprefix + key);
    return dataString ? JSON.parse(dataString) : undefined;
  }

  public set(key: string, data: object): void {
    // TODO: Return undefined if past the expire time.
    const dataString = JSON.stringify(data);
    localStorage.setItem(this.keyprefix + key, dataString);
  }
}

export default class LocalStorage {
  private keyprefix: string;

  constructor(keyprefix: string) {
    this.keyprefix = keyprefix;
  }

  public get <T>(key: string): T | undefined {
    const dataString = localStorage.getItem(this.keyprefix + key);
    return dataString ? JSON.parse(dataString) : undefined;
  }

  public set(key: string, data: object): void {
    const dataString = JSON.stringify(data);
    localStorage.setItem(this.keyprefix + key, dataString);
  }
}

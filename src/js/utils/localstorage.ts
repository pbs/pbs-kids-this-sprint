
type localStorageData<T> = {
  value: T;
  expiry: number;
}

export default class LocalStorage {
  private keyprefix: string;

  constructor(keyprefix: string) {
    this.keyprefix = keyprefix;
  }

  public get <T>(key: string): T | undefined {
    const now = new Date();
    const dataString = localStorage.getItem(this.keyprefix + key);

    if (!dataString) {
      return undefined;
    }

    const data: localStorageData<T> = JSON.parse(dataString);

    if (data.expiry > 0 && now.getTime() > data.expiry) {
      localStorage.removeItem(this.keyprefix + key);
      return undefined;
    }

    return data.value;
  }

  public set <T>(key: string, value: T, cacheTimeMS = 0): void {
    const now = new Date();
    let expiry = 0;

    if (cacheTimeMS > 0) {
      expiry = now.getTime() + cacheTimeMS;
    }

    const dataString = JSON.stringify({
      value,
      expiry,
    });

    localStorage.setItem(this.keyprefix + key, dataString);
  }
}

import Pivotal from '../pivotal';

export {};

declare global {
  const Build: {
    debugMode: boolean;
    token: string;
    version: string;
  };

  interface Window {
    pivotal: Pivotal;
  }
}

import Pivotal from '../pivotal';

export {};

declare global {
  const env: {
    account: number;
    debugMode: boolean;
    token: string;
    usernames: string[];
    version: string;
    workspaceId: number;
  };

  interface Window {
    pivotal: Pivotal;
  }
}

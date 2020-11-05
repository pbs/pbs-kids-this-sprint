export {};

declare global {
  const ENV: {
    // Build properties
    debugMode: boolean;
    version: string;

    // Pivotal properties
    account: number;
    token: string;
    workspaceId: number;
    usernames: string[];
  };

  // Defining here to be available for Typescript,
  // but have to also define with webpack.DefinePlugin()
  // to make available to vue via webpack.
  const SECONDS = 1000;
  const MINUTES = 60000;
  const HOURS = 360000;
  const DAYS = 8640000;
}

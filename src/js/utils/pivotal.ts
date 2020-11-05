import * as superagent from 'superagent';
import LocalStorage from './localstorage';

const SECONDS = 1000;

export default class Pivotal {
  public static BASE_URL: Readonly<string> = 'https://www.pivotaltracker.com/services/v5/';
  private token: string;
  private cache: LocalStorage;

  constructor(token: string, localStorageKeyPrefix: string) {
    this.token = token;
    this.cache = new LocalStorage(localStorageKeyPrefix);
  }

  async getAccountMemberships(accountId: number, cacheTimeMS = 0, delayMS = 0): Promise <Pivotal.AccountMembership[]> {
    let memberships = await this.request(`accounts/${accountId}/memberships`, cacheTimeMS, delayMS);

    if (!memberships) {
      throw Error(`No Members Found In Account ${ENV.account}`);
    }

    return memberships as Pivotal.AccountMembership[];
  }

  async getMe(cacheTimeMS = 0, delayMS = 0): Promise <Pivotal.Me> {
    let me: Pivotal.Me | undefined = await this.request(`me`, cacheTimeMS, delayMS);

    if (!me) {
      throw Error(`Current Owner Of Account "${ENV.account}" Not Found`);
    }

    return me;
  }

  async getStoryOwners(projectId: string, storyId: string, cacheTimeMS = 0, delayMS = 0): Promise <Pivotal.Person[]> {
    let owners = await this.request(`projects/${projectId}/stories/${storyId}/owners`, cacheTimeMS, delayMS);
    return (owners || []) as Pivotal.Person[];
  }

  async getProject(projectId: string, cacheTimeMS = 0, delayMS = 0): Promise <Pivotal.Project> {
    let project = await this.request(`projects/${projectId}`, cacheTimeMS, delayMS);

    if (!project) {
      throw Error(`Project "${projectId}" Not Found`);
    }

    return project as Pivotal.Project;
  }

  async getProjects(cacheTimeMS = 0, delayMS = 0): Promise <Pivotal.Project[]> {
    let projects = await this.request(`projects`, cacheTimeMS, delayMS);
    return (projects || []) as Pivotal.Project[];
  }

  async getReleases(projectId: string, cacheTimeMS = 0, delayMS = 0): Promise <Pivotal.Release[]> {
    let releases = await this.request(`projects/${projectId}/releases`, cacheTimeMS, delayMS);
    return (releases || []) as Pivotal.Release[];
  }

  async getStory(storyId: string, options: {fields: string[]}, cacheTimeMS = 0, delayMS = 0): Promise <Pivotal.Story> {
    const optionsString = options.fields ? '?fields=:' + options.fields.join() : '';
    let story = await this.request(`stories/${storyId}`+ optionsString, cacheTimeMS, delayMS);

    if (!story) {
      throw Error(`Story "${storyId}" Not Found`);
    }

    return story as Pivotal.Story;
  }

  async getWorkspace(workspaceId: number, cacheTimeMS = 0, delayMS = 0): Promise<Pivotal.Workspace> {
    let workspace = await this.request(`my/workspaces/${workspaceId}`, cacheTimeMS, delayMS);

    if (!workspace) {
      throw Error(`Workspace "${ENV.workspaceId}" Not Found`);
    }

    return workspace as Pivotal.Workspace;
  }

  async request<T>(path: string, cacheTimeMS = 0, delayMS = 0): Promise <T | undefined> {
    const cachedResponse: T | undefined = this.cache.get(path);

    // If cached, then return the result immediately.
    if (cachedResponse) {
      return cachedResponse;
    }

    // Rate limit if requested.
    if (delayMS > 0) {
      await this.sleep(delayMS);
    }

    try {
      let headers = { 'X-TrackerToken': this.token };
      let response = await superagent.get(Pivotal.BASE_URL + path).set(headers);
      this.cache.set(path, response.body, cacheTimeMS);

      return response.body;
    }
    catch (err) {
      if (/^Request has been terminated/.test(err.message)) {
        console.log('err: TOO MANY REQUESTS');
        await this.sleep(10 * SECONDS);
        return await this.request(path);
      }
    }
  }

  async search(projectId: number, query: string, cacheTimeMS = 0, delayMS = 0): Promise<Pivotal.SearchResultContainer> {
    return await this.request(`projects/${projectId}/search?query=${encodeURI(query)}`, cacheTimeMS, delayMS);
  }

  async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
}

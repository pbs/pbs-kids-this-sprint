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

  async getAccountMemberships(accountId: number): Promise <Pivotal.AccountMembership[]> {
    let memberships = await this.request(`accounts/${accountId}/memberships`);

    if (!memberships) {
      throw Error(`No Members Found In Account ${env.account}`);
    }

    return memberships as Pivotal.AccountMembership[];
  }

  async getMe(): Promise <Pivotal.Me> {
    let me: Pivotal.Me | undefined = await this.request(`me`);

    if (!me) {
      throw Error(`Current Owner Of Account "${env.account}" Not Found`);
    }

    return me;
  }

  async getStoryOwners(projectId: string, storyId: string): Promise <Pivotal.Person[]> {
    let owners = await this.request(`projects/${projectId}/stories/${storyId}/owners`);
    return (owners || []) as Pivotal.Person[];
  }

  async getPerson(personId: number): Promise <Pivotal.Person | undefined> {
    const me = await this.getMe();
    const accounts = me.accounts;

    for (let i = 0; i < accounts.length; i++) {
      const memberships = await this.getAccountMemberships(accounts[i].id);

      if (memberships !== undefined) {
        for (let j = 0; j < memberships.length; j++) {
          if (memberships[j].id === personId) {
            return memberships[j].person;
          }
        }
      }
    }

    return undefined;
  }

  async getProject(projectId: string): Promise <Pivotal.Project | undefined> {
    let project = await this.request(`projects/${projectId}`);

    if (!project) {
      throw Error(`Project "${projectId}" Not Found`);
    }

    return project as Pivotal.Project;
  }

  async getProjects(): Promise <Pivotal.Project[]> {
    let projects = await this.request(`projects`);
    return (projects || []) as Pivotal.Project[];
  }

  async getReleases(projectId: string): Promise <Pivotal.Release[]> {
    let releases = await this.request(`projects/${projectId}/releases`);
    return (releases || []) as Pivotal.Release[];
  }

  async getStory(storyId: string, options: {fields: string[]}): Promise <Pivotal.Story> {
    const optionsString = options.fields ? '?fields=:' + options.fields.join() : '';
    let story = await this.request(`stories/${storyId}`+ optionsString);

    if (!story) {
      throw Error(`Story "${storyId}" Not Found`);
    }

    return story as Pivotal.Story;
  }

  async getWorkspace(workspaceId: number): Promise<Pivotal.Workspace> {
    let workspace = await this.request(`my/workspaces/${workspaceId}`);

    if (!workspace) {
      throw Error(`Workspace "${env.workspaceId}" Not Found`);
    }

    return workspace as Pivotal.Workspace;
  }

  async request<T>(path: string, delayMS = 0): Promise <T | undefined> {
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
      this.cache.set(path, response.body);

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

  async search(projectId: number, query: string, delayMS = 0): Promise <Pivotal.SearchResultContainer | undefined> {
    return await this.request(`projects/${projectId}/search?query=${encodeURI(query)}`, delayMS);
  }

  async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
}

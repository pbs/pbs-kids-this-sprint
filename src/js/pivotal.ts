import * as superagent from 'superagent';
import LocalStorage from './localstorage';

const SECONDS = 1000;

export default class Pivotal {
  public static BASE_URL: Readonly<string> = 'https://www.pivotaltracker.com/services/v5/';
  private token: string;
  private cache: LocalStorage;

  constructor(token: string) {
    this.token = token;
    this.cache = new LocalStorage('PBS_KIDS_THIS_SPRINT::');
  }

  async getAccountMemberships(accountId: number): Promise <Pivotal.AccountMembership[]> {
    console.log(`getAccountMemberships(${accountId})`);
    return await this.request(`accounts/${accountId}/memberships`);
  }

  async getMe(): Promise <Pivotal.Me> {
    console.log(`getMe()`);
    return await this.request(`me`);
  }

  async getStoryOwners(projectId: string, storyId: string): Promise <Pivotal.Person[]> {
    console.log(`getStoryOwners(${projectId}, ${storyId})`);
    return await this.request(`projects/${projectId}/stories/${storyId}/owners`);
  }

  async getAccountMembership(personId: number): Promise <Pivotal.AccountMembership | undefined> {
    console.log(`getAccountMembership(${personId})`);
    const me = await this.getMe();
    const accounts = me.accounts;

    for (let i = 0; i < accounts.length; i++) {
      const memberships = await this.getAccountMemberships(accounts[i].id);

      if (memberships !== undefined) {
        for (let j = 0; j < memberships.length; j++) {
          if (memberships[j].id === personId) {
            return memberships[j];
          }
        }
      }
    }

    return undefined;
  }

  async getProject(projectId: string): Promise <Pivotal.Project> {
    console.log(`getProject(${projectId})`);
    return await this.request(`projects/${projectId}`);
  }

  async getProjects(): Promise <Pivotal.Project[]> {
    console.log(`getProjects()`);
    return await this.request(`projects`);
  }

  async getReleases(projectId: string): Promise <Pivotal.Release[]> {
    console.log(`getProjects(${projectId})`);
    return await this.request(`/projects/${projectId}/releases`);
  }

  async getStory(storyId: string, options: {fields: string[]}): Promise <Pivotal.Story[]> {
    const optionsString = options.fields ? '?fields=:' + options.fields.join() : '';
    console.log(`getStory(${storyId})`);

    return await this.request(`stories/${storyId}`+ optionsString);
  }

  async request<T>(path: string): Promise <T> {
    console.log(`request(${path})`);

    const cachedResponse: T | undefined = this.cache.get(path);

    if (cachedResponse) {
      return cachedResponse;
    }

    return superagent.get(Pivotal.BASE_URL + path)
      .set({
        'X-TrackerToken': this.token,
      })
      .then((response) => {
        this.cache.set(path, response.body);
        return response.body;
      })
      .catch(async (err: Error) => {
        if (err.message === 'Too Many Requests') {
          console.log('TOO MANY REQUESTS');
          await this.sleep(10 * SECONDS);
          return await this.request(path);
        }
      });
  }

  async search(projectId: string, query: string): Promise <Pivotal.SearchResultContainer> {
    console.log(`search(${projectId}, ${query})`);
    return await this.request(`projects/${projectId}/search?query=${encodeURI(query)}`);
  }

  async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
}

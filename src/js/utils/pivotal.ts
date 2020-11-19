import RequestController from './request';
export default class Pivotal {
  private requestController: RequestController;

  constructor(localStorageKeyPrefix: string) {
    this.requestController = new RequestController(localStorageKeyPrefix);
  }

  abortAllRequests(): void {
    this.requestController.abortAll();
  }

  async getAccountMemberships(accountId: number, cacheTimeMS = 0, delayMS = 0): Promise <Pivotal.AccountMembership[]> {
    let memberships = await this.requestController.get(`accounts/${accountId}/memberships`, cacheTimeMS, delayMS);

    if (!memberships) {
      throw Error('No members found in account defined in /admin/settings/plugins/thissprint');
    }

    return memberships as Pivotal.AccountMembership[];
  }

  async getMe(cacheTimeMS = 0, delayMS = 0): Promise <Pivotal.Me> {
    let me: Pivotal.Me | undefined = await this.requestController.get(`me`, cacheTimeMS, delayMS);

    if (!me) {
      throw Error('Current owner not found for account defined in /admin/settings/plugins/thissprint');
    }

    return me;
  }

  async getStoryOwners(projectId: string, storyId: string, cacheTimeMS = 0, delayMS = 0): Promise <Pivotal.Person[]> {
    let owners = await this.requestController.get(
      `projects/${projectId}/stories/${storyId}/owners`, cacheTimeMS, delayMS
    );

    return (owners || []) as Pivotal.Person[];
  }

  async getProject(projectId: string, cacheTimeMS = 0, delayMS = 0): Promise <Pivotal.Project> {
    let project = await this.requestController.get(`projects/${projectId}`, cacheTimeMS, delayMS);

    if (!project) {
      throw Error(`Project "${projectId}" Not Found`);
    }

    return project as Pivotal.Project;
  }

  async getProjects(cacheTimeMS = 0, delayMS = 0): Promise <Pivotal.Project[]> {
    let projects = await this.requestController.get(`projects`, cacheTimeMS, delayMS);
    return (projects || []) as Pivotal.Project[];
  }

  async getReleases(projectId: string, cacheTimeMS = 0, delayMS = 0): Promise <Pivotal.Release[]> {
    let releases = await this.requestController.get(`projects/${projectId}/releases`, cacheTimeMS, delayMS);
    return (releases || []) as Pivotal.Release[];
  }

  async getStory(storyId: string, options: {fields: string[]}, cacheTimeMS = 0, delayMS = 0): Promise <Pivotal.Story> {
    const optionsString = options.fields ? '?fields=:' + options.fields.join() : '';
    let story = await this.requestController.get(`stories/${storyId}`+ optionsString, cacheTimeMS, delayMS);

    if (!story) {
      throw Error(`Story "${storyId}" Not Found`);
    }

    return story as Pivotal.Story;
  }

  async getWorkspace(workspaceId: number, cacheTimeMS = 0, delayMS = 0): Promise<Pivotal.Workspace> {
    let workspace = await this.requestController.get(`my/workspaces/${workspaceId}`, cacheTimeMS, delayMS);

    if (!workspace) {
      throw Error(`Workspace "${window.PIVOTAL_CONFIG.workspaceId}" not found`);
    }

    return workspace as Pivotal.Workspace;
  }

  async search(projectId: number, query: string, cacheTimeMS = 0, delayMS = 0): Promise<Pivotal.SearchResultContainer> {
    return await this.requestController.get(
      `projects/${projectId}/search?query=${encodeURI(query)}`, cacheTimeMS, delayMS
    );
  }
}

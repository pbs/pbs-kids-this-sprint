const superagent = require('superagent');

class Pivotal {
  constructor(token) {
    this.token = token;
    this.baseUrl = 'https://www.pivotaltracker.com/services/v5/';
    this.cache = [];
  }

  async getAccountMemberships(accountId) {
    return await this.request(`accounts/${accountId}/memberships`);
  }

  async getMe() {
    return await this.request(`me`);
  }

  async getStoryOwners(projectId, storyId) {
    return await this.request(`projects/${projectId}/stories/${storyId}/owners`);
  }

  async getPerson(personId) {
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

    return null;
  }

  async getProject(projectId) {
    return await this.request(`projects/${projectId}`);
  }

  async getProjects() {
    return await this.request(`projects`);
  }

  async getReleases(projectId) {
    return await this.request(`/projects/${projectId}/releases`);
  }


  async getStory(storyId, options) {
    return await this.request(`stories/${storyId}`, options);
  }

  async request(path, options = {}) {
    if (options.fields) {
      options.fields = options.fields.join(',');
    }
    if (this.cache[path]) {
      return this.cache[path];
    }
    return await superagent.get(`${this.baseUrl}${path}`).set({
      'X-TrackerToken': this.token,
    })
      .query(options)
      .then((response) => {
        this.cache[path] = response.body;
        return response.body;
      }).catch(async (err) => {
        if (err.message === 'Too Many Requests') {
          await this.sleep(10000);
          return await this.request(path);
        }
      });
  }

  async search(projectId, query) {
    return await this.request(`projects/${projectId}/search`, { query });
  }

  async sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
}

module.exports = Pivotal;

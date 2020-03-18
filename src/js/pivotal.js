const superagent = require('superagent');
///9u8u8u875tt5tprojects/{project_id}/releases/{id}

class Pivotal {
  constructor(token) {
    console.log(`Pivotal(${token})`);
    this.token = token;
    this.baseUrl = 'https://www.pivotaltracker.com/services/v5/';
    this.cache = [];
  }

  async getAccountMemberships(accountId) {
    console.log(`getAccountMemberships(${accountId})`);
    return await this.request(`accounts/${accountId}/memberships`);
  }

  async getMe() {
    console.log(`getMe()`);
    return await this.request(`me`);
  }

  async getStoryOwners(projectId, storyId) {
    console.log(`getStoryOwners(${projectId}, ${storyId})`);
    return await this.request(`projects/${projectId}/stories/${storyId}/owners`);
  }

  async getPerson(personId) {
    console.log(`getPerson(${personId})`);
    const me = await this.getMe();
    const accounts = me.accounts;
    for (let i = 0; i < accounts.length; i++) {
      const memberships = await this.getAccountMemberships(accounts[i].id);
      if(memberships !== undefined){
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
    console.log(`getProject(${projectId})`);
    return await this.request(`projects/${projectId}`);
  }

  async getProjects() {
    console.log(`getProjects()`);
    return await this.request(`projects`);
  }

  async getStory(storyId, fields = "") {
    if(fields !== ""){
      fields = "?fields=:" + fields;
    }
    console.log(`getStory(${storyId})`);
    return await this.request(`stories/${storyId}`+fields);
  }

  async request(path) {
    console.log(`request(${path})`);
    if (this.cache[path]) {
      return this.cache[path];
    }
    return await superagent.get(`${this.baseUrl}${path}`).set({
      'X-TrackerToken': this.token,
    }).then((response) => {
      this.cache[path] = response.body;
      return response.body;
    }).catch(async (err) => {
      if (err.message === 'Too Many Requests') {
        console.log('TOO MANY REQUESTS');
        await this.sleep(10000);
        return await this.request(path);
      }
    });
  }

  async search(projectId, query) {
    console.log(`search(${projectId}, ${query})`);
    return await this.request(`projects/${projectId}/search?query=${encodeURI(query)}`);
  }

  async sleep(ms) {
    console.log(`sleep(${ms})`);
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
}

module.exports = Pivotal;

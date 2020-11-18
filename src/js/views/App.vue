<template>
  <div id="app">
    <header class="workspace-header">
      <h1 class="workspace-name">{{workspace.name || 'Loading...'}}</h1>

      <h2 class="workspace-current-search">{{searchLabel}}</h2>

      <label>Search Label:
        <input type="text" placeholder="sprint 102" :value="searchLabel" @keyup="onKeyUp" />
      </label>
    </header>
    <div class='people' v-if="searchLabel">
      <Person v-for='person in people' :key='person.index'
        :person="person" :projectIds="projectIds" :label="searchLabel" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import Person from './Person.vue';

@Component({
  components: {
    Person,
  },
})

export default class App extends Vue {
  private people: Pivotal.Person[];
  private projectIds?: number[];
  private workspace: Pivotal.Workspace;
  private searchLabel = 'sprint 133';

  constructor() {
    super();

    this.people = [];
    this.workspace = {
      id: 0,
      name: '',
      kind: '',
      person_id: 0,
      project_ids: [],
    };
  }

  async mounted(): Promise<void> {
    // Get projects.
    this.workspace = await this.$pivotal.getWorkspace(ENV.workspaceId, 1 * DAYS);
    this.projectIds = this.workspace.project_ids;

    console.log(this.workspace);

    if (!this.projectIds) {
      throw Error(`No Projects Found In Workspace ${ENV.workspaceId}`);
    }

    // Get members.
    let memberships = await this.$pivotal.getAccountMemberships(ENV.account, 1 * DAYS);

    for (let membership of memberships) {
      if (ENV.usernames.includes(membership.person.username)) {
        this.people.push(membership.person);
      }
    }
  }

  private onKeyUp(e: KeyboardEvent): void {
    if (e.code !== 'Enter' || !e.target) return;
    this.searchLabel = (e.target as HTMLInputElement).value;
  }
}
</script>

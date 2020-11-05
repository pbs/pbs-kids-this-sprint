<template>
  <div id="app">
    <Person :person="person" :projectIds="projectIds" v-for='person in people' :key='person.index' />
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

  constructor() {
    super();

    this.people = [];
  }

  async mounted(): Promise<void> {
    // Get projects.
    let workspace = await this.$pivotal.getWorkspace(ENV.workspaceId, 1 * DAYS);
    this.projectIds = workspace.project_ids;

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
}
</script>

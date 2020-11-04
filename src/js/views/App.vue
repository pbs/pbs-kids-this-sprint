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
    let workspace = await window.pivotal.getWorkspace(env.workspaceId);
    this.projectIds = workspace.project_ids;

    if (!this.projectIds) {
      throw Error(`No Projects Found In Workspace ${env.workspaceId}`);
    }

    // Get members.
    let memberships = await window.pivotal.getAccountMemberships(env.account);

    for (let membership of memberships) {
      if (env.usernames.includes(membership.person.username)) {
        this.people.push(membership.person);
      }
    }
  }
}
</script>

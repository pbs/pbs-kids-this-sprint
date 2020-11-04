<template>
  <section class="person">
    <h2 class="person_name">{{person.name}}</h2>

    <article class="story" v-for='story in stories' :key='story.index'>
      <h3 class="story_name">{{story.name}}</h3>
      <!-- <p class="story_description">{{story.description}}</p> -->
    </article>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Person extends Vue {
  @Prop({ required: true }) readonly person!: Pivotal.Person;
  @Prop({ required: true }) readonly projectIds!: number[];

  private stories: Pivotal.Story[];

  constructor() {
    super();

    this.stories = [];
  }

  async mounted(): Promise<void> {
    let label = 'sprint 133';
    let query = `(label:"${label}"+OR+state:started,finished,delivered,rejected)`
              + `+AND+(owner:"${this.person.initials}")`;

    for (let id of this.projectIds) {
      let searchResults = await window.pivotal.search(id, query, 1000);

      if (searchResults) {
        this.stories = this.stories.concat(searchResults.stories.stories);
      }
    }
  }
}
</script>

<template>
  <section class="person">
    <h2 class="person_name">{{person.name}}</h2>
    <div class="stories-container">
      <Story :story="story" v-for='story in stories' :key='story.index' />
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Story from './Story.vue';

@Component({
  components: {
    Story,
  },
})

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
      let searchResults = await this.$pivotal.search(id, query, 30 * MINUTES, 1 * SECONDS);

      if (searchResults) {
        this.stories = this.stories.concat(searchResults.stories.stories);
      }
    }
  }
}
</script>

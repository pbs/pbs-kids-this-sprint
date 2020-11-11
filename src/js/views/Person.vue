<template>
  <section class="person">
    <header class="person-header">
      <h1 class="person-name">{{person.name}}</h1>
      <em class="person-points" v-if="points">{{points}} {{points > 1 ? 'pts' : 'pt'}}</em>
    </header>
    <div class="stories">
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
  @Prop({ required: true }) readonly label!: string;
  @Prop({ required: true }) readonly projectIds!: number[];

  private stories: Pivotal.Story[];
  private points: number;

  constructor() {
    super();
    this.stories = [];
    this.points = 0;
  }

  async mounted(): Promise<void> {
    let query = `(label:"${this.label}"+OR+state:started,finished,delivered,rejected)`
              + `+AND+(owner:"${this.person.initials}")`;

    for (let id of this.projectIds) {
      let searchResults = await this.$pivotal.search(id, query, 30 * MINUTES, 1 * SECONDS);

      if (searchResults) {
        this.stories = this.stories.concat(searchResults.stories.stories);
      }
    }

    for (let story of this.stories) {
      this.points += story.estimate || 0;
    }
  }
}
</script>

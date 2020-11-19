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
  public abortCurrentSearch = false;

  constructor() {
    super();
    this.stories = [];
    this.points = 0;
  }

  get query(): string {
    return `(label:"${this.label}"+OR+state:started,finished,delivered,rejected)`
            + `+AND+(owner:"${this.person.initials}")`;
  }

  async updated(): Promise<void> {
    console.log(`updated(${this.label})`);
  }

  async mounted(): Promise<void> {
    console.log('mounted()');

    for (let id of this.projectIds) {
      if (this.abortCurrentSearch) {
        console.log('Abort further searches.');
        break;
      }

      await this.getStories(id);
    }
  }

  async getStories(projectId: number): Promise<void> {
    let numSiblings = this.$parent.$children.length;

    let searchResults = await this.$pivotal.search(projectId, this.query, 30 * MINUTES, numSiblings * SECONDS / 2);

    if (searchResults && searchResults.stories) {
      this.stories = this.stories.concat(searchResults.stories.stories);

      for (let story of searchResults.stories.stories) {
        this.points += story.estimate || 0;
      }
    }
  }
}
</script>

<template>
  <article class="story">
    <h3 :class="classes" @click="toggleDescription">{{story.name}}</h3>
    <p v-show="revealDescription" class="story-description">{{story.description}}</p>
  </article>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Story extends Vue {
  @Prop({ required: true }) readonly story!: Pivotal.Story;

  private revealDescription = false;

  constructor() {
    super();
  }

  private get classes(): string {
    let blocked = this.story.blocker_ids && this.story.blocker_ids.length > 0 ? 'blocked' : '';

    return [
      'story-name',
      blocked,
      this.story.story_type,
      `estimate-${this.story.estimate}`,
    ].join(' ');
  }

  private toggleDescription(): void {
    this.revealDescription = !this.revealDescription;
  }
}
</script>

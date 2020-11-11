<template>
  <article class="story">
    <header :class="'story-header ' + storyClasses">
      <h3 class="story-name" @click="toggleDescription">{{story.name}}</h3>
      <a class="story-url" :href="story.url" target="_blank"><img src="/images/external-link.svg"></a>
      <span :class="'story-status ' + story.current_state">{{story.current_state}}</span>
      <span :class="'story-type ' + story.story_type"></span>
      <span :class="'story-points estimate-' + this.story.estimate"></span>
    </header>
    <div v-show="revealDescription" class="story-description" v-html="storyDescription"></div>
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

  private get storyClasses(): string {
    let blocked = this.story.blocker_ids && this.story.blocker_ids.length > 0 ? 'blocked' : '';

    return [
      blocked,
      this.story.story_type,
      this.story.current_state,
      `estimate-${this.story.estimate}`,
    ].join(' ');
  }

  private get storyDescription(): string {
    return this.$markdown.render(this.story.description);
  }

  private toggleDescription(): void {
    this.revealDescription = !this.revealDescription;
  }
}
</script>

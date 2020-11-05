<template>
  <article :class="'story ' + story.story_type">
    <h3 class="story_name">{{story.name}}</h3>
    <p class="story_description">{{story.description}}</p>
  </article>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Story extends Vue {
  @Prop({ required: true }) readonly story!: Pivotal.Story;

  constructor() {
    super();
  }
}
</script>

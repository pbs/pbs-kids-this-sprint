import Vue from 'vue';
import Pivotal from '../js/utils/pivotal';
import MarkdownIt from 'markdown-it';

declare module '*.vue' {
  export default Vue;
}

declare module 'vue/types/vue' {
  interface Vue {
    $pivotal: Pivotal;
    $markdown: MarkdownIt;
  }
}

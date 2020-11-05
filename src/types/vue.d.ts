import Vue from 'vue';
import Pivotal from '../js/utils/pivotal';

declare module '*.vue' {
  export default Vue;
}

declare module 'vue/types/vue' {
  interface Vue {
    $pivotal: Pivotal;
  }
}

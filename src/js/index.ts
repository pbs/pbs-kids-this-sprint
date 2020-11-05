import App from './views/App.vue';
import Pivotal from './utils/pivotal';
import Vue, { CreateElement, VNode } from 'vue';

function onDomReady(): void {
  console.log('onDomReady()', { ENV });

  // Don't need production tip on Release builds.
  Vue.config.productionTip = ENV.debugMode;

  if (!ENV.token) {
    throw Error('No token found in ".env"');
  }

  // Instantiate Pivotal global.
  Vue.prototype.$pivotal = new Pivotal(ENV.token, 'PBS_KIDS_THIS_SPRINT::');

  // Start the Vue app.
  new Vue({
    el: '#app',
    render: (createElement: CreateElement): VNode => createElement(App),
  });
}

(function domReadyCheck() {
  window.document.readyState === 'interactive' || window.document.readyState === 'complete'
    ? onDomReady()
    : window.document.addEventListener('DOMContentLoaded', onDomReady);
})();

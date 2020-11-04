import App from './views/App.vue';
import Pivotal from './pivotal';
import Vue, { CreateElement, VNode } from 'vue';

function onDomReady(): void {
  console.log('onDomReady()', { env });

  // Don't need production tip on Release builds.
  Vue.config.productionTip = env.debugMode;

  if (!env.token) {
    throw Error('No token found in ".env"');
  }

  // Instantiate Pivotal global.
  window.pivotal = new Pivotal(env.token, 'PBS_KIDS_THIS_SPRINT::');

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

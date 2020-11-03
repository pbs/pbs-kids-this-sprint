import App from './views/App.vue';
import Pivotal from './pivotal';
import Vue, { CreateElement, VNode } from 'vue';

function onDomReady(): void {
  console.log('onDomReady()', { Build });

  // Don't need production tip on Release builds.
  Vue.config.productionTip = Build.debugMode;

  if (!Build.token) {
    throw Error('No token found in ".env"');
  }

  window.pivotal = new Pivotal(Build.token);

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

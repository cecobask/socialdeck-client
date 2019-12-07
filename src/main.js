import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VueApollo from 'vue-apollo'
import { apolloProvider } from '@/graphql/apollo'
import Vuelidate from 'vuelidate'
import Vuex from 'vuex'
import { store } from '@/store/store'
import fb from '../firebaseConfig'
import vueTopprogress from 'vue-top-progress'

Vue.config.productionTip = false

Vue.use(Vuex)
Vue.use(BootstrapVue)
Vue.use(VueApollo)
Vue.use(Vuelidate)
Vue.use(vueTopprogress)

// handle page reloads
let app
fb.auth.onAuthStateChanged(user => {
  if (!app) {
    app = new Vue({
      apolloProvider,
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
})

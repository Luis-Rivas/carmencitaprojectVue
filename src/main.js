import './assets/main.css'
import store from './store/auth'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import './assets/main.css';
import VueApexCharts from "vue3-apexcharts";
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import axios from 'axios';


window.axios = axios;
window.axios.defaults.withCredentials = true;
window.axios.defaults.headers.common["Accept"]="application/json";
window.axios.defaults.headers.common["Content-Type"]="application/json";
window.axios.defaults.headers.common["X-Requested-With"]="XMLHttpRequest";

// Set the appropriate CORS headers based on the current origin
//axios.defaults.headers.common['Access-Control-Allow-Origin'] = window.location.origin;
axios.defaults.headers.common['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE';
axios.defaults.headers.common['Access-Control-Allow-Headers'] = 'X-Requested-With, Content-Type';
axios.defaults.baseURL="http://127.0.0.1:8000"

const app = createApp(App)


app.component('VueDatePicker', VueDatePicker);
app.use(router);
app.use(store);

const options = {
  transition: "Vue-Toastification__fade",
  maxToasts: 20,
  newestOnTop: true
};

app.use(Toast, options);
app.use(VueApexCharts);
app.mount('#app')

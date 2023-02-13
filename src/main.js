import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "../src/assets/css/sidebar.css";
import "../src/assets/css/table.css";
import "../src/assets/css/components.css";
import "../src/assets/css/certificate.css";
import "../src/assets/css/login.css";

import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

const options = {
    position: "top-right",
    timeout: 3000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: true,
    closeButton: "button",
    icon: true,
    rtl: false,
};

import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

import "mdb-vue-ui-kit/css/mdb.min.css";

import VueExcelXlsx from "vue-excel-xlsx";

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(Toast, options);
Vue.use(VueExcelXlsx);

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount("#app");

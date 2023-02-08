<template>
  <nav class="navbar navbar-expand-lg navbar-absolute"
       :class="{'bg-white': showMenu, 'navbar-transparent': !showMenu}">
    <div class="container-fluid">
      <div class="navbar-wrapper">
        <a class="navbar-brand" href="">{{ routeName }}</a>
      </div>

      <button class="navbar-toggler" type="button"
              @click="toggleMenu"
              data-toggle="collapse"
              data-target="#navigation"
              aria-controls="navigation-index"
              aria-label="Toggle navigation">
        <span class="navbar-toggler-bar navbar-kebab"></span>
        <span class="navbar-toggler-bar navbar-kebab"></span>
        <span class="navbar-toggler-bar navbar-kebab"></span>
      </button>

      <collapse-transition>
        <div class="collapse navbar-collapse show" v-show="showMenu">
          <ul class="navbar-nav ml-auto">
            <div class="search-bar input-group">
              <router-link :to="{ name: 'dashboard'}" custom v-slot="{ navigate }">
                <button class="btn btn-link" @click="navigate" role="link">
                  <i class="tim-icons icon-chart-pie-36"></i>
                </button>
              </router-link>
              <button class="btn btn-link" @click="showHelp = true">
                <i class="tim-icons icon-support-17"></i>
              </button>
              <button class="btn btn-link" @click="showPowerOff = true">
                <i class="tim-icons icon-button-power"></i>
              </button>
            </div>
          </ul>
        </div>
      </collapse-transition>
    </div>

    <modal :show.sync="showPowerOff"
           body-classes="p-0"
           modal-classes="modal-sm">
      <card type="secondary"
            header-classes="bg-white pb-5"
            body-classes="px-lg-5 py-lg-5"
            class="border-0 mb-0">
        <template>
          <div class="text-muted text-center mb-3">
            <h4>Power options</h4>
          </div>
          <div class="btn-wrapper text-center">
            <base-button type="default" @click="restart()">
              <i class="tim-icons icon-refresh-02"></i>
              Restart
            </base-button>
            <base-button type="danger" @click="powerOff()">
              <i class="tim-icons icon-button-power"></i>
              Shutdown
            </base-button>
          </div>
        </template>
      </card>
    </modal>
  </nav>
</template>
<script>
import {CollapseTransition} from 'vue2-transitions';
import Modal from '@/components/Modal';

export default {
  components: {
    CollapseTransition,
    Modal
  },
  computed: {
    routeName() {
      const {name} = this.$route;
      return this.capitalizeFirstLetter(name);
    }
  },
  data() {
    return {
      showMenu: false,
      showPowerOff: false,
      showHelp: false
    };
  },
  methods: {
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    toggleMenu() {
      this.showMenu = !this.showMenu;
    },
    powerOff(){
      fetch([process.env.VUE_APP_API, "system", "poweroff"].join("/"), {
        method: 'POST'
      })
        .then(response => console.log(response));
    },
    restart(){
      fetch([process.env.VUE_APP_API, "system", "restart"].join("/"), {
        method: 'POST'
      })
        .then(response => console.log(response));
    }
  }
};
</script>
<style>
</style>

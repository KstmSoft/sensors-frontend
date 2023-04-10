<template>
  <nav class="navbar navbar-expand-lg navbar-absolute" :class="{'bg-white': showMenu, 'navbar-transparent': !showMenu}">
    <div class="container-fluid">

      <div v-if="routeName === 'dashboard'" class="navbar-wrapper">
        <i class="tim-icons icon-chart-bar-32"></i>
        <p class="navbar-brand pl-2">{{ $t('pages.' + routeName) }}</p>
      </div>

      <div v-if="routeName !== 'dashboard'" class="navbar-wrapper" @click="$router.go(-1)" role="link" style="cursor: pointer">
        <i class="tim-icons icon-minimal-left"></i>
        <p class="navbar-brand pl-2">{{$t('layout.back')}}</p>
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
              <router-link :to="{ name: 'sensors'}" custom v-slot="{ navigate }">
                <button class="btn btn-link" @click="navigate" role="link">
                  <i class="tim-icons icon-bullet-list-67"></i>
                </button>
              </router-link>
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
            <h4>{{$t('layout.powerOptions')}}</h4>
          </div>
          <div class="btn-wrapper text-center">
            <base-button type="default" @click="restart()">
              <i class="tim-icons icon-refresh-02"></i>
              {{$t('layout.restart')}}
            </base-button>
            <base-button type="danger" @click="powerOff()">
              <i class="tim-icons icon-button-power"></i>
              {{$t('layout.powerOff')}}
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
      return name;
    }
  },
  data() {
    return {
      showMenu: false,
      showPowerOff: false
    };
  },
  methods: {
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

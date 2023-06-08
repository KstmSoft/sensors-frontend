<template>
  <div class="row">
    <div v-for="sensor in sensorList" class="col-md-12">
      <div class="card sensor-card">
        <div class="d-flex">
          <div class="p-2">
            <h1>{{ sensor.address }}</h1>
          </div>
          <div class="p-2">
            <div class="vl"></div>
          </div>
          <div class="p-2 text-truncate">
            <div class="sensor-description">
              <p>{{ sensor.tag }}</p>
              <span>Enabled</span>
            </div>
          </div>
          <div class="ml-auto p-2">
            <router-link :to="{ name: 'details', query: {id: sensor.id}}" custom v-slot="{ navigate }">
              <base-button size="sm" round type="success" @click="navigate" role="link">
                <i class="tim-icons icon-chart-bar-32"></i>
              </base-button>
            </router-link>
          </div>
          <div class="p-2">
            <base-button size="sm" round type="info" @click="editSensor(sensor)">
              <i class="tim-icons icon-settings"></i>
            </base-button>
          </div>
        </div>
      </div>
    </div>

    <div class="col-md-12 text-center">
      <base-button round icon type="success" size="lg" @click="addSensor()">
        <i class="tim-icons icon-simple-add"></i>
      </base-button>
    </div>

    <modal :show.sync="showSensorModal"
           body-classes="p-0"
           modal-classes="modal-dialog-centered modal-sm">
      <card type="secondary"
            header-classes="bg-white pb-5"
            body-classes="px-lg-5 py-lg-5"
            class="border-0 mb-0">
        <template>
          <h4 class="card-title">{{ editing ? $t('form.editSensor') : $t('form.addSensor') }}</h4>
          <form role="form" ref="sensorForm">
            <div class="form-group">
              <label>{{$t('form.address')}}</label>
              <input type="text" class="form-control" name="address" v-model="sensor.address" placeholder="A0"
                     autofocus>
            </div>
            <div class="form-group">
              <label>{{$t('form.tag')}}</label>
              <input type="text" class="form-control" name="tag" v-model="sensor.tag" aria-describedby="tag"
                     :placeholder="$t('form.tagPlaceholder')">
            </div>
            <div class="form-group row">
              <div class="col-sm-6">
                <label>{{$t('form.refreshRate')}}</label>
                <input type="number" class="form-control" name="refresh-rate" v-model="sensor.refreshrate"
                       aria-describedby="refresh rate">
              </div>
              <div class="col-sm-6">
                <label>{{$t('form.maxValue')}}</label>
                <input type="number" class="form-control" name="max-value" v-model="sensor.max_value"
                       aria-describedby="maximum value">
              </div>
            </div>
            <div class="form-group">
              <label>{{$t('form.calibrationFormula')}} (<b>vout</b> = {{$t('form.outputVoltage')}})</label>
              <input type="text" class="form-control" name="formula" v-model="sensor.formula"
              aria-describedby="calibration formula">
            </div>
            <div class="form-group row">
              <div class="col-sm-6">
                <label>{{$t('form.symbol')}}</label>
                <input type="text" class="form-control" name="symbol" v-model="sensor.symbol" aria-describedby="symbol"
                       placeholder="VOLT">
              </div>
              <div class="col-sm-6">
                <label>{{$t('form.color')}}</label>
                <input type="text" class="form-control" name="color" v-model="sensor.color" aria-describedby="color"
                       placeholder="#FFFFFF">
              </div>
            </div>
          </form>
          <div class="d-flex justify-content-between">
            <div>
              <div v-if="editing" class="btn-wrapper">
                <base-button type="danger" @click="deleteSensor(sensor.id)">
                  <i class="tim-icons icon-trash-simple"></i>
                </base-button>
              </div>
            </div>
            <div>
              <div class="btn-wrapper">
                <button class="btn btn-secondary" v-on:click="showSensorModal=false">{{$t('form.cancel')}}</button>
                <button class="btn btn-primary" v-on:click="submit()">{{ editing ? $t('form.edit') : $t('form.add') }}</button>
              </div>
            </div>
          </div>
        </template>
      </card>
    </modal>
  </div>
</template>
<script>
import Modal from "@/components/Modal.vue";

const model = Object.freeze({
  id: "",
  tag: "",
  address: "",
  refreshrate: 1000,
  formula: "",
  symbol: "",
  max_value: 1024,
  color: "#08ff00"
});

export default {
  components: {Modal},
  data() {
    return {
      sensorList: null,
      showSensorModal: false,
      sensor: Object.assign({}, model),
      editing: false
    }
  },
  created() {
    this.getSensors();
  },
  methods: {
    getSensors(){
      fetch([process.env.VUE_APP_API, "sensor"].join("/"))
        .then(response => response.json())
        .then(data => (this.sensorList = data));
    },
    editSensor(sensor) {
      this.sensor = Object.assign({}, sensor);
      this.editing = true;
      this.showSensorModal = true;
    },
    addSensor() {
      this.sensor = Object.assign({}, model);
      this.editing = false;
      this.showSensorModal = true;
    },
    deleteSensor(id) {
      fetch([process.env.VUE_APP_API, "sensor", id].join("/"), {
        method: "DELETE"
      })
        .then(function (response) {
          if (response.status !== 200) {
            this.$notify({verticalAlign: 'bottom', horizontalAlign: 'center', message: `Error ${response.status} deleting sensor`, type: 'danger'});
          } else {
            response.json().then(function () {
              this.showSensorModal = false;
              this.getSensors()
              this.$notify({verticalAlign: 'bottom', horizontalAlign: 'center', message: `Sensor deleted successfully`, type: 'success'});
            }.bind(this));
          }
        }.bind(this));
    },
    submit() {
      fetch([process.env.VUE_APP_API, "sensor"].join("/"), {
        method: this.editing ? "PUT" : "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(this.sensor)
      })
        .then(function (response) {
          if (response.status !== 200) {
            this.$notify({verticalAlign: 'bottom', horizontalAlign: 'center', message: `Error ${response.status} ${this.editing ? 'editing' : 'creating'} sensor`, type: 'danger'});
          } else {
            response.json().then(function () {
              this.showSensorModal = false;
              this.getSensors()
              this.$notify({verticalAlign: 'bottom', horizontalAlign: 'center', message: `Sensor ${this.editing ? 'edited' : 'created'} successfully`, type: 'success'});
            }.bind(this));
          }
        }.bind(this));
    }
  }
};
</script>
<style>
</style>

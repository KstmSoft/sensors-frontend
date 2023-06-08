<template>
  <div class="row">
    <div class="col-12">
      <card v-if="sensor" type="chart">
        <template slot="header">
          <div class="row">
            <div class="col-sm-10">
              <h5 class="card-category">{{$t('details.analogRead')}} {{ sensor.address }}</h5>
              <h2 class="card-title">{{ sensor.tag }}</h2>
              <span class="card-title"><code>vout = {{ voltage }}, y = {{ sensor.formula }}, y = {{ computed }}</code></span>
            </div>
          </div>
        </template>
        <div class="chart-area">
          <line-chart style="height: 100%"
                      ref="sensorChart"
                      chart-id="sensor-chart"
                      :chart-data="chartData"
                      :extra-options="extraOptions">
          </line-chart>
        </div>
      </card>
    </div>
    <div class="col-12">
      <card>
        <button class="btn btn-block btn-success" @click="downloadLogs()">{{ $t('details.download') }}</button>
      </card>
    </div>
  </div>
</template>
<script>
import LineChart from '@/components/Charts/LineChart';
import * as chartConfigs from '@/components/Charts/config';
import axios from "axios";

export default {
  components: {
    LineChart,
  },
  data() {
    return {
      id: -1,
      sensor: null,
      voltage: 0,
      computed: 0,
      chartRange: 20,
      chartData: {
        datasets: [{
          data: []
        }],
        labels: [],
      },
      extraOptions: {},
    }
  },
  beforeRouteEnter(to, from, next) {
    fetch([process.env.VUE_APP_API, "sensor", to.query.id].join("/")).then(response => {
      response.json().then(data => {
        next(vm => vm.setData(data));
      });
    }).catch(error => {
      console.error('Cannot load initial data: ', error);
    })
  },
  methods: {
    setData(sensor){
      this.sensor = sensor;
      this.extraOptions = {
        ...chartConfigs.defaultChartOptions,
        scales: {
          yAxes: [{
            barPercentage: 1.6,
            gridLines: {
              drawBorder: false,
              color: 'rgba(255,255,255,0.04)',
              zeroLineColor: "transparent",
            },
            ticks: {
              suggestedMin: 0,
              suggestedMax: 5,
              padding: 10,
              fontColor: "#9a9a9a",
              callback: function(value, index, ticks) {
                return value + ` ${sensor.symbol}`;
              }
            }
          }],
          xAxes: [{
            barPercentage: 1.6,
            gridLines: {
              drawBorder: false,
              color: 'rgba(255,255,255,0.04)',
              zeroLineColor: "transparent",
            },
            ticks: {
              padding: 20,
              fontColor: "#9a9a9a"
            }
          }]
        }
      };
      this.fetchData();
    },
    fetchData() {
      let series = [];
      let labels = [];
      let xAxis = 0;
      this.sockets.subscribe(this.sensor.address, (data) => {
        this.voltage = data.body.voltage;
        this.computed = data.body.computed;
        series.push(this.computed);
        labels.push(xAxis);
        this.chartData = {
          datasets: [{
            borderColor: this.sensor.color,
            data: series
          }],
          labels: labels,
        }
        if(xAxis > this.chartRange){
          series.splice(0, 1);
          labels.splice(0, 1);
        }
        xAxis++;
      });
    },
    downloadLogs(){
      axios.get([process.env.VUE_APP_API, "logs", this.sensor.address].join("/"), {responseType: 'blob'})
        .then(response => {
          const blob = new Blob([response.data], {type: 'text/csv'})
          const link = document.createElement('a')
          link.href = URL.createObjectURL(blob)
          link.download = this.sensor.address
          link.click()
          URL.revokeObjectURL(link.href)
        }).catch(console.error)
    }
  }
};
</script>
<style>
</style>

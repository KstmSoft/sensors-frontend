<template>
  <div class="row">
    <router-link v-for="sensor in sensors" :to="{ name: 'details', query: {id: sensor.info.id}}" custom v-slot="{ navigate }">
      <div @click="navigate" class="col-xs-12 col-md-4 col-sm-4">
        <card type="chart" role="link" style="cursor: pointer">
          <template slot="header">
            <div class="row">
              <div class="col-sm-10">
                <h5 class="card-category">{{ sensor.info.address }}</h5>
                <h3 class="card-title">{{ sensor.info.tag }}</h3>
              </div>
            </div>
          </template>
          <div class="chart-area">
            <line-chart style="height: 100%"
                        ref="sensorChart"
                        chart-id="sensor-chart"
                        :chart-data="sensor.data"
                        :extra-options="sensor.options">
            </line-chart>
          </div>
        </card>
      </div>
    </router-link>
  </div>
</template>
<script>
import LineChart from '@/components/Charts/LineChart';
import * as chartConfigs from '@/components/Charts/config';

export default {
  components: {
    LineChart,
  },
  data() {
    return {
      chartRange: 5,
      sensors: []
    }
  },
  beforeRouteEnter(to, from, next) {
    fetch([process.env.VUE_APP_API, "sensor"].join("/")).then(response => {
      response.json().then(data => {
        next(vm => vm.setData(data));
      });
    }).catch(error => {
      console.error('Cannot load initial data: ', error);
    })
  },
  methods: {
    setData(sensors){
      sensors.forEach((sensor) => {
        this.sensors.push({
          info: sensor,
          options: {
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
          },
          series: [],
          labels: [],
          xAxis: 0,
          data: {
            datasets: [{
              data: []
            }],
            labels: [],
          },
        })
      });
      this.fetchData();
    },
    fetchData() {
      this.sensors.forEach((sensor)=>{
        this.sockets.subscribe(sensor.info.address, (data) => {
          sensor.series.push(data.body.computed);
          sensor.labels.push(sensor.xAxis);
          sensor.data = {
            datasets: [{
              borderColor: sensor.info.color,
              data: sensor.series
            }],
            labels: sensor.labels,
          }
          if(sensor.xAxis > this.chartRange){
            sensor.series.splice(0, 1);
            sensor.labels.splice(0, 1);
          }
          sensor.xAxis++;
        });
      });
    }
  }
};
</script>
<style>
</style>

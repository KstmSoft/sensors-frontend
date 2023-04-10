<template>
  <div>
    <div class="row">
      <div v-for="sensor in sensors" class="col-xs-12 col-md-4 col-sm-2">
        <card type="chart">
          <template slot="header">
            <div class="row">
              <div class="col-sm-10">
                <h5 class="card-category">{{ sensor.address }}</h5>
                <h2 class="card-title">{{ sensor.tag }}</h2>
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
    </div>
  </div>
</template>
<script>
import LineChart from '@/components/Charts/LineChart';
import * as chartConfigs from '@/components/Charts/config';
import {all, create} from "mathjs";

export default {
  components: {
    LineChart,
  },
  data() {
    return {
      sensors: [],
      chartData: {
        datasets: [{
          data: []
        }],
        labels: [],
      },
      extraOptions: {
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
              padding: 20,
              fontColor: "#9a9a9a"
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
    }
  },
  async created() {
    this.sensors = await this.getAllSensors();
  },
  methods: {
    async getAllSensors(){
      const response = await fetch([process.env.VUE_APP_API, "sensor"].join("/"));
      return await response.json();
    }
  }
};
</script>
<style>
</style>

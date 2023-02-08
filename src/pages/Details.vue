<template>
  <div>
    <div class="row">
      <div class="col-12">
        <card type="chart">
          <template slot="header">
            <div class="row">
              <div class="col-sm-10">
                <h5 class="card-category">Analog Read of {{ sensor.address }}</h5>
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
    </div>
  </div>
</template>
<script>
import LineChart from '@/components/Charts/LineChart';
import * as chartConfigs from '@/components/Charts/config';
import {all, create} from "mathjs";

const math = create(all);

export default {
  components: {
    LineChart,
  },
  data() {
    return {
      id: -1,
      sensor: {},
      voltage: 0,
      computed: 0,
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
    this.id = this.$route.query.id;
    this.sensor = await this.getSensor();
    this.fetchData();
  },
  methods: {
    async getSensor() {
      const response = await fetch([process.env.VUE_APP_API, "sensor", this.id].join("/"));
      return await response.json();
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
        if(xAxis > 20){
          series.splice(0, 1);
          labels.splice(0, 1);
        }
        xAxis++;
      });
    }
  }
};
</script>
<style>
</style>

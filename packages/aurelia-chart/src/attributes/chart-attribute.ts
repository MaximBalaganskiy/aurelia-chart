import { bindable, BindingMode, customAttribute, INode } from 'aurelia';
import { Chart, ChartOptions, ChartData, ChartConfiguration, ChartType } from 'chart.js';

@customAttribute('chart')
export class ChartAttribute {
  constructor(@INode private element: HTMLCanvasElement) { }

  activeChart?: Chart;
  private chartData: ChartConfiguration;

  @bindable
  type: ChartType;
  typeChanged() {
    this.chartData.type = this.type;
    this.refreshChart();
  }

  @bindable
  data: ChartData;
  dataChanged() {
    this.chartData.data = this.data;
    this.refreshChart();
  }

  @bindable({ mode: BindingMode.twoWay })
  nativeOptions: ChartOptions = {};

  attached() {
    this.chartData = {
      type: this.type,
      data: this.data,
      options: this.nativeOptions
    };

    this.activeChart = new Chart(this.element, this.chartData);
    this.nativeOptions = this.activeChart.options;
    this.refreshChart();
  }

  detached() {
    this.activeChart?.destroy();
    this.activeChart = undefined;
  }

  refreshChart() {
    if (this.activeChart) {
      this.activeChart.update();
      this.activeChart.resize();
    }
  }
}

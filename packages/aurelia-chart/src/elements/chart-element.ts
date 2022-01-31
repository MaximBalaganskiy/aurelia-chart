import { bindable, BindingMode, customElement, IObserverLocator } from 'aurelia';
import { Chart, ChartConfiguration, ChartData, ChartOptions, ChartType } from 'chart.js';
import { ModelObserver } from '../observers/model-observer';

@customElement('chart')
export class ChartElement {
  constructor(@IObserverLocator private observerLocator: IObserverLocator) { }

  activeChart?: Chart;
  chartData: ChartConfiguration;
  modelObserver?: ModelObserver;

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
    this.observe();
  }

  @bindable({ set: val => val || val === '' ? true : false, nullable: false })
  shouldUpdate: boolean;

  @bindable({ set: Number, nullable: false })
  throttle: number;

  @bindable({ mode: BindingMode.twoWay })
  nativeOptions: ChartOptions = {};

  @bindable
  canvasElement: HTMLCanvasElement;

  attached() {
    this.chartData = {
      type: this.type,
      data: this.data,
      options: this.nativeOptions
    };

    this.activeChart = new Chart(this.canvasElement, this.chartData);
    this.nativeOptions = this.activeChart.options;
    this.refreshChart();
    this.observe();
  }

  detached() {
    this.modelObserver?.unsubscribe();
    this.activeChart?.destroy();
    this.activeChart = undefined;
  }

  refreshChart() {
    if (this.activeChart) {
      this.activeChart.update();
      this.activeChart.resize();
    }
  }

  observe() {
    this.modelObserver?.unsubscribe();
    this.modelObserver = undefined;
    if (!this.shouldUpdate) {
      return;
    }
    this.modelObserver = new ModelObserver(this.observerLocator, this.data, () => this.refreshChart(), this.throttle);
    this.modelObserver.subscribe();
  }
}

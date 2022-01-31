import Aurelia from 'aurelia';
import { StandardConfiguration } from '@aurelia/runtime-html';
import {
  Chart, LineController, LineElement, PointElement, LinearScale, Title, DoughnutController, PieController, CategoryScale, ArcElement,
  Legend
} from 'chart.js';
import { App } from './app';
import { ChartConfiguration } from 'aurelia-chart';

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, DoughnutController, PieController, CategoryScale, ArcElement, Legend);

Aurelia
  // .register(StyleConfiguration.shadowDOM({
  //   // optionally add the shared styles for all components
  //   sharedStyles: [shared]
  // }))
  .register(StandardConfiguration)
  .register(ChartConfiguration)
  // To use HTML5 pushState routes, replace previous line with the following
  // customized router config.
  // .register(RouterConfiguration.customize({ useUrlFragmentHash: false }))
  .app(App)
  .start();

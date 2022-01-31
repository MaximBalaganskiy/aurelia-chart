import { ChartElement } from './elements/chart-element';
import { IContainer } from '@aurelia/kernel';
import { ChartAttribute } from './attributes/chart-attribute';

export { ChartElement, ChartAttribute };

export const ChartConfiguration = {
  register(container: IContainer): IContainer {
    return container.register(ChartElement, ChartAttribute);
  }
};

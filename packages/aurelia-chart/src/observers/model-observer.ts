import { CollectionKind, ICollectionObserver, ICollectionSubscriber, IObserver, ISubscriber } from '@aurelia/runtime';
import { IObserverLocator } from 'aurelia';

export class ModelObserver implements ISubscriber, ICollectionSubscriber {
  constructor(private observerLocator: IObserverLocator, model: unknown, private onChange: () => void, private throttle: number) {
    this.getObservers(model);
  }

  throttleTimeout?: ReturnType<typeof setTimeout>;
  observers: (IObserver | ICollectionObserver<CollectionKind.array>)[] = [];
  throttledHandler = () => {
    if (this.throttle <= 0) {
      return this.onChange();
    }

    if (!this.throttleTimeout) {
      this.throttleTimeout = setTimeout(() => {
        this.throttleTimeout = undefined;
        this.onChange();
      }, this.throttle);
    }
  };

  handleChange(): void {
    this.throttledHandler();
  }

  handleCollectionChange(): void {
    this.throttledHandler();
  }

  subscribe() {
    this.observers.forEach(x => x.subscribe(this));
  }

  unsubscribe() {
    this.observers.forEach(x => x.unsubscribe(this));
  }

  private getObjectType(obj: unknown) {
    if (obj instanceof Date) {
      return 'date';
    }
    return typeof obj;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private getObservers(model: any) {
    if (model instanceof Array) {
      const observer = this.observerLocator.getArrayObserver(model);
      this.observers.push(observer);
    }

    for (const property in model) {
      const typeOfData = this.getObjectType(model[property]);
      switch (typeOfData) {
        case 'object':
          this.getObservers(model[property]);
          break;
        default: {
          const observer = this.observerLocator.getObserver(model as object, property);
          if (observer) {
            this.observers.push(observer);
          }
          break;
        }
      }
    }
  }
}

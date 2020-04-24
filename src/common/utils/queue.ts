type anyFunc = (...args: any[]) => any;
type task = () => Promise<any | void>;
interface Options {
  concurrentTasksCount: number;
}
export class Queue {
  private queue: anyFunc[] = [];

  private options: Options;

  private activeTasksCount = 0;

  constructor(options: Options) {
    this.queue = [];
    this.options = options;
  }

  public push(fn: task) {
    return new Promise((resolve, reject) => {
      this.queue.push(() => {
        fn()
          .then(resolve)
          .catch(reject)
          .finally(() => {
            this.next();
          });
      });
      this.run();
    });
  }

  private run() {
    if (
      this.activeTasksCount >= this.options.concurrentTasksCount ||
      this.queue.length === 0
    ) {
      return;
    }
    while (
      this.activeTasksCount < this.options.concurrentTasksCount &&
      this.queue.length !== 0
    ) {
      const nextTask = this.queue.shift();
      this.activeTasksCount += 1;
      nextTask();
    }
  }

  private next() {
    this.activeTasksCount -= 1;
    this.run();
  }
}

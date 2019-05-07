type TPoolTask<T> = () => Promise<T>;

export class Pool {
  private readonly limit: number;
  private readonly timeout?: number;

  /**
   * @param {{limit: number, timeout: number}} options
   * @param {number} options.limit максимальное количество запущенных одновременно задач
   * @param {number} options.timeout [мс] таймаут выполнения задачи
   */
  constructor(options: { limit: number; timeout?: number }) {
    this.limit = options.limit;
    this.timeout = options.timeout;
  }

  /**
   * Запуск задачи
   * @param {TPoolTask[]} tasks
   */
  public run<T = any>(tasks: Array<TPoolTask<T>>): Promise<T[]> {
    if (tasks.length === 0) {
      return Promise.resolve([]);
    }

    return this.concurrentMap(tasks, (taskFactory: any) =>
      Promise.race([
        taskFactory(),
        this.wait().then(() => {
          throw new Error("Promise timeout");
        })
      ])
    );
  }

  private wait() {
    return new Promise(resolve => setTimeout(resolve, this.timeout));
  }

  private concurrentMap<T = any>(
    iterable: Array<TPoolTask<T>>,
    mapFunc: any
  ): Promise<T[]> {
    return new Promise(resolve => {
      const result: T[] = [];
      const iterator = iterable[Symbol.iterator]();
      let isIteratorStopped = false;
      let pendingTasks = 0;
      let currentIndex = 0;

      function runNextJob() {
        const nextItem = iterator.next();
        const i = currentIndex;
        currentIndex++;

        if (nextItem.done) {
          isIteratorStopped = true;

          if (pendingTasks === 0) {
            resolve(result);
          }

          return;
        }

        pendingTasks++;

        function addToResultAndRunNext(value: T) {
          result[i] = value;
          pendingTasks--;
          runNextJob();
        }

        Promise.resolve(nextItem.value)
          .then(element => mapFunc(element))
          .then(addToResultAndRunNext)
          .catch(addToResultAndRunNext);
      }

      for (let i = 0; i < this.limit; i++) {
        runNextJob();

        if (isIteratorStopped) {
          break;
        }
      }
    });
  }
}

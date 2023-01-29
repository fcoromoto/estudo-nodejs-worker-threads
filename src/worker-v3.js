const {parentPort, workerData} = require("worker_threads")

let label = `threadId ${workerData.threadId}`;
console.log(`${label} started`)
console.time(label);
let counter = 0;
for (let i = 0; i < 20_000_000_000/workerData.threadCount; i++) {
    counter++
}
console.timeLog(label)
parentPort.postMessage(counter)


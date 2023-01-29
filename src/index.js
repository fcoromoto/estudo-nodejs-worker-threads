const express = require('express')
const {Worker} = require("worker_threads")
const app = express()
const port = 3000
const THREAD_COUNT = 4;


app.get('/non-blocking', (req, res) => {
    res.send('This page is non-blocking')
})

app.get('/v1/blocking', async (req, res) => {
    let counter = 0;
    for (let i = 0; i < 20_000_000_000; i++) {
        counter++
    }
    res.send(`Result is ${counter}`)
})

app.get('/v2/blocking', async (req, res) => {

    const worker = new Worker('./src/worker-v2.js')
    worker.on('message', (data)=> {
        res.send(`Result is ${data}`)
    })

    worker.on('error', (error)=> {
        res.status(500).send(`Result is ${error}`)
    })
})

app.get('/v3/blocking', async (req, res) => {
    let threads = []
    for (let i = 0; i < THREAD_COUNT; i++) {
        threads.push(createWorker(THREAD_COUNT, i))
    }

    const result = await Promise.all(threads);
    const total = result[0] + result[1] + result[2] + result[3];
    res.send(`Result is ${total}`)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

function createWorker(threadCount, threadId) {
    return new Promise((resolve, reject) => {
        const worker = new Worker('./src/worker-v3.js',
            {workerData: {threadCount, threadId}})

        worker.on('message', (data) => {
            resolve(data)
        })

        worker.on('error', (error) => {
            reject(`Result is ${error}`)
        })
    })
}

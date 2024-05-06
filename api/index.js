import express from "express";
import { fetchTasks, createTasks, updateTasks, deleteTasks } from './task';
import serverless from "serverless-http";
import cors from "cors";

const app = express()
const port = 3001

// Without below code. App will cors error when run locally.
app.use(express.json());

if (process.env.DEVELOPMENT) {
    app.use(cors());
}

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/task', async (req, res) => {
    try {
        const tasks = await fetchTasks();
        res.send(tasks.Items)
    } catch (err) {
        res.status(400).send(`Error fetching tasks:${ err }`)
    }
})

app.post('/task', async (req, res) => {
    try {
        const task = req.body;
        const response = await createTasks(task);
        res.send(response);
    } catch (err) {
        res.status(400).send(`Error creating tasks:${ err }`)
    }
})

app.put('/task', async (req, res) => {
    try {
        const task = req.body;
        const response = await updateTasks(task);
        res.send(response);
    } catch (err) {
        res.status(400).send(`Error updating tasks:${ err }`)
    }
})

app.delete('/task/:id', async (req, res) => {
    try {
        const { id } = req.params
        const response = await deleteTasks(id);
        res.send(response);
    } catch (err) {
        res.status(400).send(`Error deleting tasks:${ err }`)
    }
})
// If it is local, then below server would run
// Because we are going to deploy our API on a Lambda function. Lambda's is serverless.

if (process.env.DEVELOPMENT) {
    app.listen(port, () => {
        console.log(`Example app listening on port ${ port }`)
    })
}

// If it is PRoduction. Then Serverless would run.

export const handler = serverless(app);

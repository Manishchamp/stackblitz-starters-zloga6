const express = require('express');
const { resolve } = require('path');

const app = express();
const port = 3010;
let cors = require('cors');
app.use(express.static('static'));
app.use(cors());

let tasks = [
  { taskId: 1, text: 'Fix bug #101', priority: 2 },
  { taskId: 2, text: 'Implement feature #202', priority: 1 },
  { taskId: 3, text: 'Write documentation', priority: 3 },
];
// ENDPOINT 1
function addTask(taskId, text, priority) {
  const newTask = {
    taskId: parseInt(taskId),
    text,
    priority: parseInt(priority),
  };
  tasks.push(newTask);
  return tasks;
}
app.get('/tasks/add', (req, res) => {
  // const taskId = req.query.taskId;
  // const text = req.query.text;
  // const priority = req.query.priority;
  const { taskId, text, priority } = req.query;
  const updatedTasks = addTask(taskId, text, priority);
  res.json({ tasks: updatedTasks });
});
// ENDPOINT 2
app.get('/tasks', (req, res) => {
  res.json({ tasks });
});
// ENDPOINT 3
function sortTasksByPriority(tasks) {
  let result = tasks.slice();
  result.sort((a, b) => a.priority - b.priority);
  return result;
}
app.get('/tasks/sort-by-priority', (req, res) => {
  const sortedTasks = sortTasksByPriority(tasks);
  res.json({ tasks: sortedTasks });
});
// ENDPOINT 4
function updateTaskPriorityById(tasks, taskId, priority) {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].taskId === taskId) {
      tasks[i].priority = priority;
    }
  }
  return tasks;
}
app.get('/tasks/edit-priority', (req, res) => {
  const taskId = parseInt(req.query.taskId);
  const priority = parseInt(req.query.priority);

  const updatedTasks = updateTaskPriorityById(tasks, taskId, priority);
  res.json({ tasks: updatedTasks });
});
// ENDPOINT 5
function updateTaskTextById(tasks, taskId, text) {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].taskId === taskId) {
      tasks[i].text = text;
    }
  }
  return tasks;
}

app.get('/tasks/edit-text', (req, res) => {
  const taskId = parseInt(req.query.taskId);
  const text = req.query.text;
  const updatedTasks = updateTaskTextById(tasks, taskId, text);
  res.json({ tasks: updatedTasks });
});
// ENDPOINT 6
function shouldDeleteById(task, taskId) {
  return task.taskId !== taskId;
}
app.get('/tasks/delete', (req, res) => {
  const taskId = parseInt(req.query.taskId);
  tasks = tasks.filter((task) => shouldDeleteById(task, taskId));
  res.json({ tasks });
});
// ENDPOINT 7
function filterByPriority(task, priority) {
  return task.priority === priority;
}
app.get('/tasks/filter-by-priority', (req, res) => {
  const priority = parseInt(req.query.priority);
  const result = tasks.filter((task) => filterByPriority(task, priority));
  res.json({ tasks: result });
});

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

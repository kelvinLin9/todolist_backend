const { v4: uuidv4 } = require('uuid');
const errorHandle = require('./errorHandle');
const { sendSuccess } = require('./responseHandle');

const todos = [];

const getTodos = (req, res) => {
    sendSuccess(res, todos);
};

const createTodo = (req, res) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        try {
            const { title } = JSON.parse(body);
            if (title) {
                const todo = { title, id: uuidv4() };
                todos.push(todo);
                sendSuccess(res, todos);
            } else {
                errorHandle(res);
            }
        } catch (err) {
            errorHandle(res);
        }
    });
};

const deleteAllTodos = (req, res) => {
    todos.length = 0;
    sendSuccess(res, todos);
};

const deleteTodoById = (req, res) => {
    const id = req.url.split('/')[2];
    const index = todos.findIndex(todo => todo.id === id);
    if (index !== -1) {
        todos.splice(index, 1);
        sendSuccess(res, todos);
    } else {
        errorHandle(res);
    }
};

const updateTodoById = (req, res) => {
    const id = req.url.split('/')[2];
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        try {
            const { title } = JSON.parse(body);
            const index = todos.findIndex(todo => todo.id === id);
            if (index !== -1 && title) {
                todos[index].title = title;
                sendSuccess(res, todos);
            } else {
                errorHandle(res);
            }
        } catch (err) {
            errorHandle(res);
        }
    });
};

module.exports = { getTodos, createTodo, deleteAllTodos, deleteTodoById, updateTodoById };

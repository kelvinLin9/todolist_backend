const http = require('http');
const {
  getTodos,
  createTodo,
  deleteAllTodos,
  deleteTodoById,
  updateTodoById
} = require('./router');

const requestListener = (req, res) => {
  const { url, method } = req;

  if (url === '/todos') {
    if (method === 'GET') getTodos(req, res);
    else if (method === 'POST') createTodo(req, res);
    else if (method === 'DELETE') deleteAllTodos(req, res);
    else res.writeHead(405).end();
  } else if (url.startsWith('/todos/') && method === 'DELETE') {
    deleteTodoById(req, res);
  } else if (url.startsWith('/todos/') && method === 'PATCH') {
    updateTodoById(req, res);
  } else {
    res.writeHead(404).end();
  }
};

const server = http.createServer(requestListener);
server.listen(process.env.PORT || 3005);

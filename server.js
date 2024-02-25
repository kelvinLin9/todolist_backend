const http = require('http');
const { v4: uuidv4 } = require('uuid');
const errorHandel = require('./errorHandel');

const todos = []


const requestListener = (req, res) => {
  console.log(req.url)
  console.log(req.method)
  const headers = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET, OPTIONS, DELETE',
    'Content-Type': 'application/json'
 }

  let body = '';

  req.on('data', chunk => {
    body += chunk;
  })


  if (req.url === '/todos' && req.method === 'GET') {
    res.writeHead(200, headers);
    res.write(JSON.stringify({
      "status": "success", 
      "data": todos
    }))
    res.end();
  } else if(req.url === '/todos' && req.method === 'POST') {
    req.on('end', () => {
      try {
        const title = JSON.parse(body).title
        if (title !== undefined) {
          const todo = {
            "title": title,
            "id": uuidv4()
          }
          todos.push(todo)
          res.writeHead(200, headers);
          res.write(JSON.stringify({
            "status": "success", 
            "data": todos
          }))
          res.end();
        } else {
          errorHandel(res)
        }
      } catch (err) {
        errorHandel(res)
      }
    })
  } else if(req.url === '/todos' && req.method === 'DELETE') {
    todos.length = 0
    res.writeHead(200, headers);
    res.write(JSON.stringify({
      "status": "success", 
      "data": todos
    }))
    res.end();
  } else if (req.url.startsWith('/todos/') && req.method === 'DELETE') {
    const id = req.url.split('/')[2]
    const index = todos.findIndex(todo => todo.id === id)
    if (index !== -1) {
      todos.splice(index, 1)
      res.writeHead(200, headers);
      res.write(JSON.stringify({
        "status": "success", 
        "data": todos
      }))
      res.end();
    } else {
      errorHandel(res)
    }

  } else if (req.url.startsWith('/todos/') && req.method === 'PATCH') {
    const id = req.url.split('/')[2]
    const index = todos.findIndex(todo => todo.id === id)
    if (index !== -1) {
      req.on('end', () => {
        try {
          const todo = JSON.parse(body).title
          if (todo !== undefined) {
            todos[index].title = todo
            res.writeHead(200, headers);
            res.write(JSON.stringify({
              "status": "success", 
              "data": todos
            }))
            res.end();
          } else {
            errorHandel(res)
          }
        } catch (err) {
          errorHandel(res)
        }
      })
    } else {
      errorHandel(res)
    }

  } else if (req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.write(JSON.stringify({
      "status": "success", 
      "data": todos
    }))
    res.end();
  } 
  else {
    res.writeHead(404, headers);
    res.write(JSON.stringify({
      "status": "failure", 
      "massage": "無此網站路由"
    }))
    res.end();
  }
  
}

const server = http.createServer(requestListener);
server.listen(process.env.PORT || 3005)
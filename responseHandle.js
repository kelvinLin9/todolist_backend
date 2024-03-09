const headers = {
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'PATCH, POST, GET, OPTIONS, DELETE',
  'Content-Type': 'application/json'
};

function sendSuccess(res, data) {
  res.writeHead(200, headers);
  res.write(JSON.stringify({
      status: "success", 
      data
  }));
  res.end();
}

module.exports = { sendSuccess };

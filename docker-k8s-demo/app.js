const http = require('http');
const os = require('os');

const requestHandler = (req, res) => {
  res.writeHead(200);
  res.end('Are You Ok');
}

const server = http.createServer(requestHandler);

server.listen(8080, () => {
  console.log(`server is listening at ${os.hostname()}:8080`);
});

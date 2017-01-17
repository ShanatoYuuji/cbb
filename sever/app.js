var http = require('http');
http.createServer(function(req, res){
  res.writeHead(200,{'Content-Type': 'text/html'});
  res.write('</pre><h1>shiori</h1><pre>');
  res.end('一矢光明的主页');
}).listen(80);
console.log("http server is listening at port 80.");

var http=require('http');
var url=require('url');
var fs=require('fs');
exports.root="../"

var on200=function(req,res){
	fs.readFile("../webpage/home.html", "binary", function(err,file){
		var pg=require('pg');
		//构造连接数据库的连接字符串："tcp://用户名:密码@ip/相应的数据库名"   
		var conString = "tcp://postgres:123zzz@localhost/postgres";  
		var client = new pg.Client(conString);  //构造一个数据库对象   
		  
		//连接数据库，连接成功，执行回调函数   
		/**
		client.connect(function(error, results) {
		     if(error){  
		            console.log('ClientConnectionReady Error: ' + error.message); 
		        }  
		        console.log("client.connect OK.\n");  
		});  
		
		var query=client.query("select * from shiori");
		query.on('row',function(result){
			console.log(result);
			res.writeHead(200,{'Content-Type' : 'text/html'});  
	        res.end();
	        res.end(file,'binary');
		})
		**/
			client.connect(function (err) {
			  if (err) throw err;
			
			  // execute a query on our database
			  client.query('select * from shiori', function (err, result) {
			    if (err) throw err;
			
			    // just print the result to the console
			    console.log(result); // outputs: { name: 'brianc' }
				res.writeHead(200,{'Content-Type' : 'text/html'});
				for(var i=0;i<result.rowCount;i++){
					res.write(JSON.stringify(result.rows[i].a));
					res.write('<br/>');	
				}  
				res.end();
			    // disconnect the client
			    client.end(function (err) {
			      if (err) throw err;
			    });
			  });
			});

	});
};
http.createServer(function(req,res){
	on200(req,res);
}).listen(80,'127.0.0.1');
console.log("Server running at 80");





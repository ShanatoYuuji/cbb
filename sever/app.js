var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path')

var MIME = require('./MIME.json');
var onFiles = function(req, res) {
	req.setEncoding('utf-8');
	var pathname = url.parse(req.url).pathname;
	pathname = path.normalize(pathname.replace("\.\.", ""));
	console.log(pathname);
	if(pathname == "\\" || pathname === "\\" || pathname == "\.\.\/" || pathname === "\.\.\/" || pathname == "\/" || pathname === "\/" ||
		pathname == "/" || pathname === "/") {
		//pathname = "/webpage/home.html";/
		pathname = "/webpage/home.html"
		//pathname = "/pages/output.html"
	};
	//这里可以控制文件的路径  文件对于此js11的路径
	var filepath = "\.\." + pathname;
	fs.readFile(filepath, "binary", function(err, file) {
		if(err) {
			var pg = require('pg');
			//构造连接数据库的连接字符串："tcp://用户名:密码@ip/相应的数据库名"   
			var conString = "tcp://postgres:123zzz@localhost/postgres";
			var client = new pg.Client(conString); //构造一个数据库对象   
			client.connect(function(err) {
				if(err) throw err;
				var filesearch = filepath.replace("..\\pages\\", "");
				// execute a query on our database
				var searchstring='select * from shiori where a='+filesearch;
				console.log(searchstring);
				client.query(searchstring, function(err, result) {
					if(err) throw err;

					// just print the result to the console
					console.log(result); // outputs: { name: 'brianc' }
					res.writeHead(200, {
						'Content-Type': 'text/javascript;charset=UTF-8'
					});

					res.write(filesearch);
					res.write('\n')
					for(var i = 0; i < result.rowCount; i++) {
						res.write(JSON.stringify(result.rows[i].b));
						res.write('\n');
					}
					res.end();
					// disconnect the client
					client.end(function(err) {
						if(err) throw err;
					});
				});
			});

			/*
			console.log(filepath);
			console.log("路径出错");
			res.writeHead(200, {
				'Content-Type': 'text/javascript;charset=UTF-8'
			});
			res.write(pathname);
			res.end("\n没有这个地址");*/
		} else {
			var ext = path.extname(filepath);
			ext = ext ? ext.slice(1) : 'unknown';
			//文件类型
			var contentType = MIME[ext] || "application/octet-stream";
			console.log(contentType);
			res.writeHead(200, {
				'Content-Type': contentType
			});
			res.write(file, "binary");
			res.end();
		}

	})
}

//允许访问网页
var webpath = {
	"/": "/webpage/home.html",
	"/about": "/webpage/home.html",
	"/page1": "/pages/homework01.html",
	"/page2": "/pages/homework02.html",
	"/page3": "/pages/homework03.html"
}

//内容返回
var on202 = function(req, res, bodyStr) {
	//设置为UTF-8
	res.writeHead(200, {
		'Content-Type': 'text/javascript;charset=UTF-8'
	});
	res.end(bodyStr);
}

//网页返回
var on200 = function(req, res, pathname) {
	var pathname = ".." + pathname;
	fs.readFile(pathname, "utf-8", function(err, file) {
		res.write(file, "utf-8");
		res.end();
	});
};

http.createServer(function(req, res) {
	//		var pathname = url.parse(req.url).pathname;
	//		var bodyStr = webpath[pathname];
	//		if(bodyStr) {
	//			//on202(req, res, bodyStr);
	//			on200(req, res,bodyStr);
	//		} else {
	//			res.writeHead(200, {
	//				'Content-Type': 'text/javascript;charset=UTF-8'
	//			});
	//			res.write(pathname);
	//			res.end("\n没有这个地址");
	//		}
	onFiles(req, res);

}).listen(80);
console.log("http server is listening at port 80.1");
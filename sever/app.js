var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var express=require('express');
var session=require('express-session');

var MIME = require('./MIME.json');
var onFiles = function(req, res) {
	//请求
	console.log("请求的内容");
	console.log(req);
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
			//	请求url操作
			var stringurl = req.url;
			var strurllst = stringurl.split('\/');
			var stringreq = strurllst[strurllst.length - 1];
			//对请求的地址做编码转换
			var stringreq =decodeURIComponent(stringreq);
			console.log("请求的参数为："+stringreq);
			if(stringreq=='favicon.ico'||stringreq.length<1){
				return ;
			}
			var stringreqls=stringreq.split(".");
			var ppp=stringreqls[0];
			var pagecount=stringreqls[1];
			
			if(!isNumber(pagecount)){
				return ;
			}
			var pg = require('pg');
			//构造连接数据库的连接字符串："tcp://用户名:密码@ip/相应的数据库名"   
			var conString = "tcp://postgres:123zzz@localhost/postgres";
			var client = new pg.Client(conString); //构造一个数据库对象   
			client.connect(function(err) {
				if(err) throw err;
				//下面是数据库查询
				// execute a query on our database
				//console.log(searchstring);
				//var searchstring = 'select * from shiori where a='+stringreq;
				//var searchstring = "select title,link from jiying where title LIKE '%"+stringreq+"%' order by id limit 10";
				var searchstring;
				if(pagecount<=1){
					searchstring="select title,link from jiying where title LIKE '%"+ppp+"%' order by id limit 50";
				}else{
					 searchstring="select title,link from jiying where title LIKE '%"+ppp+"%' AND id>(select MAX(id) from (select id from jiying where 						title LIKE '%"+ppp+"%' order by id limit "+50*pagecount+ ")b ) order by id limit 50";
					
				}
				
				console.log("查询语句");
				console.log(searchstring);
				client.query(searchstring, function(err, result) {
					if(err) throw err;

					// just print the result to the console
					console.log(result); // outputs: { name: 'brianc' }
					res.writeHead(200, {
						'Content-Type': 'text/javascript;charset=UTF-8'
					});

					//res.write("请求的参数为："+filesearch);
					res.write('\n')
					for(var i = 0; i < result.rowCount; i++) {
						res.write(JSON.stringify(result.rows[i].title));
						res.write(JSON.stringify(result.rows[i].link));
						res.write('</br>');
					}
					res.end();
					// disconnect the client
					client.end(function(err) {
						if(err) throw err;
					});
				});
			});
			//没有访问路径的处理
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

//正则表达式来判断是否为正整数
function isNumber(value){
	var patrn=/^[0-9]*[1-9][0-9]*$/;
	if(patrn.exec(value)==null||value==""){
		return false;
	}else{
		return true;
	}

}

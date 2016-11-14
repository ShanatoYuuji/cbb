var http=require('http');
var url=require('url');
var fs=require('fs');
exports.root="../"

var on200=function(req,res){
	fs.readFile("../webpage/home.html", "binary", function(err,file){
		res.end(file,"binary");
	});
};
http.createServer(function(req,res){
	on200(req,res);
}).listen(80,'127.0.0.1');
console.log("Server running at 80");





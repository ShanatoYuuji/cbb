var MIME=require('../data/MINE.json');
var cfg=require('../config.js');
var http=require('http');
var url=require('url');

var onFiles=function(req,res){
	
	var pathname=url.parse(req.url).pathname;
	pathname=Path.noResize(pathname.replace(/\.\./g,""));
	if(pathname===""){
		pathname=cfg.index;
	}
	var filepath=cfg.root+pathname;
	console.log(req.url);
}
onFiles();


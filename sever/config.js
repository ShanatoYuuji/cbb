var MIME = require('MIME.json');
var onFiles = function(req, res)｛
var pathname = url.parse(req.url).pathname;
pathname = path.normalize(pathname.replace(/\.\./g, ""));
		if(pathname === "\\") {
			pathname = "/webpage/home.html";
		}
		//这里可以控制文件的路径
		var filepath = pathname;
		fs.readFile(filepath, "binary", function(err, file) {
			var ext = path.extname(filepath);
			ext = ext ? ext.slice(1) : 'unknown';
			//文件类型
			var contentType = MIME[ext] || "application/octet-stream";
			res.writeHead(200, {
				'Content-Type': 'text/javascript;charset=UTF-8'
			});
			res.write(file, "binary");
			res.end();
		})
｝
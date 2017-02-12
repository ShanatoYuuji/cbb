var pg=require('pg');

//构造连接数据库的连接字符串："tcp://用户名:密码@ip/相应的数据库名"   
var conString = "tcp://postgres:123zzz@localhost/postgres";  
var client = new pg.Client(conString);  //构造一个数据库对象   
  
//连接数据库，连接成功，执行回调函数   
client.connect(function(error, results) {  
     if(error){  
            console.log('ClientConnectionReady Error: ' + error.message); 
        }  
        console.log("client.connect OK.\n");  
});  

var query=client.query("select * from shiori");

query.on('row',function(row){
	console.log(row);
})

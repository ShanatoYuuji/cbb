/**
 * New node file
 */
		var eg={};
		eg.$=function (id){
			return document.getElementById(id);
		};
		eg.sayout=function(content){
			alert(content);
		};
		//改变式样随着安全性
		eg.addEvent=function(){
			var pwd=eg.$("userpwd");
			eg.addListener(pwd,"keyup",function(){
				var lv=0;
				if(pwd.value.length>1&&pwd.value.length<3){
					lv=25;
				}else if(pwd.value.length>=3&&pwd.value.length<5){
					lv=50;
				}else if(pwd.value.length>=5&&pwd.value.length<10){
					lv=75;
				}else if(pwd.value.length>=10){
					lv=100;
				};
				eg.$("pwdLv").style.width=lv+"px";
			} );
			
		};
		//监听共同方法
		eg.addListener=function(target,type,handler){
			if(target.addEventListener){
				target.addEventListener(type,handler,false);
			}else if(target.attachEvent){
				target.attachEvent("on"+type,handler)
			}else{
				target["on"+type]=handler;
			}
		}
		
		
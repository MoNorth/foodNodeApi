
var http = require("http");
var url = require("url");
var request = require("request");

var appkey = "6bee6b529abf6d2524916c57eaf94f9e";
var src = "http://apis.baidu.com/tngou/cook/name";



var getMessage = function(oldData){
	var newData = [];
	if(!oldData["status"])
		return newData;
	oldData = oldData["tngou"];
	for(var tngou in oldData)
	{
		var message = oldData[tngou]["message"];
		if(message)
		{
			var sm = {};
			message = message.replace(/\n/g,"").replace(/\s/g,"").replace(/<hr>/g,"");
			sm["img"] = "http://tnfs.tngou.net/img" + oldData[tngou]["img"];
			sm["message"] = message;
			newData.push(sm);
		}
		
	}
	return newData;

}




var server = http.createServer(function(req,response){
	response.setHeader("Content-Type", "text/html");
	response.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
	var arg = url.parse(req.url,true).query;
	console.log((new Date()).toLocaleString() + " : " + arg.name);
	var result = {};
	request({
		url : src + '?name=' + encodeURI(arg.name),
		method : 'GET',
		headers : {
			apikey : appkey
		}
	},function(err,res,body){
		if(err){
			result.statu = 0;
			result.result = [];
			response.end(JSON.stringify(result));
			return;
		}
		body = JSON.parse(body);
		result.statu = 1;
		result.result = getMessage(body);
		// response.end(JSON.stringify(result));
		if(arg.callback)
			response.end(arg.callback + "(" + JSON.stringify(result) + ")");
		else
			response.end(JSON.stringify(result));
		// response.end("asd");

	});

});
server.listen(8080);
console.log("Begin in : " + (new Date()).toLocaleString());
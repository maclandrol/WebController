
/**
 * Module dependencies.
 */

var express = require('express');
var path = require('path');
var app =module.exports=express();
var exec = require('child_process').exec;
//execute fonction
function execute(command, callback){
    exec(command, function(error, stdout, stderr){ 
    	console.log(stdout);
    	if(error!==null){
    		callback('exec error: '+error);
    	}
    	else{
    		var result= stdout.trim().split('\n').join("</li><li>");
    		if(result){
    			callback("<ol><li>".concat(result, '</li><ol>'));
    		}
    			
    		else{
    			callback("No result found !!")
    		}
    	}});
};

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.configure(function () {
    app.use("/",express.static(path.join(__dirname, 'public')));
  	app.use(express.methodOverride());
  	app.use(express.json());
	app.use(express.urlencoded());
});


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
}


app.post('/execute', function(req, res){
	console.log('params: ' + JSON.stringify(req.params));
	//Get information from data
	message= req.body.message;
	myFunc=req.body.func;
	myFile=req.body.file;

	console.log('body: ' + JSON.stringify(req.body));
	console.log('query: ' + JSON.stringify(req.query));
	res.writeHead(200, { 'Content-Type': 'text/plain'}); 
	var command=function getCommand(func, file){
			var command="pwd";
			if(func==='find'){
				command="sudo find ~/ -name '*"+file+"*' -print";
			}
	 			execute(command, function(stdout){
	   				res.end(stdout);
	 			});
	}
	if(message==="execute"){
		console.log('Will execute your message');
		
		command(myFunc,myFile);
	}
	else {
		console.log('Will not execute your message');
 		res.end('Not executable'+'\n');
  } 
});

app.listen(app.get('port'), function(){
	console.log("Express server created and listening on port %d in %s mode", app.get('port'), app.settings.env);
});
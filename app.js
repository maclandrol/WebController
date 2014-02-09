
/**
 * Module dependencies.
 */

var express = require('express');
var path = require('path');
var app =module.exports=express();
var exec = require('child_process').exec;

//execute command with callback as argument
function execute(command, callback){
    exec(command, function(error, stdout, stderr){ 
    	console.log(stdout);
    	if(error!==null){
    		callback('exec error: '+error);
    	}
    	else{//Format data into html tag
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
//Configure static path and app specification
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

//Listen to data posted on localhost:port/execute
app.post('/execute', function(req, res){
	console.log('params: ' + JSON.stringify(req.params));
	//Get information from data
	message= req.body.message;
	myFunc=req.body.func;
	myFile=req.body.file;
	//Print information ...
	console.log('body: ' + JSON.stringify(req.body));
	console.log('query: ' + JSON.stringify(req.query));
	res.writeHead(200, { 'Content-Type': 'text/plain'}); 
	//GetCommand output after execution
	var command=function getCommand(func, file){
			var task="pwd"; //default task = pwd
			if(func==='find'){ //case find
				task="sudo find ~/ -iname '*"+file+"*'";
			}
	 			execute(task, function(stdout){
	   				res.end(stdout);
	 			});
	}
	if(message==="execute"){//we are execution state
		console.log('Will execute your message');
		
		command(myFunc,myFile);
	}
	else { //no need to execute
		console.log('Will not execute your message');
 		res.end('Not executable'+'\n');
  } 
});

//listen to server on selected port
app.listen(app.get('port'), function(){
	console.log("Express server created and listening on port %d in %s mode", app.get('port'), app.settings.env);
});

var express = null;
var app = null;
var fs = null;
var path = null;
var fileUpload = null;
var itemManager = null;

const PORT = 40000;
const PATH_DATABASE = 'database';
const PATH_IMAGE = 'image';
const PATH_IMAGE_ITEM = PATH_IMAGE + '/' + 'item';

//setting middleware
//app.use(express.static(__dirname)); //Serves resources from public folder

try{
	fs = require('fs');
	path = require('path');
	express = require('express');
	fileUpload = require('express-fileupload');
	itemManager = require('./ItemManager');

	itemManager.init( PATH_IMAGE_ITEM );

	app = express();

	var _pathDB = __dirname + '/' + PATH_DATABASE;
	if (!fs.existsSync(_pathDB)){fs.mkdirSync(_pathDB);}

	app.use(fileUpload());
	app.use(express.static(__dirname + '/web')); //Serves resources from public folder
	app.use('/image',express.static(__dirname + '/image')); //Serves resources from public folder

	var _pathImage = __dirname + '/' + PATH_IMAGE_ITEM ;

	app.post('/addItem', function(req, res) {
		console.log( JSON.stringify(req.body) );
		if (!req.files)return res.status(400).send('No files were uploaded.');

  		var imageFile= req.files.imageFile;
		var _ext = path.extname( imageFile.name )

		var newItemName = itemManager.addItem( req.body, _ext ); 
		console.log( newItemName );
	
		if (!fs.existsSync(_pathImage + '/' + newItemName )){fs.mkdirSync(_pathImage + '/' + newItemName);}
		imageFile.mv( _pathImage + '/' + newItemName + '/' + newItemName + _ext, function(err) {
			if (err)return res.status(500).send(err);
			res.redirect('/page_itemManage.html');
			//res.send('File uploaded!');
		});
	});

	var server = app.listen(PORT);
	console.log('The magic happening in ' + PORT);
} catch (e) {
	console.log('App initing failing...' + e.toString());
}

const io = require('socket.io')(server);
io.on('connection', function(socket) {
	var _arr = itemManager.readAllLast();
	socket.emit('ITEM_LIST', { 'items':_arr } );
	socket.on('GET_OBELIST', function(msg) {
	});
});

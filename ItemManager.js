var fs = null;
var dateformat = null;

var PATH_DATABASE = '';
var PATH_ITEM = '';
var PATH_FULL = '';

var gDicItems = {};

exports.init = function(){
	return init();
}

exports.addItem = function( _item, _ext){
	return addItem(_item, _ext);
}

function addItem(_item, _ext){
	var date_time = dateformat(new Date(), "yymmdd_HHMMss");
	var _newItem = [
		{
        		"DATETIME": date_time,
        		"TYPE": _item.itemType,
        		"NAME": {
        		    "SHORT": _item.shortName,
        		    "FULL": _item.fullName 
        		},
        		"PRICE": {
        		    "VISIT": _item.priceVisit,
        		    "ONLINE": _item.priceOnline,
        		    "UBER": _item.priceUber
        		},
        		"STATUS": _item.status ,
        		"IMAGE": date_time + ext 
		}
	]
	console.log( JSON.stringify( _newItem ) );
	fs.writeFile(PATH_FULL + date_time, JSON.stringify( _newItem , null, 4));
	return date_time;
}

function init(){
	try{
                fs = require('fs');
		dateformat = require('dateformat');

		PATH_DATABASE = 'database';
		PATH_ITEM = 'item';

		//CONFIG = JSON.parse(fs.readFileSync('config.json', 'utf8'));
		PATH_FULL = __dirname + '/' + PATH_DATABASE + '/' + PATH_ITEM  + '/'
		if (!fs.existsSync(PATH_FULL)){fs.mkdirSync(PATH_FULL);}
		return true;
	} catch(e) {
		//write('MULTI', 'INFO', 'init failing', e.toString());
		console.log('ItemManager initing failing...' + e.toString());
		return false;
	}
}

function readAll(){
	fs.readdirSync(PATH_FULL).forEach(file => {
		if (fs.statSync(PATH_FULL + file).isDirectory() == false ) {
			gDicItems[ file ] = JSON.parse(fs.readFileSync(PATH_FULL + file , 'utf8'));
		}
	});
	/* DEBUG
	for (let key of Object.keys(gDicItems)) {
		console.log( JSON.stringify( gDicItems[key] )) ; 
	}
	*/
}

function writeNewItem( _json ) {
	gDicItems[ _key ] = _rt;
	// DEBUG console.log( JSON.stringify( gDicItems[ _key ][0] ) );
}

function reWrite( _key ) {
	var _rt = gDicItems[ _key ];
	if( _rt != undefined && _rt != null ){
		//console.log( _rt );
		_rt[0].TYPE = 'MEAL';
	}
	fs.writeFile(PATH_FULL + _key , JSON.stringify( _rt , null, 4));
	gDicItems[ _key ] = _rt;
	// DEBUG console.log( JSON.stringify( gDicItems[ _key ][0] ) );
}


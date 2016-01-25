var md5=require('../../../node_modules/md5/md5.js');

function encryption(str){
	var sign=md5('e8f9fdc8a37b12b2'+str+'656fd6a3499f249d');
	return sign;
}

module.exports=encryption;
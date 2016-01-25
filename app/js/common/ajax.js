/*
*初始化一个对象，用来发起ajax请求
*@param{object} options
*/
ajax = function(options){
	var defaultOptions = {
		async:true
	};
	options = extend(defaultOptions,options);

	//核心功能对象，包含了xhr并实现了需求中各方法和属性
	var _obj = {
		xhr:createXhr(),//xhr对象
		successCallbacks:[],
		errorCallbacks:[],
		alwaysCallbacks:[],
		options:options
	};

	/**
	*设置前置处理方法
	*@param {Function} callback
	*/
	_obj.before = function(callback){
		typeof(callback) ==='function' && callback(_obj.xhr);
		return _obj;//为支持链式操作，将原对象返回
	};

	/**
	*设置单个请求头
	*header方法必须在get|post方法之前执行，否则请求已发出再设置header没意义
	*@param {String} name
	*@param {String} value
	*/
	_obj.header = function(name,value){
		_obj.xhr.setRequestHeader(name,value);
		return _obj;
	};

	/**
	*设置多个请求头
	*@param {Object} headers
	*/
	_obj.headers = function(headers){
		for(name in headers){
			_obj.xhr.setRequestHeader(name,headers[name]);
		}
		return _obj;
	};

	/**
	*成功时的回调
	*@param {function} callback
	*@param {Boolean} jsonForceValidate
	*/
	_obj.success = function(callback,jsonForceValidate){
		_obj.jsonForceValidate = jsonForceValidate;
		if(typeof(callback) ==='function'){
			_obj.successCallbacks.push(callback);
		}
		return _obj;
	};

	/**
	*失败时的回调
	*@param {function} callback
	*/
	_obj.error = function(callback){
		if(typeof(callback) === 'function'){
			_obj.errorCallbacks.push(callback);
		}
		return _obj;
	}

	/**
	*设定超时时间并绑定超时回调
	*@param {object} timeout
	*@param {function} callback
	*/
	_obj.timeout = function(timeout,callback){
		_obj.xhr.timeout = timeout;
		if(typeof(callback) ==='function'){
			_obj.xhr.ontimeout =function(){
				callback(_obj.xhr);
			}
		}
		return _obj;
	};
	/**
	*以get method方式请求
	*/
	_obj.get = function(url,data){
		if(typeof(url) === 'undefined') throw 'url 不能为空';
		/*if(object.prototype.toString.call(data) !== '[object object]')data = undefined*/
		doAjax(_obj,'get',url,data,'urlencoded');
		return _obj;
	}

	/**
	*以psot method 发起ajax请求
	*/
	_obj.post = function(url,data,contentType){
		if(typeof(url) === 'undefined') throw 'url 不能为空';
		if(typeof(contentType)!== 'string') contentType = 'undefined';
		doAjax(_obj,'post',url,data,contentType);
		return _obj;
	}

	return _obj;
}


function doAjax(_obj,method,url,data,contentType){
	var xhr = _obj.xhr;
	//编码数据对象
	data = encodeData(data,contentType);
	//如果是get请求，将编码后的data做为查询参数附加到url上
	if(method=='get'){
		url +=(url.indexOf('?') == -1?'?':'&') + data;
	}
	//绑定事件处理器
	bindEventHandler(_obj);
	//open
	xhr.open(method,url,_obj.options.async);
	//send
	if(method=='post' && data){
		xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
		xhr.send(data);
	}else{
		xhr.send();
	}
}

function bindEventHandler(_obj){
	var xhr=_obj.xhr;
	xhr.onreadystatechange = function(){
		//仅当请求完成时执行处理
		if(xhr.readyState == 4){
			var i,len;
			for(i =0,len = _obj.alwaysCallbacks.length;i<len;++i){
				_obj.alwaysCallbacks[i](xhr.status,xhr.responseText,xhr);
			}
			//根据是否成功，决定调用 success or error
			var resText = xhr.responseText;
			var resJson = toJson(resText);
			if(xhr.status == 200){
				if(_obj.jsonForceValidate && typeof(resJson) === 'undefined'){
					//强制json格式验证且转换失败，触发errorcallback
					for(i =0,len = _obj.errorCallbacks.length;i<len;++i){
						_obj.errorCallbacks[i](xhr.status,xhr.responseText,xhr);
					}
				}else{
					for(i = 0,len = _obj.successCallbacks.length;i<len;++i){
						_obj.successCallbacks[i](resJson||resText,xhr);
					}
				}
			}else{
				//非200状态调用errorCallback
				for(i = 0,len = _obj.errorCallbacks.length;i<len;++i){
					_obj.errorCallbacks[i](xhr.status,xhr.responseText,xhr);
				}
			}
		}
	}
}

function toJson(text){
	var json;
	try{
		if(typeof(JSON) === 'object' && typeof(JSON.parse) === 'function'){
			json = JSON.parse(text);
		}else{
			json = eval(text);
		}
	}catch(e){

	}
	return json;
}

function encodeData(data,contentType){
	var dataString='';
	if(contentType=='json'){
		var data=JSON.stringify(data);
		data=data.slice(1,data.length-1);
		if(data!=''){
			var arr=data.split(',');
			arr.forEach(function(e){
				var e=e.split(':');
				dataString+='&'+e[0].slice(1,e[0].length-1)+"="+e[1].slice(1,e[1].length-1);
			});
		}
		return dataString;
	}else{
		return dataString;
	}
}

function createXhr(){
	var xmlHttp = null;
    try{ 
         xmlHttp=new XMLHttpRequest(); 
    } 
    catch (e){ // Internet Explorer 
        try { 
            xmlHttp=new ActiveXObject("Msxml2.XMLHTTP"); 
        } 
        catch (e){ 
           	try{ 
                xmlHttp=new ActiveXObject("Microsoft.XMLHTTP"); 
            } 
            catch (e){ 
                alert("您的浏览器不支持AJAX！"); 
            } 
        } 
    }
    return xmlHttp;
}
function extend(obj1,obj2){
	if(Object.prototype.toString.call(obj1) === '[object object]'
		&& Object.prototype.toString.call(obj2) === '[object object]'){
		for(var i in obj2){
			obj1[i] = obj2[i];
		}
	}
	return obj1;
}

module.exports=ajax;
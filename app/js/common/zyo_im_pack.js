var strophe=require('./strophe.js');
var json2=require('./json2.js');
var im=require('./easemob.im-1.0.7.js');
var cookie=require('./cookie.js');
var md5=require('../../../node_modules/md5/md5.js');
var Actions=require('../action/AppActions.js');

var conn = new Easemob.im.Connection();
conn.init({
    wait : '60',//非必填，连接超时，默认:60，单位seconds
    onOpened : function() {//当连接成功时的回调方法
        conn.setPresence();
        //console.log('已在线');
    },
    onClosed : function() {//处理登出事件
        //cookie.remove('userid');
        console.log('您账号在另一台设备登录了~');
        //location.href='#/login';
    },
    onTextMessage : function(message) {//收到文本消息时的回调方法
        //console.log('收到消息了~');
        var messageObj=JSON.parse(message.data);//消息对象
        conn.chemistMesasge(messageObj);//报装处理消息
    },
    onError : function(e) {//异常处理
    }
});

conn.connect=function(){
    if(cookie.get('userid')!='undefined'){
        conn.open({
            user: cookie.get('userid'),//用户id
            pwd: md5(cookie.get('userid')+ md5('lkhealth')),//pwd: MD5(1014912+ MD5('lkhealth')),
            appKey: '77#im'//开发者APPKey
        });
    }else{//如果不存在cookie
    }
}
conn.chemistMesasgeFirstSet=function(messageObj){
    messageObj.time=getTime();
    messageObj.index=getIndex();
    var from = messageObj.from,//药师id
        messageContent = messageObj.message;//消息内容
    var list_name = messageObj.to+'_'+ from;//用户id+药师id
    var msg_list=[];
    if(localStorage[list_name]){//如果存在与该药师的聊天记录
        msg_list = JSON.parse(localStorage[list_name]);//解析该药师聊天记录
    }else{//如果不存在与该药师的聊天记录
        msg_list = [];
    }
    msg_list.push(messageObj);
    localStorage.setItem(list_name,JSON.stringify(msg_list));

    var list_arr=[];
    if(localStorage[messageObj.to]){//如果存在药师列表
        var list_arr=JSON.parse(localStorage[messageObj.to]);
        if(list_arr.indexOf(from)<0){//如果从未和该药师聊过天
            list_arr.push(from);
            localStorage.setItem(messageObj.to,JSON.stringify( list_arr ));
        }
    }else{//如果不存在药师列表
        list_arr.push(from);
        localStorage.setItem(messageObj.to,JSON.stringify( list_arr ));
    } 
    kickStorage();
}

conn.chemistMesasge=function(messageObj){//处理接受到的消息
    messageObj.time=getTime();//获取时间
    messageObj.index=getIndex();//获取聊天记录索引，用于排名
    /*点评----------------------------------------------*/
    if(messageObj.type==9){
        console.log(messageObj);
        messageObj.isComment='0';//‘0’是未点评的，‘1’是评论好了的
    }
    /*推荐药师*/
    if(messageObj.type=='recommond'){
        var list_name = messageObj.to+'_'+ messageObj.from;//用户id+药师id
        var msg_list=[];
        if(localStorage[list_name]){//如果存在与该药师的聊天记录
            msg_list = JSON.parse(localStorage[list_name]);//解析该药师聊天记录
            for(x in msg_list){
                if(msg_list[x].type=='recommond'){
                    msg_list.splice(x,1);//删除之前的推荐药师
                }
            }
        }
        localStorage.setItem(list_name,JSON.stringify(msg_list));
    }
    /*聊天记录----------------------------------------------*/
    var from = messageObj.from,//药师id
        messageContent = messageObj.message||'';//消息内容
    var list_name = messageObj.to+'_'+ from;//用户id+药师id
    var msg_list=[];
    if(localStorage[list_name]){//如果存在与该药师的聊天记录
        msg_list = JSON.parse(localStorage[list_name]);//解析该药师聊天记录
    }else{//如果不存在与该药师的聊天记录
        msg_list = [];
    }
    msg_list.push(messageObj);
    localStorage.setItem(list_name,JSON.stringify(msg_list));
    /*药师列表----------------------------------------------*/
    var list_arr=[];
    if(localStorage[messageObj.to]){//如果存在药师列表
        var list_arr=JSON.parse(localStorage[messageObj.to]);
        if(list_arr.indexOf(from)<0){//如果从未和该药师聊过天
            list_arr.push(from);
            localStorage.setItem(messageObj.to,JSON.stringify( list_arr ));
        }
    }else{//如果不存在药师列表
        list_arr.push(from);
        localStorage.setItem(messageObj.to,JSON.stringify( list_arr ));
    } 
    kickStorage();//触发storage改变事件
    Actions.receive(messageObj.from); //触发flux receive事件
}

conn.userMessage=function(messageObj){//处理发送的消息
    messageObj.time=getTime();
    messageObj.index=getIndex();
    /*聊天记录----------------------------------------------*/
    var to = messageObj.to,//药师id
        messageContent = messageObj.message||'';//消息内容
    var list_name = messageObj.from+'_'+ to;
    var msg_list=[];
    if(localStorage[list_name]){//如果存在与该药师的聊天记录
        msg_list = JSON.parse(localStorage[list_name]);//解析该药师聊天记录
    }
    else{//如果不存在与该药师的聊天记录
        msg_list = [];
    }
    msg_list.push(messageObj);
    localStorage.setItem(list_name,JSON.stringify(msg_list));
    /*药师列表----------------------------------------------*/
    var list_arr=[];
    if(localStorage[messageObj.from]){//如果存在药师列表
        var list_arr=JSON.parse(localStorage[messageObj.from]);
        if(list_arr.indexOf(to)<0){//如果从未和该药师聊过天
            list_arr.push(to);
            localStorage.setItem(messageObj.from,JSON.stringify( list_arr ));
        }
    }else{//如果不存在药师列表
        list_arr.push(to);//触发storage改变事件
        localStorage.setItem(messageObj.from,JSON.stringify( list_arr ));
    } 
    kickStorage();
}
/* 手动触发storage事件*/
function kickStorage(){
    var se = document.createEvent("StorageEvent");
    se.initStorageEvent('storage', false, false);
    window.dispatchEvent(se);
    //console.log('触发storage事件');
}
/*获取最新时间*/
function getTime(){
    var stamp=new Date();
    var currentTime=(stamp.getMonth()+1)+"-"+stamp.getDate()+' '+stamp.getHours().toString()+":"+
        (stamp.getMinutes()<10 ? '0'+stamp.getMinutes().toString() : stamp.getMinutes().toString());
    return currentTime;
}
/*获取索引*/
function getIndex(){
    var data=new Date();
    return data.getTime();
}
module.exports=conn;
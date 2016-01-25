var React = require('../../../node_modules/react/dist/react-with-addons.js');
var Link = require('react-router').Link;
var API=require('../common/zyo_api_url.js');
var cookie=require('../common/cookie.js');
var MessageStore=require('../store/MessageStore.js');
var ZY_footer=require('./ZY_footer.js');

function update(){//更新，包装数据
	if(cookie.get('userid')!='undefined'){//如果存在cookie
		var id_list=[],
			message_list=[];
		var userid=cookie.get('userid');
		if(localStorage[userid]){
			id_list=JSON.parse(localStorage[userid]);//获取所有药师的id
			for(var i=0;i<id_list.length;i++){//遍历和每位药师的聊天记录
				var key=cookie.get('userid')+'_'+id_list[i].toString();
				var msg=JSON.parse(localStorage[key]);
				var last=msg[msg.length-1];
				for(var j=msg.length-1;j>-1;j--){//获取聊天记录中的最后一条'文本'消息
					if(msg[j].type==1||msg[j].type==17||msg[j].type==8||msg[j].type==9||msg[j].type==2){
						last=msg[j];
						break;
					}
				}
				last.avatar=msg[0].avatar;//获取药师的头像
				last.userName=msg[0].name;//药师的名字
				last.uid=msg[0].from;//药师的id
			    message_list.push(last);//push进每位药师聊天记录的最后一条消息
			}
		}
		return message_list;
	}else{
		return [];
	}
}

module.exports=React.createClass({
	getInitialState: function() {
		var message_list=update();
	    return {
	      	messageList:message_list,
	      	_messages:MessageStore.getAll()
	    };
	},
	update:function(){
		if(!!location.hash.match('message')){
			var message_list=update();
			this.setState({ messageList:message_list },this.sort);	
		}	
	},
	componentDidMount: function() {
		if (this.isMounted()) {
		    window.addEventListener('storage',this.update,false);
			MessageStore.addChangeListener(function(){
	    		if(!!location.hash.match('#/index/message')){
	    			this.setState({ _messages:MessageStore.getAll() });
	    		}
	    	}.bind(this));
	    }
	    this.sort();
	},
	sort:function(){
		var messageList=this.state.messageList;
		messageList.sort(function(a,b){
			return b.index-a.index;//按索引从大到小排列
		});
		this.setState({ messageList:messageList });
	},
	componentWillUnmount:function(){
		window.removeEventListener('storage',this.update);
	},
  	render: function() {
	    return (
	    	<div>
		    	<div className={this.state.messageList.length==0 ? '' : 'hidden' } style={{backgroundColor:'#f4f4f4',textAlign:'center',padding:'10px',color:'#cdcdcd'}}>
		    		<p>暂无消息</p>
		    	</div>
		    	<div>{
			    	this.state.messageList.map(function(el){
			    		var stamp=new Date(),
			    			newMsgCount=0;
					    var currentTime=(stamp.getMonth()+1)+"-"+stamp.getDate();
			    		for(x in this.state._messages){
			    			if(el.uid==x){
			    				newMsgCount=this.state._messages[x].count;
			    			}
			    		}
			    		return(
			    			<Link to={'/talking/'+el.uid} chemistID={el.uid} key={el.uid} className='block bb'>
					    		<div className='padding-tb-10 overflow'>
						    		<div className='col-3 padding-lr-10'>
						    			<img className='circle responsive block block-center' style={{width:'47px',height:'47px'}} src={el ? el.avatar:'./app/img/index/icon_userphoto_loading.png'} />
						    		</div>
					    			<div className='col-9 relative'>
										<div className='col-11'>
											<div>
												<span>{el.userName} </span>
											</div>
											<div className='details text-gray' style={{paddingTop:'5px'}}>
												<span className={el.type==1||el.type==17 ? 'fz-12':'hidden'}>{el.message}</span>
												<span className={el.type==8 ? 'fz-12':'hidden'}>【求关注】</span>
												<span className={el.type==9 ? 'fz-12':'hidden'}>【求点评】</span>
												<span className={el.type==2 ? 'fz-12':'hidden'}>【图片】</span>
											</div>
										</div>
										<div className='col-1' style={{paddingTop:'18px'}}>
											<div className={newMsgCount==0? 'hidden':''}>
												<span className='message-dot' style={{position:'relative',top:'13px',right:'5px'}}>{newMsgCount}</span>
											</div>
										</div>
										<div style={{position:'absolute',right:'10px'}}>
											<span className='text-gray fz-12'>{el.time.split(' ')[0]==currentTime ? el.time.split(' ')[1] : el.time}</span>
										</div>
									</div>
								</div>
							</Link>
						)
			    	}.bind(this))
			    }</div>	
			   	<ZY_footer />
			</div>
	    );
  	}
});
var React = require('../../../node_modules/react/dist/react-with-addons.js');
var Link = require('react-router').Link;
var ZY_header=require('./ZY_header.js');
var ajax=require('../common/ajax.js');
var encryption=require('../common/encryption.js');
var conn=require('../common/zyo_im_pack.js');
var cookie=require('../common/cookie.js');
var API=require('../common/zyo_api_url.js');

function getStar(index){
	var judge=['极差','失望','一般','满意','非常满意'];
	var stars=[
		'./app/img/index/icon_starnull.png',
		'./app/img/index/icon_starnull.png',
		'./app/img/index/icon_starnull.png',
		'./app/img/index/icon_starnull.png',
		'./app/img/index/icon_starnull.png'
	];
	if(index==null){
		stars.push('请给药师评价');
		return stars;
	}else{
		for(var i=0;i<=index;i++){
			stars[i]='./app/img/index/icon_starfull.png';
		}
		stars.push(judge[index]);
		return stars;
	}
}

module.exports=React.createClass({
	mixins: [React.addons.LinkedStateMixin],
	getInitialState:function(){
		return{
			ZY_header_config:{/*header配置项*/
				title:'发表评价',
				color:'bg-primary',
				showBack:true,
				showHome:false
			},
			btnStyle:'btn block-center bg-gray block fz-16',
			userInfo:{},
			chemistInfo:{},
			stars:getStar(null),
			count:10,
			index:0,
			comment:''	
		}
    },
    componentDidMount: function() {
    	console.log(this.props.params.id.split("_")[0]);
    	console.log(this.props.params.id.split("_")[1]);
		//获取用户信息
		var str=API.myinfoindex.split('?')[1]+'&uid='+cookie.get('userid');
	    var sign=encryption(str);
		ajax().post(API.myinfoindex,{ uid:cookie.get('userid'),sign:sign },'json')
		.success(function(data){
		    if (this.isMounted()) {
			    this.setState({ userInfo:data.data.userInfo });
		    }
		}.bind(this));
		ajax().post(API.employeeInfo,{ uid:this.props.params.id.split("_")[0] },'json')
		.success(function(data){
		    if (this.isMounted()) {
		        this.setState({ chemistInfo:data.data.employeeInfo });
		    }
		}.bind(this));
	},
    submitComment:function(){
    	var len=this.state.comment.length;
    	if(this.state.stars[0]=='./app/img/index/icon_starnull.png'){
    		alert('请评价服务质量~');
    	}else{
    		if(len>0&&len<10){
	    		alert('评价字数不能少于10个字哦~');
	    	}else{
	    		var msg = {//此消息发给服务器
					"from":cookie.get('userid'),
					"to":this.props.params.id.split("_")[0],
					"type":"16",
					"message":this.state.chemistInfo.userName+"\n"+"服务质量："+this.state.index+"分\n"+this.state.comment,
					"name":this.state.userInfo.userName,
					"usertype":"4",
					"avatar":this.state.userInfo.avatar,
					"phone":this.state.userInfo.cellPhone
				};
				var starMsg = {//此消息存本地
					"from":cookie.get('userid'),
					"to":this.props.params.id.split("_")[0],
					"type":"16",
					"name":this.state.chemistInfo.userName,
					'rank':(this.state.index/2),
					"message":this.state.comment,
					"usertype":"4",
					"avatar":this.state.userInfo.avatar
				};
				options={
					to:this.props.params.id.split("_")[0],
					type:'chat',
					msg:JSON.stringify(msg)
				};
				/*评论接口-----------------------------------------------------*/
				ajax().post(API.reviewEmployee,{ 
					uid:this.props.params.id.split("_")[0],
					userId:cookie.get('userid'),
					content:this.state.comment,
					rank:(this.state.index*10).toString(),
					imId:this.props.params.id.split("_")[1]
				},'json').success(function(data){
					console.log(data);
				});	
				/*评论接口-----------------------------------------------------*/
				conn.userMessage(starMsg);//包装消息，存入localStorage
				conn.sendTextMessage(options);//发送消息

				var list_name=cookie.get('userid')+'_'+this.props.params.id.split("_")[0];
				if(localStorage[list_name]){
					var MessageList=JSON.parse(localStorage[list_name]);
					var len=MessageList.length;
					for(var i=len-1;i>=0;i--){
						if(MessageList[i].type==9){
							MessageList[i].isComment='1';
							break;
						}
					}
					localStorage.setItem( list_name,JSON.stringify(MessageList) );
				}
				window.history.back(-1);
	    	}
    	}
    },
    checkFill:function(){
    	var len=this.state.comment.length;
    	if(len>=10||(len<=0&&this.state.stars[0]!='./app/img/index/icon_starnull.png')){
    		this.setState({ btnStyle:'btn block-center bg-green block fz-16' });
    	}else{
    		this.setState({ btnStyle:'btn block-center bg-gray block fz-16' });
    	}
    	this.setState({ count:10-len });
    },
    starCheck:function(index){
    	this.setState({ index:(index+1)*2 },function(){
    		console.log(this.state.index);
    	});
    	this.setState({ stars:getStar(index) });
    	this.setState({ btnStyle:'btn block-center bg-green block fz-16' });
    },
	render:function(){
		return(
			<div className='comment'>
				<ZY_header config={this.state.ZY_header_config} />
				<div className='clear overflow'>
					<div className="block-center" style={{width:'120px',marginTop:'10px'}}>
						<img className='responsive' src={this.state.stars[0]} onClick={this.starCheck.bind(this,0)} style={{width:'20px'}} />
						<img className='responsive' src={this.state.stars[1]} onClick={this.starCheck.bind(this,1)} style={{width:'20px',marginLeft:'5px'}}/>
						<img className='responsive' src={this.state.stars[2]} onClick={this.starCheck.bind(this,2)} style={{width:'20px',marginLeft:'5px'}}/>
						<img className='responsive' src={this.state.stars[3]} onClick={this.starCheck.bind(this,3)} style={{width:'20px',marginLeft:'5px'}}/>
						<img className='responsive' src={this.state.stars[4]} onClick={this.starCheck.bind(this,4)} style={{width:'20px',marginLeft:'5px'}}/>
					</div>
				</div>
				<div className='clear overflow'>
					<div className='text-center'>
						<span className='text-gray fz-14'>{this.state.stars[5]}</span>
					</div>
				</div>
				<div className='clear relative'>
					<textarea className='block padding-10 fz-14 b' valueLink={this.linkState('comment')} onKeyUp={this.checkFill} 
					placeholder='亲，药师的服务如何，药学水平怎么样。满意吗？'style={{width:'83%',height:'120px',margin:'15px auto'}}>
					</textarea>
					<span className={(this.state.count<=0||this.state.count==10)?'hidden':'fz-14 text-gray'} style={{position:'absolute',top:'120px',right:'35px'}}>
						加油！还剩{this.state.count}个字
					</span>
				</div>
				<div>
					<button className={this.state.btnStyle} style={{height:'38px',width:'90%'}} onClick={this.submitComment}>
						提交
					</button>
				</div>
			</div>
		);
	}
});
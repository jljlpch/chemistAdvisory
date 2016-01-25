var React = require('../../../node_modules/react/dist/react-with-addons.js');
var ZY_header=require('./ZY_header.js');
var md5=require('../../../node_modules/md5/md5.js');
var encryption=require('../common/encryption.js');
var ajax=require('../common/ajax.js');
var Link = require('react-router').Link;
var cookie=require('../common/cookie.js');
var API=require('../common/zyo_api_url.js');

function trim(str){    //删除空格;
	return str.replace(/\s/g,'');
}

function QQlogin(){
	var paras = {};
	QC.api("get_user_info", paras)
	.success(function(s){
		//成功回调，通过s.data获取OpenAPI的返回数据
		console.log(s.data);
		var userName=encodeURIComponent(s.data.nickname);
		QC.Login.getMe(function(openId, accessToken){
			console.log(openId);
			ajax().post(API.loginExternal,{ uid:openId,userName:userName,userImg:s.data.figureurl_2 },'json')
			.success(function(data){
			    console.log(data);
			    cookie.set('userid',data.data.userInfo.uid);
			    window.location.href='#/index/me';
			});
		});
	});
}

module.exports=React.createClass({
	mixins: [React.addons.LinkedStateMixin],
	getInitialState:function(){
		if(cookie.get('userid')!='undefined'){
			window.history.back(-1);
		}
		QQlogin();
		return{
			ZY_header_config:{/*header配置项*/
				title:'登录',
				color:'bg-primary',
				showBack:true,
				showHome:false
			},
			userName:'',
			passWord:'',
			btnStyle:'btn block-center bg-gray block fz-16',
			remind:''
		};
    },
    componentDidMount: function(){
    	if(QC.Login.check()){
			QC.Login.signOut();
    	}
    	QC.Login({
		    btnId:"qqLoginBtn"	//插入按钮的节点id
		});
		
	},
    submitClick:function(){
    	if(this.state.userName==''||this.state.passWord==''){

    	}else{
    		var passWord=trim(this.state.passWord);//去空格
	    	passWord=md5(passWord);//加密
	    	var userName=trim(this.state.userName);
	    	var str=API.login.split('?')[1]+'&userName='+userName+'&passWord='+passWord;
	    	var sign=encryption(str);
	    	ajax().post(API.login,{ 'userName':userName,'passWord':passWord,'sign':sign },'json')
	    		.success(function(data){
	    			if(data.code==0){
	    				cookie.set('userid',data.data.userInfo.uid);
	    				if(location.hash.match('talking')){
	    					var thisHash=location.hash.split('=');
	    					location.href='#/talking/'+thisHash[1];
	    				}else{
	    					if(location.hash.match('register')||location.hash.match('findBack')){
	    						location.href='#/';
	    					}else{
	    						window.history.back(-1);
	    					}
	    				}
	    			}else{
	    				this.setState({ remind:'用户名或者密码错误！'});
	    				setTimeout(function(){
	    					this.setState({ remind:''});
	    				}.bind(this),1500);
	    			}
	    		}.bind(this));
    	}
    },
    checkLogin:function(){//判断输入的名字密码不为空
    	if(this.state.userName!=''&&this.state.passWord!=''){
    		this.setState({ btnStyle:'btn block-center online-green block fz-16'});
    	}else{
    		this.setState({ btnStyle:'btn block-center bg-gray block fz-16'});
    	}
    },
  	render: function() {
	    return (
			<div className="login">
				<ZY_header config={this.state.ZY_header_config} />
				<div className='divide-10 clear'></div>
				<div className='padding-tb-10 clear bb bt overflow bg-white'>
					<div className='col-2 text-center' style={{padding:'0 10px',height:'20px'}}>
						<img className='ht-20 responsive' src="./app/img/index/icon_login_username.png"/>
					</div>
					<div className='col-10'>
						<input type='text' className='b-null fz-14' onKeyUp={this.checkLogin} style={{lineHeight:'20px',width:'100%'}} placeholder='手机号/邮箱' valueLink={this.linkState('userName')}/>
					</div>
				</div>
				<div className='padding-tb-10 clear bb overflow bg-white'>
					<div className='col-2 text-center' style={{padding:'0 10px',height:'20px'}}>
						<img className='ht-20 responsive' src="./app/img/index/icon_login_password.png"/>
					</div>
					<div className='col-10'>
						<input type='passWord' className='b-null fz-14' onKeyUp={this.checkLogin} style={{lineHeight:'20px',width:'100%'}} placeholder='密码' valueLink={this.linkState('passWord')}/>
					</div>
				</div>
				<div className='padding-tb-20'>
					<button className={this.state.btnStyle} onClick={this.submitClick} style={{height:'40px',width:'90%'}}>
						登录
					</button>
				</div>
				<div className='block-center overflow' style={{width:'90%'}}>
					<Link to='/register' className='fz-14 pull-left text-primary' style={{textDecoration:'underline'}}>立即注册</Link>
					<Link to='/findBack' className='fz-14 pull-right text-primary' style={{textDecoration:'underline'}}>忘记密码</Link>
				</div>
				<div className='padding-tb-20 relative'>
					<div className='block-center text-center' style={{width:'45px'}}>
						<span id="qqLoginBtn" style={{display:'block',height:'45px',width:'45px',overflow:'hidden',borderRadius:'100%',opacity:'0'}}></span>
						<img src='./app/img/icon_social_qqshare.png' 
						style={{display:'block',height:'45px',width:'45px',overflow:'hidden',borderRadius:'100%',position:'relative',top:'-45px',zIndex:'-1'}}/>
						<span className='fz-12 text-gray' style={{position:'relative',top:'-45px'}}>QQ登录</span>
					</div>
				</div>
				<div className={this.state.remind==''?'hidden':'block'}>
					<p className='bg-primary text-center text-white fz-14' style={{height:'30px',margin:'5px auto',width:'55%',lineHeight:'30px',borderRadius:'4px'}}>
						{this.state.remind}
					</p>
				</div>
			</div>
	    );
  	}
});
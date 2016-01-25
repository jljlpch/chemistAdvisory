var React = require('../../../node_modules/react/dist/react-with-addons.js');
var ZY_header=require('./ZY_header.js');
var md5=require('../../../node_modules/md5/md5.js');
var ajax=require('../common/ajax.js');
var encryption=require('../common/encryption.js');
var API=require('../common/zyo_api_url.js');

function trim(str){    //删除空格;
	return str.replace(/\s/g,'');
}
module.exports=React.createClass({
	mixins: [React.addons.LinkedStateMixin],
	getInitialState:function(){
		return{
			ZY_header_config:{/*header配置项*/
				title:'注册',
				color:'bg-primary',
				showBack:true,
				showHome:false
			},
			btnStyle:'btn block-center bg-gray block fz-16',
			codeStyle:'text-center fz-14 confirm-code',
			codeContent:'获取验证码',
			userName:'',
			code:'',
			passWord:'',
			repassWord:'',
			remind:''//错误提醒
		};
    },
    submitClick:function(){
    	if(this.state.userName==''||this.state.code==''||this.state.passWord==''||this.state.repassWord==''){

    	}else{
    		if(this.state.passWord.length<6){
	    		alert('密码长度不能小于6位~');
	    	}else{
	    		if(this.state.passWord==this.state.repassWord){
		    		var passWord=trim(this.state.passWord);//去空格
			    	passWord=md5(passWord);//加密
			    	var str=API.reg.split('?')[1]+'&code='+this.state.code+'&cellphone='+this.state.userName+'&password='+passWord;
	    			var sign=encryption(str);
			    	ajax().post(API.reg,{ code:this.state.code,cellphone:this.state.userName,password:passWord,sign:sign },'json')
		    		.success(function(data){
		    			console.log(data);
		    			if(data.code==0){
		    				window.location.href='#/login?register';	
		    			}else{
		    				this.setState({ remind:data.msg });
		    				setTimeout(function(){
		    					this.setState({ remind:''});
		    				}.bind(this),1500);
		    			}
		    		}.bind(this));
		    	}else{
		    		this.setState({ remind:'请确认两次密码相同！'});
					setTimeout(function(){
						this.setState({ remind:''});
					}.bind(this),1500);
		    	}
	    	}
    	}
    	
    },
    checkFill:function(){
    	if(this.state.userName!=''&&this.state.code!=''&&this.state.passWord!=''&&this.state.repassWord!=''){
    		this.setState({ btnStyle:'btn block-center online-green block fz-16'});
    	}else{
    		this.setState({ btnStyle:'btn block-center bg-gray block fz-16'});
    	}
    },
    codeClick:function(){
    	if(this.state.userName.match(/^(1[3,5,8,7]{1}[\d]{9})/)&&(this.state.codeContent=='获取验证码')){//如果是正确的电话号码
    		this.setState({ codeContent:'60s'});
	    	this.setState({ codeStyle:'text-center confirm-code-active'});
	    	var count=59;
	    	var interval=setInterval(function(){//60s计时动画
	    		if(!location.hash.match('register')){//如果不在该页面就清除定时器
	    			clearInterval(interval);
	    		}
	    		var time=count.toString()+'s';
	    		this.setState({ codeContent:time});
	    		count--;
	    		if(count==-1){
	    			clearInterval(interval);
	    			this.setState({ codeContent:'获取验证码'});
	    			this.setState({ codeStyle:'text-center confirm-code'});
	    		}
	    	}.bind(this),1000);
	    	var str=API.getcellphonecode.split('?')[1]+'&cellphone='+this.state.userName+'&type=0';
	    	var sign=encryption(str);
	    	ajax().post(API.getcellphonecode,{ cellphone:this.state.userName,type:'0',sign:sign },'json')
	    	.success(function(data){
	    		console.log(data);
	    	});
    	}else{
    		if(this.state.codeContent!='获取验证码'){
    			
    		}else{
    			this.setState({ remind:'手机号格式有误！'});
				setTimeout(function(){
					this.setState({ remind:''});
				}.bind(this),1500);
    		}
    	}
    },
  	render: function() {
	    return (
			<div className="register">
				<ZY_header config={this.state.ZY_header_config} />
				<div className='divide-10 clear'></div>
				<div className='padding-tb-10 clear bb bt overflow bg-white'>
					<div className='col-2 padding-lr-10 text-center' style={{height:'20px'}}>
						<img className='ht-20 responsive' src="./app/img/index/icon_login_username.png"/>
					</div>
					<div className='col-10'>
						<input type='text' className='b-null fz-14' style={{lineHeight:'20px',width:'100%'}} onKeyUp={this.checkFill} placeholder='手机号/邮箱' valueLink={this.linkState('userName')}/>
					</div>
				</div>
				<div className='padding-tb-10 clear bb overflow bg-white'>
					<div className='col-2 padding-lr-10 text-center' style={{height:'20px'}}>
						<img className='ht-20 responsive' src="./app/img/index/icon_login_shortmsg.png"/>
					</div>
					<div className='col-6'>
						<input type='passWord' className='b-null fz-14' style={{lineHeight:'20px',width:'100%'}} onKeyUp={this.checkFill} placeholder='请输入短信中的验证码' valueLink={this.linkState('code')}/>
					</div>
					<div className='col-4 relative'>
						<p className={this.state.codeStyle} onClick={this.codeClick}>{this.state.codeContent}</p>
					</div>
				</div>
				<div className='padding-tb-10 clear bb overflow bg-white'>
					<div className='col-2 padding-lr-10 text-center' style={{height:'20px'}}>
						<img className='ht-20 responsive' src="./app/img/index/icon_login_password.png"/>
					</div>
					<div className='col-10'>
						<input type='passWord' className='b-null fz-14' style={{lineHeight:'20px',width:'100%'}} onKeyUp={this.checkFill} placeholder='请输入密码' valueLink={this.linkState('passWord')}/>
					</div>
				</div>
				<div className='padding-tb-10 clear bb overflow bg-white'>
					<div className='col-2 padding-lr-10 text-center' style={{height:'20px'}}>
						<img className='ht-20 responsive' src="./app/img/index/icon_login_password.png"/>
					</div>
					<div className='col-10'>
						<input type='passWord' className='b-null fz-14' style={{lineHeight:'20px',width:'100%'}} onKeyUp={this.checkFill} placeholder='请再次输入密码' valueLink={this.linkState('repassWord')}/>
					</div>
				</div>
				<div className='padding-tb-20'>
					<button className={this.state.btnStyle} onClick={this.submitClick} style={{height:'40px',width:'90%'}}>
						保存
					</button>
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
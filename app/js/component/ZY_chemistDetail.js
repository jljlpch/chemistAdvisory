var React = require('../../../node_modules/react/dist/react-with-addons.js');
var ZY_header=require('./ZY_header.js');
var ajax=require('../common/ajax.js');
var encryption=require('../common/encryption.js');
var Link = require('react-router').Link;
var API=require('../common/zyo_api_url.js');
var cookie=require('../common/cookie.js');
var ZY_footer=require('./ZY_footer.js');

module.exports=React.createClass({
	getInitialState:function(){
		return{
			ZY_header_config:{/*header配置项*/
				title:'药师详情',
				color:'bg-green',
				showBack:true,
				showHome:true
			},
			chemistId:this.props.params.id,
			chemistInfo:{
				storeName:''//如果不存在药店名，先隐藏掉
			},
			isFocus:'关注'
		};
    },
    componentDidMount: function() {
    	var userId;
    	if(cookie.get('userid')!='undefined'){
			userId=cookie.get('userid');
    	}else{
    		userId='';
    	}
    	var str=API.employeeInfo.split('?')[1]+'&uid='+this.state.chemistId+'&userId='+userId;
    	var sign=encryption(str);
	    ajax().post(API.employeeInfo,{ 'uid':this.state.chemistId,'userId':userId,'sign':sign },'json')
		.success(function(data){
		    if (this.isMounted()) {
		        this.setState({ chemistInfo:data.data.employeeInfo });
		        if(this.state.chemistInfo.isFav==1){
		        	this.setState({ isFocus:'取消关注' });
		        }else{
		        	this.setState({ isFocus:'关注' });
		        }
		    }
		}.bind(this));
	},
	focus:function(){
		if(cookie.get('userid')!='undefined'){//如果用户登录了
			if(this.state.isFocus=='关注'){
				var str=API.focusEmployee.split('?')[1]+'&uid='+this.state.chemistId+'&userId='+cookie.get('userid');
    			var sign=encryption(str);
				ajax().post(API.focusEmployee,{ uid:this.state.chemistId,userId:cookie.get('userid'),sign:sign },'json')
				.success(function(data){
				    if (this.isMounted()) {
				        if(data.code==0){
				        	this.setState({ isFocus:'取消关注' });
				        }
				    }
				}.bind(this));
			}else{
				var str=API.cancelFocusEmployee.split('?')[1]+'&uid='+this.state.chemistId+'&userId='+cookie.get('userid');
    			var sign=encryption(str);
				ajax().post(API.cancelFocusEmployee,{ uid:this.state.chemistId,userId:cookie.get('userid'),sign:sign },'json')
				.success(function(data){
				    if (this.isMounted()) {
				        if(data.code==0){
				        	this.setState({ isFocus:'关注' });
				        }
				    }
				}.bind(this));
			}
		}else{//如果用户没有登录
			alert('请先登录或者注册~');
			location.href='#/login';
		}
	},
	checkLogin:function(){
		if(cookie.get('userid')=='undefined'){
			alert('请先登录或者注册~');
			location.href="#/login?talking="+this.state.chemistId;
		}else{
			location.href='#/talking/'+this.state.chemistId;
		}
	},
  	render: function() {
	    return (
			<div className="main">
				<ZY_header config={this.state.ZY_header_config} />
				<div className='clear ht-120'>
					<img className='responsive' style={{height:'100%',width:'100%'}} src='./app/img/index/chemist_detail_bg_default.jpg'/>
				</div>
				<div style={{position:'absolute',top:'130px',left:'10px'}}>
					<img className='circle responsive' style={{height:'65px',width:'65px',border:'4px solid #fff'}} src={this.state.chemistInfo.avatar ? this.state.chemistInfo.avatar : ''}/>
				</div>
				<div className='padding-tb-10 bg-white clear overflow'>
					<div className="col-3 ht-40"></div>
					<div className="col-3 ht-40 text-center">
						<p className='text-gray fz-12'>粉丝</p>
						<p className='padding-t-5'>{this.state.chemistInfo.fansNum}</p>
					</div>
					<div className="col-3 ht-40 text-center">
						<p className='text-gray fz-12'>已服务</p>
						<p className='padding-t-5'>{this.state.chemistInfo.serviceNum}</p>
					</div>
					<div className="col-3 ht-40 text-center">
						<p className='text-gray fz-12'>好评度</p>
						<p className='padding-t-5'>{this.state.chemistInfo.userRank!=''?this.state.chemistInfo.userRank:'0'}</p>
					</div>
				</div>
				<div className='padding-tb-10 bg-white overflow margin-t-10 bt bb'>
					<div className='col-6 padding-lr-15'>
						<button className='btn bg-primary block-center fz-16 block' style={{height:'35px',width:"90%",float:'left'}} onClick={this.focus}>{this.state.isFocus}</button>
					</div>
					<div className='col-6 padding-lr-15' onClick={this.checkLogin}>
						<a href='javascript:;' className='bg-green'>
							<button className='btn bg-green block-center fz-16 block' style={{height:'35px',width:"90%",float:'right'}}>问问TA</button>
						</a>
					</div>
				</div>
				<div className='margin-t-10'>
					<div className={this.state.chemistInfo.storeName==''?'hidden':'padding-tb-10 bg-white overflow bt'}>
						<div className='col-3 text-center'>
							<p className='fz-14'>所属药店</p>
						</div>
						<div className='col-9'>
							<p className='fz-14 text-gray padding-r-5'>{this.state.chemistInfo.storeName}</p>
						</div>
					</div>
					<div className={this.state.chemistInfo.signature==''?'hidden':'padding-tb-10 bg-white overflow bb bt'}> 
						<div className='col-3 text-center'>
							<p className='fz-14'>个人签名</p>
						</div>
						<div className='col-9'>
							<p className='fz-14 text-gray padding-r-5'>{this.state.chemistInfo.signature}</p>
						</div>
					</div>
				</div>
				<ZY_footer />
			</div>
	    );
  	}
});
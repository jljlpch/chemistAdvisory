var React=require('react');
var Link = require('react-router').Link;
var ajax=require('../common/ajax.js');
var encryption=require('../common/encryption.js');
var cookie=require('../common/cookie.js');
var API=require('../common/zyo_api_url.js');
var conn=require('../common/zyo_im_pack.js');
var Actions=require('../action/AppActions.js');

function trim(str){    //删除空格;
	return str.replace(/\s/g,'');
}

module.exports=React.createClass({
	getInitialState:function(){
		conn.connect();
		return{
			chemistId:this.props.params.id,//药师id
			chemistInfo:{},//药师信息
			userInfo:{},//用户信息
			content:'',//发送消息框的内容
			MessageList:[],//聊天记录
			timeInterval:{},//时间定时器
			timeCount:0,//计数，每次消息开始时为0，通过时间定时器+1，如果超过10min，存一次时间戳,
			noReply:{},//定时器，如果2min药师没回复显示推荐药师
			replyCount:0,//计数，每次用户发送消息时为0，通过时间定时器+1，如果超过120，推荐一次药师,
			isLoaded:false//判断是否加载完毕，去掉菊花图
		};
    },
    update:function(){
    	clearTimeout(this.state.noReply);//清除未回复的定时器
    	if(!!location.hash.match('talking')&&this.isMounted()){
			var list_name=cookie.get('userid')+'_'+this.props.params.id;
			var MessageList=[];
			if(localStorage[list_name]){
				MessageList=JSON.parse(localStorage[list_name]);
				if((MessageList.length)%50==0){//每50条提醒打电话
					var msg = {
						"from":this.state.chemistInfo.uid,
						"to":cookie.get('userid'),
						"type":"calling"
					};
					conn.chemistMesasge(msg);
				}
			}
			this.setState({ MessageList:MessageList });
			/*使屏幕滚到最底部*/
		    setTimeout(function(){
		        document.body.scrollTop= document.body.scrollHeight;
		    },10);
		}
    },
    componentDidMount: function() {
    	window.onhashchange=function(){
    		this.componentDidMount();
    	}.bind(this);
    	if (this.isMounted()) {
		    window.addEventListener('storage',this.update,false);
	    }
		//获取药师信息
		var str=API.employeeInfo.split('?')[1]+'&uid='+this.state.chemistId;
	    var sign=encryption(str);
	    ajax().post(API.employeeInfo,{ uid:this.state.chemistId,sign:sign },'json')
		.success(function(data){
		    if (this.isMounted()) {
		        this.setState({ chemistInfo:data.data.employeeInfo });
		        var list_name=cookie.get('userid')+'_'+this.props.params.id;
				var MessageList=[];
				if(localStorage[list_name]){//如果存在和该药师的聊天记录
					MessageList=JSON.parse(localStorage[list_name]);
					this.setState({ MessageList:MessageList});
				}else{//如果不存在和该药师的聊天记录,初始化第一条消息
					var msg = {
						"from":this.state.chemistId,
						"to":cookie.get('userid'),
						"type":"1",
						"message":this.state.chemistInfo.welcome,
						"name":this.state.chemistInfo.userName,
						"usertype":"4",
						"avatar":this.state.chemistInfo.avatar,
						"phone":this.state.chemistInfo.cellPhone
					};
					conn.chemistMesasgeFirstSet(msg);//包装消息，存入localStorage
				}
				setTimeout(function(){/*使屏幕滚到最底部*/
			        document.body.scrollTop= document.body.scrollHeight;
			        this.setState({ isLoaded:true });
			    }.bind(this),10);
		    }
		}.bind(this));
		//获取用户信息
		var str=API.myinfoindex.split('?')[1]+'&uid='+cookie.get('userid');
	    var sign=encryption(str);
		ajax().post(API.myinfoindex,{ uid:cookie.get('userid'),sign:sign },'json')
		.success(function(data){
		    if (this.isMounted()) {
			    this.setState({ userInfo:data.data.userInfo });
		    }
		}.bind(this));
		//时间戳
		this.state.timeInterval=setInterval(function(){
			this.setState({ timeCount:this.state.timeCount+1 });
		}.bind(this),1000);
	},
	componentWillUnmount:function(){
		Actions.readed(this.state.chemistId);
		window.removeEventListener('storage',this.update);//清除监听
		window.removeEventListener('hashchange');//清除监听
		clearInterval(this.state.timeInterval);//清除时间戳
	},
    backClick:function(){
		window.history.back(-1);
	},
	msgChange:function(e){
		this.setState({content:e.target.value });
	},
	sendMessage:function(){
		var content=trim(this.state.content);
		if(content==''){
			alert('发送消息不能为空~');
		}else{
			var msg = {
				"from":cookie.get('userid'),
				"to":this.state.chemistId,
				"type":"1",
				"message":this.state.content,
				"name":this.state.userInfo.userName,
				"usertype":"4",
				"avatar":this.state.userInfo.avatar,
				"phone":this.state.userInfo.cellPhone
			};
			options={
				to:this.state.chemistId,
				type:'chat',
				msg:JSON.stringify(msg)
			};
			conn.userMessage(msg);//包装消息，存入localStorage
			this.setState({ content:'' });//清空输入框
			conn.sendTextMessage(options);//发送消息
		}
		//this.refs['message'].focus();
		/*判断是否显示时间戳*/
		if(this.state.timeCount>=600){
			var msg = {
				"from":cookie.get('userid'),
				"to":this.state.chemistId,
				"type":"time"
			};
			conn.userMessage(msg);//包装时间戳消息，存入localStorage
			this.setState({ timeCount:0 });
		}
		//2min未回复推荐药师
		setTimeout(function(){
			this.state.noReply=setTimeout(function(){
				ajax().post(API.getRecommendChemist,{ uid:cookie.get('userid') },'json')
				.success(function(data){
					var msg = {
						"from":this.state.chemistId,
						"to":cookie.get('userid'),
						"type":"recommond",
						'recommondChemist':data.data.employeeInfo
					};
					conn.chemistMesasge(msg);//包装消息，存入localStorage
				}.bind(this));
			}.bind(this),1000*60*2);
		}.bind(this),1000);
		
	},
  	render: function() {
  		var headerTitle;
  		if(this.state.chemistInfo.storeName!=''){//如果存在药店名字的样式
  			headerTitle=<div>
	  						<p className='text-white ht-20' style={{lineHeight:'20px',position:'relative',top:'2px'}}>
								<span>{this.state.chemistInfo.userName} </span>
							</p>
							<p className='text-white ht-20 fz-12' style={{lineHeight:'20px'}}>{this.state.chemistInfo.storeName}</p>
						</div>;
  		}else{//如果不存在药店名字的样式
  			headerTitle=<div>
	  						<p className='text-white ht-40' style={{lineHeight:'40px'}}>
								<span>{this.state.chemistInfo.userName} </span>
							</p>
						</div>;
  		}

	    return (
			<div className="talking">
				<header className='bg-primary overflow' style={{position:'fixed',width:'100%',top:'0',zIndex:'999'}}>
					<div className='col-2 ht-40 text-center relative'>
						<a href="javascript:;" className='' onClick={this.backClick}>
							<img className='ht-20 responsive' style={{position:'absolute',top:'10px',left:'15px'}} src="./app/img/index/btn_nav_backward.png"/>
						</a>
					</div>
					<div className="col-8 ht-40 text-center">
						{headerTitle}
					</div>	
					<div className="col-2 ht-40 text-center relative">
						<a href='javascript:;' className='hidden'>
							<img className='ht-20 responsive' style={{position:'absolute',top:'10px',right:'15px'}} src="./app/img/index/btn_store_dial_tel.png"/>
						</a>
					</div>
				</header>
				<div className='padding-lr-10' style={{overflowY:'auto',marginTop:'40px',paddingBottom:'50px',height:'100%'}}>{
					this.state.MessageList.map(function(el,index){
						return(
							<div key={index}>
								<div className={el.type==1||el.type==17?'overflow margin-tb-10':'hidden'} >
									<div className={el.from==this.state.chemistId?'col-1':'col-1 pull-right'}>
										<img className='circle responsive' src={el.avatar!='' ? el.avatar:'./app/img/index/icon_userphoto_loading.png'} />
									</div>
									<div className={el.from==this.state.chemistId?'col-10 padding-l-10':'col-10 pull-right padding-r-10'}>
										<span className={el.from==this.state.chemistId?'msg-left b pull-left':'msg-right b pull-right'}>{el.message}</span>
									</div>
								</div>
								<div className={el.type==2?'overflow margin-tb-10':'hidden'} >
									<div className={el.from==this.state.chemistId?'col-1':'col-1 pull-right'}>
										<img className='circle responsive' src={el.avatar} />
									</div>
									<div className={el.from==this.state.chemistId?'col-10 padding-l-10':'col-10 pull-right padding-r-10'}>
										<span className={el.from==this.state.chemistId?'msg-left b pull-left':'msg-right b pull-right'} style={{width:'50%'}}>
											<img className='responsive' src={el.type==2?el.message:'./app/img/blank.png'} />
										</span>
									</div>
								</div>
								<div className={el.type==8?'overflow margin-tb-10':'hidden'} >
									<div className='col-1'>
										<img className='circle responsive' src={el.avatar} />
									</div>
									<div className='col-10 padding-l-10'>
										<span className='msg-left b pull-left'>
											<p>求关注~关注我后，向我提问更方便~</p>
											<p>
												<Link to={'/chemistDetail/'+this.state.chemistId} className='fz-16 btn online-green text-white text-center' 
												style={{width:'100%',height:'35px',lineHeight:'35px',marginTop:'5px'}}>求关注</Link>
											</p>
										</span>
									</div>
								</div>
								<div className={el.type==9?'overflow margin-tb-10':'hidden'} >
									<div className='col-1'>
										<img className='circle responsive' src={el.avatar} />
									</div>
									<div className='col-10 padding-l-10'>
										<span className='msg-left b pull-left'>
											<p>求点评~请对本次服务做出点评，以便后续更好地为您服务，谢谢啦~</p>
											<p className={el.isComment=='0'?'':'hidden'}>
												<Link to={'/comment/'+this.state.chemistId+"_"+el.imId} className='fz-16 btn online-green text-white text-center' 
												style={{width:'100%',height:'35px',lineHeight:'35px',marginTop:'5px'}}>点评药师</Link>
											</p>
											<p className={el.isComment=='1'?'':'hidden'}>
												<span className='fz-16 btn bg-gray text-white text-center' 
												style={{width:'100%',height:'35px',lineHeight:'35px',marginTop:'5px'}}>已点评</span>
											</p>
										</span>
									</div>
								</div>
								<div className={el.type=='time'?'overflow margin-tb-10 text-center':'hidden'} >
									<p className='btn text-white bg-gray text-center fz-14' style={{width:'80px'}}>
										<span className={parseInt(el.time.split(' ')[1])<12?'':'hidden'}>上午</span>
										<span className={parseInt(el.time.split(' ')[1])>=12?'':'hidden'}>下午</span>
										{el.time.split(' ')[1]}
									</p>
								</div>
								<div className={el.type=='recommond'?'overflow text-center block-center block':'hidden'} style={{width:'94%',margin:'10px auto'}}>
									<div className='b bg-white'>
										<div className='fz-12 text-gray bb' style={{textAlign:'left',padding:'10px 0 10px 10px'}}>
											<span>{this.state.chemistInfo.userName}药师在忙，我们为您推荐了另一位药师哦~</span>
										</div>
										<div>
											<div>
												<div className='col-3'>
													<img className='circle responsive' style={{width:'60px',height:'60px',margin:'10px'}} 
													src={el.recommondChemist ? el.recommondChemist.avatar:'http://shop.lkhealth.net/app/assets/www/yaodian/images/face.png'} />
												</div>
												<div className='col-9 fz-14' style={{padding:'10px 15px',textAlign:'left'}}>
													<div>
														<span>{el.recommondChemist ? el.recommondChemist.userName:'?'}</span>
													</div>
													<div style={{padding:'2px 0'}}>
														<span>粉丝 {el.recommondChemist ? el.recommondChemist.fansNum:'0'}</span>
													</div>
													<div>
														<div style={{display:'inline-block'}}>
															<img className='responsive' src={el.recommondChemist ? (el.recommondChemist.userRank>=1 ? './app/img/index/icon_starfull.png':'./app/img/index/icon_starnull.png'):''} style={{width:'14px'}} />
															<img className='responsive' src={el.recommondChemist ? (el.recommondChemist.userRank>=3 ? './app/img/index/icon_starfull.png':'./app/img/index/icon_starnull.png'):''} style={{width:'14px'}} />
															<img className='responsive' src={el.recommondChemist ? (el.recommondChemist.userRank>=5 ? './app/img/index/icon_starfull.png':'./app/img/index/icon_starnull.png'):''} style={{width:'14px'}} />
															<img className='responsive' src={el.recommondChemist ? (el.recommondChemist.userRank>=7 ? './app/img/index/icon_starfull.png':'./app/img/index/icon_starnull.png'):''} style={{width:'14px'}} />
															<img className='responsive' src={el.recommondChemist ? (el.recommondChemist.userRank>=9 ? './app/img/index/icon_starfull.png':'./app/img/index/icon_starnull.png'):''} style={{width:'14px'}} />
														</div>
														<img className='responsive' src='./app/img/index/icon_chemist_servcount.png' style={{height:'14px',position:'relative',top:'2px',marginLeft:'6px'}}/>
														<span>{el.recommondChemist ? el.recommondChemist.serviceNum:'0'}</span>
													</div>
												</div>
											</div>
											<div className='padding-10'>
												<Link to={el.recommondChemist ? ('/talking/'+el.recommondChemist.uid):'#'} className='fz-16 btn online-green text-white text-center' 
												style={{width:'100%',height:'35px',lineHeight:'35px'}}>立即向TA咨询</Link>
											</div>
										</div>
									</div>
								</div>
								<div className={el.type=='calling'?'overflow margin-tb-10 text-center':'hidden'} >
									<p className='btn text-gray text-center fz-12'>
										<span>打字太麻烦？直接</span>
										<a href={'tel:'+this.state.chemistInfo.cellPhone} className='text-primary' style={{textDecoration:'underline'}}>电话咨询</a>？
									</p>
								</div>
								<div className={el.type==16?'overflow margin-tb-10':'hidden'} >
									<div className='col-1 pull-right'>
										<img className='circle responsive' src={el.avatar} />
									</div>
									<div className='col-10 pull-right padding-r-10'>
										<span className='msg-right b pull-right'>
											<p>{el.name}</p>
											<div>
												<span>服务质量: </span>
												<img className='responsive' src={el.rank>=1 ? './app/img/index/icon_starfull.png':'./app/img/index/icon_starnull.png'} style={{width:'14px'}} />
												<img className='responsive' src={el.rank>=2 ? './app/img/index/icon_starfull.png':'./app/img/index/icon_starnull.png'} style={{width:'14px'}} />
												<img className='responsive' src={el.rank>=3 ? './app/img/index/icon_starfull.png':'./app/img/index/icon_starnull.png'} style={{width:'14px'}} />
												<img className='responsive' src={el.rank>=4 ? './app/img/index/icon_starfull.png':'./app/img/index/icon_starnull.png'} style={{width:'14px'}} />
												<img className='responsive' src={el.rank>=5 ? './app/img/index/icon_starfull.png':'./app/img/index/icon_starnull.png'} style={{width:'14px'}} />
											</div>
											<p>{el.message}</p>
										</span>
									</div>
								</div>
								<div className={(el.type!='recommond')&&(el.type!=17)&&(el.type!=16)&&(el.type!=1)&&(el.type!=2)&&(el.type!=8)&&(el.type!=9)&&(el.type!='time')&&(el.type!='calling')?'overflow margin-tb-10':'hidden'} >
									<div className='col-1'>
										<img className='circle responsive' src={el.avatar} />
									</div>
									<div className='col-10 padding-l-10'>
										<span className='msg-left b pull-left'>
											<p>您有一条新消息，但当前版本不支持该消息格式，下载掌上药店客户端可进行查看。是否立即下载？</p>
											<p>
												<Link to={'/downLoad'} className='fz-16 btn online-green text-white text-center' 
												style={{width:'100%',height:'35px',lineHeight:'35px',marginTop:'5px'}}>点击下载</Link>
											</p>
										</span>
									</div>
								</div>
							</div>
						)
					}.bind(this))	
				}</div>
				<div className={this.state.isLoaded ? 'hidden':'bg-white'} style={{position:'fixed',marginTop:'40px',width:'100%',height:'100%',top:'0'}}>
					<img className='block block-center' style={{width:'20px'}} src='./app/img/loading.gif' />
				</div>
				<div className='bg-white bt padding-tb-5' style={{position:'fixed',bottom:'0',width:'100%'}}>
					<div className='col-10 overflow'>
						<input ref='message' type='text' className='block block-center b fz-14' style={{width:'94%',height:'30px'}} value={this.state.content} onChange={this.msgChange}/>
					</div>
					<div className='col-2'>
						<button className='btn bg-primary block-center' onClick={this.sendMessage} style={{width:'90%',height:'32px'}}>发送</button>
					</div>
				</div>
			</div>
	    );
  	}
});
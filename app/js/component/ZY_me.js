var React = require('../../../node_modules/react/dist/react-with-addons.js');
var Link = require('react-router').Link;
var ZY_chemistList=require('./ZY_chemistList.js');
var ajax=require('../common/ajax.js');
var encryption=require('../common/encryption.js');
var cookie=require('../common/cookie.js');
var API=require('../common/zyo_api_url.js');
var ZY_footer=require('./ZY_footer.js');

module.exports=React.createClass({
	getInitialState:function(){
		return{
			focusImList:[],
			isLoaded:false
		};
    },
    update:function(){
    	if(cookie.get('userid')!='undefined'){
	    	var str=API.myFocusIm.split('?')[1]+'&uid='+cookie.get('userid');
	    	var sign=encryption(str);
		    ajax().post(API.myFocusIm,{ uid:cookie.get('userid'),sign:sign },'json')
			.success(function(data){
			    if (this.isMounted()) {
			    	if(data.code=='0'){
			    		if(data.data.focusImList) this.setState({ focusImList:data.data.focusImList });//获取关注列表
			    	}		
			    }
			    setTimeout(function(){
			        this.setState({ isLoaded:true });
			    }.bind(this),10);
			}.bind(this));
		}else{
			this.setState({ focusImList:[] });
			setTimeout(function(){
		        this.setState({ isLoaded:true });
		    }.bind(this),10);
		}
	},
    componentDidMount: function() {
    	this.update();
	},
	logout:function(){
		cookie.remove('userid');
		this.update();
	},
	render: function() {
		if(cookie.get('userid')=='undefined'){//如果用户未登录
			return (
			<div>
		    	<div className='padding-tb-20'>
					<Link to='/login'>
						<button className='b btn block-center text-black bg-lightgray block' style={{height:'35px',width:'80px'}}>登录</button>
					</Link>
				</div>
				<ZY_footer />
			</div>
	    );
		}else{//如果用户登录了
			if(this.state.focusImList.length!=0){
				return(
					<div>
						<div>{
					    	this.state.focusImList.map(function(el){
					    		return(
						    		<div className='padding-tb-10 bb overflow' key={el.focusId}>
							    		<div className='col-3 padding-lr-10'>
							    			<img className='circle responsive' style={{width:'60px',height:'60px'}} src={el ? el.avatar:''} />
							    		</div>
							    		<div className='col-9'>
											<Link to={'/chemistDetail/'+el.focusId} chemistID={el.focusId}>
												<div className='col-9' style={{display:'flex',height:'60px',alignItems:'center'}}>
													<div style={{width:'100%'}}>
														<div>
															<span className='fz-14'>{el.focusName} </span>
														</div>
														<div style={{padding:'0'}}>
															<span className={el.serviceNum!='' ? '':'hidden'}>
																<img className='responsive' src='./app/img/index/icon_chemist_servcount.png' style={{height:'14px',position:'relative',top:'2px'}}/>
																<span className='fz-12'>{el.serviceNum} </span>
															</span>
															<span className={el.userRank!='' ? '':'hidden'}>
																<img className='responsive' src='./app/img/index/icon_chemist_levelcount.png' style={{height:'14px',position:'relative',top:'2px'}}/>
																<span className='fz-12'>{el.userRank}</span>
															</span>
														</div>
														<div className={el.signature!='' ? 'details text-gray':'hidden'}>
															<span className='fz-12'>{el.signature}</span>
														</div>
													</div>
												</div>
												<div className='col-3'>
													<button className='btn bg-green' style={{width:'50px',height:'30px',marginTop:'15px'}}>咨询</button>
												</div>
											</Link>
							    		</div>
									</div>
								)
					    	})
					    }
					    </div> 
						<div style={{padding:"50px 0 40px 0"}}>
							<button className='btn block-center bg-red block' onClick={this.logout} style={{height:'38px',width:'80%'}}>
								退出登录
							</button>
						</div>
						<ZY_footer />
					</div>
				);
			}else{
				return(
					<div>
						<div className={this.state.isLoaded ? 'hidden':'bg-white'} style={{position:'absolute',width:'100%',top:'0',bottom:'0',height:'1200px'}}>
							<img className='block block-center' style={{width:'20px'}} src='./app/img/loading.gif' />
						</div>
						<div className='bg-white' style={{textAlign:'center',padding:'10px',color:'#cdcdcd'}}>
				    		<p>暂无关注</p>
				    	</div>
						<div style={{padding:"50px 0 40px 0"}}>
							<button className='btn block-center bg-red block' onClick={this.logout} style={{height:'38px',width:'80%'}}>
								退出登录
							</button>
						</div>
						<ZY_footer />
					</div> 
				);
			}
			
		}    
	}
});
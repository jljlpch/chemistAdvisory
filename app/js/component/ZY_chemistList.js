var React = require('../../../node_modules/react/dist/react-with-addons.js');
var Link = require('react-router').Link;
var ajax=require('../common/ajax.js');
var encryption=require('../common/encryption.js');
var API=require('../common/zyo_api_url.js');
var ZY_footer=require('./ZY_footer.js');

module.exports=React.createClass({
	getInitialState: function() {
	    return {
	      storeEmployeeList:[],
	      isLoaded:false
	    };
	  },
	componentDidMount: function() {
		var str=API.employeeList.split('?')[1];
	    var sign=encryption(str);
	    ajax().post(API.employeeList,{ sign:sign },'json')
		.success(function(data){
		    if (this.isMounted()) {
		        this.setState({ storeEmployeeList:data.data.storeEmployeeList });
		        setTimeout(function(){
			        this.setState({ isLoaded:true });
			    }.bind(this),10);
		    }
		}.bind(this));
	},
  	render: function() {
	    return (
	    	<div>{
		    	this.state.storeEmployeeList.map(function(el){
		    		return(
			    		<div className='padding-tb-10 bb overflow' key={el.uid}>
				    		<div className='col-3 padding-lr-10'>
				    			<img className='circle responsive' style={{width:'60px',height:'60px'}} src={el.avatar!='' ? el.avatar:'http://shop.lkhealth.net/app/assets/www/yaodian/images/face.png'} />
				    		</div>
				    		<div className='col-9'>
								<Link to={'/chemistDetail/'+el.uid} chemistID={el.uid}>
									<div className='col-9' style={{display:'flex',height:'60px',alignItems:'center'}}>
										<div style={{width:'100%'}}>
											<div>
												<span className='fz-14'>{el.userName} </span>
											</div>
											<div style={{padding:'0'}}>
												<span className={el.serviceNum!=''? '' : 'hidden'}>
													<img className='responsive' src='./app/img/index/icon_chemist_servcount.png' style={{height:'14px',position:'relative',top:'2px'}}/>
													<span className='fz-12'>{el.serviceNum}人 </span>
												</span>
												<span className={el.userRank!=''?'':'hidden'}>
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
		    	<div className={this.state.isLoaded ? 'hidden':'bg-white'} style={{position:'absolute',width:'100%',top:'0',bottom:'0',height:'1200px'}}>
					<img className='block block-center' style={{width:'20px'}} src='./app/img/loading.gif' />
				</div>
		    	<ZY_footer />
		    </div> 	
	    );
  	}
});
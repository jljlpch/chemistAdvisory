var React = require('../../../node_modules/react/dist/react-with-addons.js');
var Link = require('react-router').Link;
var MessageStore=require('../store/MessageStore.js');
var conn=require('../common/zyo_im_pack.js');

function getHeader(){
	switch(window.website){
		case 'yszx':{
			return { title:'药师咨询',icon:'./app/img/icon_yaoshizixun.png' }
			break;
		}
		case 'cjb':{
			return { title:'常见病药师咨询',icon:'./app/img/changjian_icon.png' }
			break;
		}
		case 'ek':{
			return { title:'儿科药师咨询',icon:'./app/img/erke_icon.png' }
			break;
		}
		case 'fk':{
			return { title:'妇科药师咨询',icon:'./app/img/ufke_icon.png' }
			break;
		}
		case 'mxb':{
			return { title:'慢性病药师咨询',icon:'./app/img/manxing_icon.png' }
			break;
		}
		case 'nk':{
			return { title:'男科药师咨询',icon:'./app/img/nanke_icon.png' }
			break;
		}
		case 'pfk':{
			return { title:'皮肤科药师咨询',icon:'./app/img/fupi_icon.png' }
			break;
		}
		case 'wgk':{
			return { title:'五官科药师咨询',icon:'./app/img/wuguan_icon.png' }
			break;
		}
		default : break;
	}
}

module.exports=React.createClass({
	getInitialState:function(){
		var selectIndex;
		if((location.hash.split('/')[2]=='chemistList')||(location.hash.split('/')[2]==undefined)) selectIndex=1;
		if(location.hash.split('/')[2]=='message') selectIndex=2;
		if(location.hash.split('/')[2]=='me') selectIndex=3;
		return{
			selectIndex:selectIndex,
			isNewMessage:MessageStore.get(),
			title:getHeader().title,
			icon:getHeader().icon
		};
    },
    componentDidMount:function(){
    	conn.connect();
    	if(location.hash=='#/'){
    		location.href='#/index/chemistList';
    	}
    	MessageStore.addChangeListener(function(){
    		if(location.hash.match('#/index')){
    			this.setState({ isNewMessage:MessageStore.get() });
    		}
    	}.bind(this));
    },
    componentWillUnmount:function(){
		MessageStore.removeChangeListener(function(){});
	},
    selectClick:function(index){
    	this.setState({selectIndex:index});
    },
    reflash:function(){
    	location.reload();
    },
  	render: function() {
	    return (
			<div className="main bg-white">
				<div style={{position:'fixed',top:'0',width:'100%'}}>
					<header className='ht-40 col-12 bg-green'>
						<div className='col-2 ht-40 text-center relative' ></div>
						<div className="col-8 ht-40 text-center">
							<p className='text-white' style={{lineHeight:'40px'}}>
								<img className='responsive' src={this.state.icon} style={{height:'20px',position:'relative',top:'4px'}}/>
								<span>{this.state.title}</span>
							</p>
						</div>	
						<div className="col-2 ht-40 text-center relative" onClick={ this.reflash }>
							<a href="javascript:;" >
								<img className='ht-20 responsive' style={{position:'absolute',top:'10px',right:'15px'}} src="./app/img/refresh.png"/>
							</a>
						</div>
					</header>
				</div>
				<div className='bg-white' style={{position:'fixed',top:'40px',width:'100%'}}>
					<div style={{clear:"both",overflow:'hidden'}}>
						<Link to="/index/chemistList" style={{lineHeight:'40px'}} onClick={this.selectClick.bind(this,1)}
						className={this.state.selectIndex==1?'col-4 ht-40 text-center br text-green bb-green':'col-4 ht-40 text-center bb br'}> 
							药师
						</Link>
						<Link to="/index/message" style={{lineHeight:'40px',position:'relative'}} onClick={this.selectClick.bind(this,2)}
						className={this.state.selectIndex==2?'col-4 ht-40 text-center br text-green bb-green':'col-4 ht-40 text-center bb br'}>
							消息
							<span className={this.state.isNewMessage?'remind-dot':'hidden'}></span>
						</Link>
						<Link to="/index/me" style={{lineHeight:'40px'}} onClick={this.selectClick.bind(this,3)}
						className={this.state.selectIndex==3?'col-4 ht-40 text-center text-green bb-green':'col-4 ht-40 text-center bb'}> 
							我
						</Link>
					</div>
				</div>
				<div className='bg-white' style={{position:'absolute',top:'80px',width:'100%',zIndex:'-1'}}>
					{this.props.children}
				</div>
			</div>
	    );
  	}
});
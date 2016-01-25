var React = require('../../../node_modules/react/dist/react-with-addons.js');
module.exports=React.createClass({
	getInitialState:function(){
		return{
			title:this.props.config.title,
			classString:'ht-40 col-12 '+this.props.config.color
		}
    },
	backClick:function(){
		window.history.back(-1);
	},
	homeClick:function(){
		location.href="/";
	},
	render:function(){
		return(
			<header className={this.state.classString}>
				<div className='col-2 ht-40 text-center relative' onClick={ this.backClick }>
					<a href="javascript:;" className={this.props.config.showBack?'':'hidden'}>
						<img className='ht-20 responsive' style={{position:'absolute',top:'10px',left:'15px'}} src="./app/img/index/btn_nav_backward.png"/>
					</a>
				</div>
				<div className="col-8 ht-40 text-center">
					<p className='text-white' style={{lineHeight:'40px'}}>{this.state.title}</p>
				</div>	
				<div className={this.props.config.showHome?"col-2 ht-40 text-center relative":'hidden'} onClick={ this.homeClick }>
					<a href="javascript:;">
						<img className='ht-20 responsive' style={{position:'absolute',top:'10px',right:'15px'}} src="./app/img/index/icon_nav_claim.png"/>
					</a>
				</div>
			</header>
		);
	}
});
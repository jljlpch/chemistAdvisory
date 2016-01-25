var React = require('../../../node_modules/react/dist/react-with-addons.js');
var Slider = require('../../../node_modules/react-slick/dist/react-slick.js');
var ZY_header=require('./ZY_header.js');
var ZY_footer=require('./ZY_footer.js');

module.exports=React.createClass({
	mixins: [React.addons.LinkedStateMixin],
	getInitialState:function(){
		return{

			ZY_header_config:{/*header配置项*/
				title:'客户端下载',
				color:'bg-primary',
				showBack:true,
				showHome:false
			}
		}
    },
    componentDidMount: function() {
    	setTimeout(function(){
    		$('li:first button').css('background-color',"#D3D3D3");
    	},10);
	},
    down:function(){
    	if(!!window.navigator.userAgent.match('MicroMessenger')){// == 'micromessenger'
            location.href= 'http://a.app.qq.com/o/simple.jsp?pkgname=com.manle.phone.android.yaodian';
        }else{//浏览器直接下载
            if(navigator.userAgent.match("iPhone")){
                location.href="http://itunes.apple.com/us/app/id465049131?ls=1&mt=8";
            }else{
                location.href='http://phone.lkhealth.net/ydzx/zy_guanwang.apk';
            }
        } 
    },
	render:function(){
		var settings = {
			arrows:false,
	      	dots: true,
	      	dotsClass:'dot-style',
	      	infinite: true,
	      	speed: 500,
	      	slidesToShow: 1,
	      	slidesToScroll: 1,
	      	afterChange:function(){
	      		$('li button').css('background-color',"#ffffff");
	      		$('.slick-active button').css('background-color',"#D3D3D3");
	      	}
	    };
		return(
			<div className='downLoad'>
				<ZY_header config={this.state.ZY_header_config} />
				<div className='clear'></div>
				<Slider {...settings}>
			        <div>
			        	<img className='responsive' src="./app/img/index/app_download_car_1.png"/>
			        </div>
			        <div>
			        	<img className='responsive' src="./app/img/index/app_download_car_2.png"/>
			        </div>
			        <div>
			        	<img className='responsive' src="./app/img/index/app_download_car_3.png"/>
			        </div>
			    </Slider>
				<div className='bg-white padding-tb-20'>
					<button className='btn block block-center bg-green fz-16' style={{height:'40px',width:'60%'}} onClick={this.down}>
						立即下载
					</button>
				</div>
				<ZY_footer />
			</div>
		);
	}
});
var React = require('../../../node_modules/react/dist/react-with-addons.js');

module.exports=React.createClass({
  	render: function() {
	    return (
	    	<div className='footer fz-12' style={{backgroundColor:'#F4F4F4'}}>
	    		<div className='text-center text-gray' style={{padding:'30px 0 30px 0'}}>
	    			<p>Copyright <span style={{fontSize:'12px'}}>©</span> 2014-2015</p>
        			<p>ask.drugs360.cn</p>
	    		</div>
			</div>
	    );
  	}
});
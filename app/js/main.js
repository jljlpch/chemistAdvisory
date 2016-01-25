var React = require('react');
var ReactDOM = require('react-dom');
//路由框架
var Router = require('react-router').Router,
	Route = require('react-router').Route,
	IndexRoute= require('react-router').IndexRoute,
	Redirect=require('react-router').Redirect,
	IndexLink=require('react-router').IndexLink;
//history
var createHistory=require('history').createHashHistory,
	useBasename=require('history').useBasename;
//app启动
var ZY_app=React.createClass({
	render:function(){
		return(<div>{this.props.children}</div>);
	}
});
//index首页
var ZY_index=require('./component/ZY_index.js'),
    ZY_chemistList=require('./component/ZY_chemistList.js'),
    ZY_message=require('./component/ZY_message.js'),
    ZY_me=require('./component/ZY_me.js');
//药师详情
var ZY_chemistDetail=require('./component/ZY_chemistDetail.js');
//聊天详情
var ZY_talking=require('./component/ZY_talking');
//登录
var ZY_login=require('./component/ZY_login');
//注册
var ZY_register=require('./component/ZY_register');
//找回密码
var ZY_findBack=require('./component/ZY_findBack');
//发表评价
var ZY_comment=require('./component/ZY_comment');
//下载
var ZY_downLoad=require('./component/ZY_downLoad.js');
/*路由*/
var history = createHistory({
  queryKey: false //禁止history自定义_key
});
ReactDOM.render(
    <Router history={history}>
	    <Route path="/" component={ZY_app}>
	    	<IndexRoute component={ZY_index} />
	    	<Route path='index' component={ZY_index}>
		    	<Route path="chemistList" component={ZY_chemistList} />
		    	<Route path="message" component={ZY_message} />
		    	<Route path="me" component={ZY_me} />
	    	</Route>
	    	<Route path="chemistDetail/:id" component={ZY_chemistDetail} ></Route>
		    <Route path="talking/:id" component={ZY_talking} ></Route>
		    <Route path="comment/:id" component={ZY_comment} ></Route>
		    <Route path="login" component={ZY_login} ></Route>
		    <Route path="register" component={ZY_register} ></Route>
		    <Route path="findBack" component={ZY_findBack} ></Route>
		    <Route path="downLoad" component={ZY_downLoad} ></Route>
	    </Route> 
	</Router>,
    document.getElementById('app')
);
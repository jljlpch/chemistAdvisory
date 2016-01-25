var API_HTTP5= '*********************************';

module.exports= {
    /*用户登录*/
    'login':API_HTTP5+'user/login',
    /*获取验证码*/
    'getcellphonecode':API_HTTP5+'user/getcellphonecode',
    //找回密码
    'resetpasswordphone':API_HTTP5+'user/resetpasswordphone',
    /*用户注册*/
    'reg':API_HTTP5+'user/reg',
    //获取用户信息
    'myinfoindex':API_HTTP5+'user/myinfoindex',
    /*药师列表*/
    'employeeList':API_HTTP5+"employee/employeeList",
    /*我的关注*/
    'myFocusIm':API_HTTP5+"user/myFocusIm",
    /*药师详情*/
    'employeeInfo':API_HTTP5+'employee/employeeInfo',
   /* 关注药师*/
    'focusEmployee':API_HTTP5+'employee/focusEmployee',
    /*取关药师*/
    'cancelFocusEmployee':API_HTTP5+'employee/cancelFocusEmployee',
    //评论店员
    //&uid=1008206&userId=1&content=5511&rank=80
    'reviewEmployee':API_HTTP5+'employee/reviewEmployee',
    /*推荐药师*/
    'getRecommendChemist':API_HTTP5+'employee/getRecommendChemist',
    /*qq登录*/
    'loginExternal': API_HTTP5+'user/loginExternal&type=1'
}

function changeCode(){
    //alert("xx");
    $("#kaptchaImage").attr("src","/captcha.png?rand="+Math.random());
}

function judgeRegister(){
	// var regEx = /^[a-zA-Z0-9_]{3,20}$/;
	// if(!regEx.test(value)){
	// 	req.flash('error','用户名长度为3-20，只能是字母、数字、下划线的组合');
	// }
}

<?php
namespace app\index\controller;
// use think\View;
use think\Controller;
use think\Session;
//use think\Validate;
use app\index\model\User;

class login extends Controller{
	public function index(){
		// $view = new View;
		return $this->fetch();
	}

	public function login($user_name='',$user_password=''){
		$user=User::get([
				'user_name' => $user_name,
				'user_password' => $user_password
			]);
		Session::set('name',$user_name);
		//$code=input('post.user_vertify');
		if($user){
			return $this->success('登录成功！','/');
		}else{
			return $this->error('用户名或密码不正确');
		}
			
	}
}
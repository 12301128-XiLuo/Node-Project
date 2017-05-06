<?php
namespace app\index\controller;
use think\Controller;
use think\Validate;
use think\Db;
use app\index\model\User;

class Regist extends Controller{

  public function index(){
  	return $this->fetch();
  }
  
  public function regist(){
    $user = new User;
    $User = db('user');
    $tip = '注册失败';

	  $data['user_name'] = input('post.username');
    $user_name = input('post.username');
    $data['user_password'] = input('post.password');
    //验证两次密码输入是否一致
    if(input('post.password_repeat') == input('post.password')){
      //查询该用户有无注册
      $condition['user_name'] = $user_name;
      $userCheck = $User->where($condition)->select();
      
      if($userCheck){
        $tip = '该用户已注册';
      }else if ($user->save($data)) {
        return $this->success('注册成功','/login');
      } 
    }else{
      $tip = '两次输入的密码不一致';
    }
    return $this->error($tip);
	}	
}
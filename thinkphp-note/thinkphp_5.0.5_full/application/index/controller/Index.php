<?php
namespace app\index\controller;
use think\Controller;
use think\Db;
use think\Validate;
use think\Session;
use think\Hook;
use think\Request;

use app\index\model\Post;
class Index extends Controller
{

	private $path='/';
	/**
	 * [check 检查是否登录 未登录直接跳转回登录页面]
	 */
	public function check(){
		if(!Session::has('name')){
			Hook::listen('CheckAuth',$params);
		}	
	}
	/**
	 * [userInit 初始化user信息]
	 */
	public function userInit(){
		if(Session::has('name')){
			$name=Session::get('name');
		}else{
			return $this->error('请登录!','/login');
		}
		$this->assign('name',$name);
	}
	//初始化首页
	public function index(){
		$this->check();
		$this->userInit();
		//分页获取自己本人发表的日记
		$condition['user_name'] = Session::get('name');
		$lists=Post::where($condition)->paginate(5);
	
		$this->assign('list',$lists);
		return $this->fetch();
	}

	
	//初始化日记详情页
	public function detail($id){
		$this->check();
		$this->userInit();
		//根据id获取日记
		$article=Post::get($id);	
		$this->assign('article',$article);
		return $this->fetch();
	}
	//初始化添加日记页面
	public function addpage(){
		$this->check();
		$this->userInit();
		return $this->fetch();
	}

	//删除日记
	public function delete($id){
		$this->check();
		$article=Post::get($id);
		//如果有该日记则删除
		if($article){
			$article->delete();
			$this->success('删除日记成功！',$this->path);
		}else{
			$this->error('没有要删除的日记！');
		}
	}
	//添加日记
	public function addnote(){
		$article=new Post;
		$data['title']=$_POST['title'];
		$data['content']=$_POST['post'];
		$data['key']=$_POST['key'];
		$data['create_time']=time();

		if($article->save($data)){
			return ['msg'=>'1','status'=>200];
		}else{
			return ['msg'=>'0','status'=>500];
		}
	}

	//注销登录
	public function logout(){
		Session::clear();
		return $this->success('已注销','/login');
	}
}

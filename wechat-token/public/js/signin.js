var User = require('../../common/users');

function signIn() {
    var name = $('#inputName').val();
    var id = $('#inputID').val();

	var newUser = new User({
        name : name,
        id : id
    });
    User.get(name, function (err, user) {
        if (err) {
          console.log('error'+err);
        }
        if (user) {
          req.flash('error', '用户已存在！');
          console.log('already exited! ');
          
          return res.redirect('/register');//返回注册页
        }
        
        //如果不存在则新增用户
        newUser.save(function (err, user) {
          if (err) {
            console.log('error'+err);
          }
          console.log('success');
        });
    });
}

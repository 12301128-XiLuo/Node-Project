module.exports = {
	getNoteList: function(req, res) {
	    var allPosts = [];
	    req.models.note.find({user_name:req.session.user.user_name}).exec(function(err, note){
            console.log(note);

            res.render('home', { 
	            title: '主页', 
	            user: req.session.user,
	            posts: note,
	            success: req.flash('success').toString(),
	            error: req.flash('error').toString()
	        }); 
        });   
	},
	getNoteDetailById: function(req, res) {
	    console.log(req.query.id);
	    req.models.note.find({id:req.query.id}).exec(function(err, note){
            console.log(note);
            if(err){
	            note = [];
	        }
            res.render('detail', { 
	            title: '详情', 
	            user: req.session.user,
	            posts: note,
	            success: req.flash('success').toString(),
	            error: req.flash('error').toString()
	        }); 
        });   
	},
	addNote: function (req, res) {
	    var judge = 1;
	    var currentUser = req.session.user;
	    var Note = {
	    		user_name : currentUser.user_name,
	    		title : req.body.title,
	    		key : req.body.key,
	    		content : req.body.post
	    	};
    	req.models.note.create(Note).exec(function(err,result){
            if (err) {
                req.flash('error', err);
                console.log('error'+err);
                judge = 0;
            }
            req.flash('success', '发布成功!');
            res.json({type: judge});
        });
	}
}
var express = require('express');
var router = express.Router();
var core = require('../../libs/core');
var action = require('../../middlewares/action');
var comment = require('../../controllers/server/comment');

//权限判断
router.use(function(req, res, next) {
    console.log('评论页: ' + Date.now());
    res.locals.Path = 'comment';
    if(!req.session.user) {
        var path = core.translateAdminDir('/user/login');
        return res.redirect(path);
    }
    /*if(!req.Roles || (req.Roles.indexOf('admin') < 0 && req.Actions && req.Actions.indexOf('comment') < 0)) {
        var path = core.translateAdminDir('/');
        return res.redirect(path);
    }*/
    next();
});
//内容列表
router.route('/').get(action.checkAction('COMMENT_INDEX'), comment.list);
//单条信息
router.route('/:id').get(action.checkAction('COMMENT_DETAIL'), comment.one);
//删除信息
router.route('/:id/del').all(action.checkAction('COMMENT_DELETE'), comment.del);

module.exports = function(app) {
    var path = core.translateAdminDir('/comment');
    app.use(path, router);
};

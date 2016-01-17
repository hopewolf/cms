var express = require('express');
var router = express.Router();
var core = require('../../libs/core');
var content = require('../../controllers/server/content');

//权限判断
router.use(function(req, res, next) {
    console.log('内容页: ' + Date.now());
    res.locals.Path = 'content';
    if(!req.session.user) {
        var path = core.translateAdminDir('/user/login');
        return res.redirect(path);
    }
    /*if(!req.Roles || (req.Roles.indexOf('admin') < 0 && req.Actions && req.Actions.indexOf('content') < 0)) {
        var path = core.translateAdminDir('/');
        return res.redirect(path);
    }*/
    next();
});

//内容列表
router.route('/').get(core.checkAction('CONTENT_INDEX'), content.list);
//添加内容
router.route('/add').all(core.checkAction('CONTENT_CREATE'), content.add);
//单条信息
router.route('/:id').get(core.checkAction('CONTENT_DETAIL'), content.one);
//更新信息
router.route('/:id/edit').all(core.checkAction('CONTENT_UPDATE'), content.edit);
//删除信息
router.route('/:id/del').all(core.checkAction('CONTENT_DELETE'), content.del);


module.exports = function(app) {
    var path = core.translateAdminDir('/content');
    app.use(path, router);
};

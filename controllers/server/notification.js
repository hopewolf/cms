'use strict';
var mongoose = require('mongoose'),
    Notification = mongoose.model('Notification'),
    core = require('../../libs/core');
//列表
exports.list = function(req, res) {
    var condition = {};
    /*if(req.Roles && req.Roles.indexOf('admin') < 0) {
        condition.author = req.session.user._id;
    }*/
    Notification.count(condition, function(err, total) {
        var query = Notification.find(condition).populate('from to');
        //分页
        var pageInfo = core.createPage(req, total, 10);
        //console.log(pageInfo);
        query.skip(pageInfo.start);
        query.limit(pageInfo.pageSize);
        query.sort({created: -1});
        query.exec(function(err, results) {
            //console.log(err, results);
            res.render('server/notification/list', {
                //title: '列表',
                Menu: 'list',
                notifications: results,
                pageInfo: pageInfo
            });
        })
    })
};
//列表
exports.sent = function(req, res) {
    var condition = {};
    /*if(req.Roles && req.Roles.indexOf('admin') < 0) {
        condition.author = req.session.user._id;
    }*/
    Notification.count(condition, function(err, total) {
        var query = Notification.find(condition);
        //分页
        var pageInfo = core.createPage(req, total, 10);
        //console.log(pageInfo);
        query.skip(pageInfo.start);
        query.limit(pageInfo.pageSize);
        query.sort({created: -1});
        query.exec(function(err, results) {
            //console.log(err, results);
            res.render('server/notification/list', {
                //title: '列表',
                Menu: 'sent',
                notifications: results,
                pageInfo: pageInfo
            });
        })
    })
};
//单条
exports.one = function(req, res) {
    var id = req.param('id');
    Notification.findById(id).exec(function(err, result) {
        console.log(result);
        if(!result) {
            return res.render('server/info', {
                message: '该留言不存在'
            });
        }
        res.render('server/notification/item', {
            title: result.name + '的留言',
            notification: result
        });
    });
};
//删除
exports.del = function(req, res) {
    var id = req.params.id;
    Notification.findById(id).exec(function(err, result) {
        if(!result) {
            return res.render('server/info', {
                message: '留言不存在'
            });
        }
        if(req.Roles && req.Roles.indexOf('admin') === -1) {
            return res.render('server/info', {
                message: '没有权限'
            });
        }
        console.log(result)
        result.remove(function(err) {
            if (req.xhr) {
                return res.json({
                    status: !err
                });
            }
            if(err) {
                return res.render('server/info', {
                    message: '删除失败222'
                });
            }
            res.render('server/info', {
                message: '删除成功'
            })
        });
    });
};

//发送
exports.add = function(req, res) {
    var obj = req.body;
    obj.from = obj.from ? mongoose.Types.ObjectId(obj.from) : '';
    obj.to = obj.from ? mongoose.Types.ObjectId(obj.to) : '';
    var notification = new Notification(obj);
    notification.save(function(err) {
        if (err) {
            /*return res.render('server/info', {
                message: '发送失败'
            });*/
            return res.json({
                message: '发送失败'
            })
        }
        /*return res.render('server/info', {
            message: '发送成功'
        });*/
        return res.json({
            message: '发送成功'
        })
    });
};
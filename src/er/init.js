/*
 * ER (Enterprise RIA)
 * Copyright 2010 Baidu Inc. All rights reserved.
 * 
 * path:    er/config.js
 * desc:    ER框架初始化方法
 * author:  erik
 */

///import er;
///import er.router;
///import er.locator;
///import er.contorller;
///import er.template;

/**
 * 初始化ER框架
 */
er.init = function () {
    // 添加默认route规则，形如：/path/to/location~key=value
    er.router.add( /^([\/\w-]+)(?:~(.*))?$/, er.controller.forward );

    // 添加权限验证器
    er.router.addAuthorizer( er.controller.checkAuth );

    // 初始化controller配置（模块和Action路径）
    er.controller.init();

    // 加载模板并启动
    er.template.load( er.locator.listen );
};

/*
 * ER (Enterprise RIA)
 * Copyright 2010 Baidu Inc. All rights reserved.
 * 
 * path:    er/View.js
 * desc:    视图类
 * author:  erik
 */

///import er.lib;
///import er.Model;
///import er.template;

er.View = function () {
    var ext_ = {};

    function View( options ) {
        var construct = new Function();

        options && (construct.prototype = options);
        er.lib.extend( construct.prototype, ext_ );
        er.lib.inherits( construct, arguments.callee );
        return construct;
    }

    View.prototype = {
        /**
         * 构造view实例
         *
         * @public
         * @param {Object} options 构造参数
         */
        construct: function ( options ) {
            if ( options && typeof options == 'object' ) {
                this.setTarget( options.target );
                this.setTemplate( options.template );
                this.setModel( options.model );
            }
        },
        
        /**
         * 设置渲染目标
         *
         * @public
         * @param {string|HTMLElement} target 目标元素或id
         */
        setTarget: function ( target ) {
            target && (this.target = target);
        },
        
        /**
         * 设置模板名
         *
         * @public
         * @param {string} template 模板名
         */
        setTemplate: function ( template ) {
            template && ( this.template = template );
        },
        
        /**
         * 设置数据模型
         *
         * @public
         * @param {er.Model} model 数据模型
         */
        setModel: function ( model ) {
            this.model = model;
        },
        
        /**
         * 渲染视图
         *
         * @public
         */
        render: function () {
            var target = er.lib.g( this.target );
            er.template.merge( target, this.template, this.model.getGUID() );
        },
        
        /**
         * 重绘视图
         *
         * @public
         */
        repaint: function () {
            this.render();
        },

        /**
         * 清空视图
         *
         * @public
         */
        clear: function () {
            var target = er.lib.g( this.target );
            target && (target.innerHTML = '');
        }
    };

    /**
     * 扩展渲染功能
     *
     * @static
     * @public
     * @param {Object} ext 扩展功能
     */
    View.extend = function ( ext ) {
        er.lib.extend( ext_, ext );
    };
 
    return View;
}();




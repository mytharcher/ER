/*
 * ESUI (Enterprise Simple UI)
 * Copyright 2010 Baidu Inc. All rights reserved.
 * 
 * path:    esui/Dialog.js
 * desc:    对话框控件
 * author:  zhaolei, erik, linzhifeng
 */

///import esui.Control;
///import esui.Layer;
///import esui.Mask;
///import esui.lib;

/**
 * 对话框控件
 * 
 * @param {Object} options 控件初始化参数
 */
esui.Popup = function ( options ) {
    
    // 标识鼠标事件触发自动状态转换
    this._autoState = 0;
    
    esui.Control.call( this, options );

    // 初始化自动定位参数
    this.__initOption('autoPosition', null, 'AUTO_POSITION');

    // 初始化宽度
    this.__initOption('width', null, 'WIDTH');

    // 初始化距离顶端的高度
    this.__initOption('top', null, 'TOP');
    this.top = parseInt( this.top, 10 );

    // 初始化距离左侧的高度
    this.__initOption('left', null, 'LEFT');
    this.left = parseInt( this.left, 10 );

    this._resizeHandler = this._getResizeHandler();
};

esui.Popup.prototype = {
    // 类型声明，用于生成控件子dom的id和class
    _type: 'popup',
    
    /**
     * 显示对话框
     * 
     * @public
     */
    show: function () {
        var mask = this.mask;
        // 如果mask不是object，则会隐式装箱
        // 装箱后的Object不具有level和type属性
        // 相当于未传参数
        mask && esui.Mask.show( mask.level, mask.type );

        var main;
        if ( !this.getLayer() ) {
            this.render();
        }

        main = this.getLayer().main;

        // 浮动层自动定位功能初始化
        if ( this.autoPosition ) {
            esui.lib.on( window, 'resize', this._resizeHandler );
        }
        
        this._resizeHandler();
        
        this._isShow = true;
    },
    
    /**
     * 隐藏对话框
     * 
     * @public
     */
    hide: function () {
        if ( this._isShow ) {
            if ( this.autoPosition ) {
                esui.lib.un( window, 'resize', this._resizeHandler );
            }
            
            this.getLayer().hide();
            this.mask && esui.Mask.hide( this.mask.level );
        }

        this._isShow = 0;
    },
    
    /**
     * 获取浮出层控件对象
     * 
     * @public
     * @return {esui.Layer}
     */
    getLayer: function () {
        return this._controlMap.layer;
    },

    /**
     * 设置内容
     *
     * @public
     * @param {string} content 要设置的内容，支持html.
     */
    setContent: function ( content ) {
        this.content = content;
        var main = this.getLayer().main;
        if (main) {
            main.innerHTML = content;
            // 改变内容后再次自适应位置
            setTimeout(this._resizeHandler, 0);
        }
    },

    
    /**
     * 获取页面resize的事件handler
     * 
     * @private
     * @return {Function}
     */
    _getResizeHandler: function () {
        var me = this;
            
        return function () {
            var layer   = me.getLayer(),
                main    = layer.main,
                left    = me.left,
                top     = me.top,
                body    = document.body
                doc     = body.parentNode;
            
            if ( !left ) {
                left = (doc.clientWidth - main.offsetWidth) / 2
                    + Math.max(doc.scrollLeft, body.scrollLeft);
            }
            if ( !top ) {
                top = (doc.clientHeight - main.offsetHeight) / 2
                    + Math.max(doc.scrollTop, body.scrollTop);
            }
            
            if ( left < 0 ) {
                left = 0;
            }

            if ( top < 0 ) {
                top = 0;
            }
            
            layer.show( left, top );
        };
    },
    
    onhide: new Function(),
        
    /**
     * 绘制对话框
     * 
     * @public
     */
    render: function () {
        var me      = this,
            layer   = me.getLayer();
        
        // 避免重复创建    
        if ( layer ) {
            return;
        }
        
        layer = me.createLayer(document.body);
    },
    
    createLayer: function (there) {
        var me = this;
        var layer = me._controlMap.layer = esui.util.create( 'Layer', {
            id      : me.__getId('layer'),
            retype  : me._type,
            skin    : me.skin ? me.skin + (me.draggable ? ' draggable' : '') : '',
            width   : me.width,
            main    : me.main,
            autoHide: me.autoHide,
            onhide  : me.hide.bind(me)
        } );
        layer.appendTo(there);
        return layer;
    },
    
    /** 
     * dialog只允许在body下。重置appendTo方法
     *
     * @public
     */ 
    appendTo: function () {
        this.render();
    },

    /** 
     * dialog不需要创建main，方法置空
     *
     * @private
     */
    __createMain: function () {},

    /**
     * 释放控件
     * 
     * @private
     */
    __dispose: function () {
        if ( this.autoPosition ) {
            esui.lib.un( window, 'resize', this._resizeHandler );
        }

        this._resizeHandler = null;
        esui.Control.prototype.__dispose.call( this );
    }
};

esui.lib.inherits( esui.Popup, esui.Control );

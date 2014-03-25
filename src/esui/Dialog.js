/*
 * ESUI (Enterprise Simple UI)
 * Copyright 2010 Baidu Inc. All rights reserved.
 * 
 * path:    esui/Dialog.js
 * desc:    对话框控件
 * author:  zhaolei, erik, linzhifeng
 */

///import esui.Popup;
///import esui.lib;

/**
 * 对话框控件
 * 
 * @param {Object} options 控件初始化参数
 */
esui.Dialog = function ( options ) {
    // 类型声明，用于生成控件子dom的id和class
    this._type = 'dialog';
    
    esui.Popup.call( this, options );
    
    // 初始化可拖拽参数
    this.__initOption('draggable', null, 'DRAGGABLE');
    
    // 初始化关闭按钮参数
    this.__initOption('closeButton', null, 'CLOSE_BUTTON');
};

esui.Dialog.prototype = {
    /**
     * 对话框头部的html模板
     * @private
     */
    _tplHead: '<div id="{0}" class="{1}" onmouseover="{4}" onmouseout="{5}">{2}</div>{3}',
    
    /**
     * 关闭按钮的html模板
     * @private
     */
    _tplClose: '<div ui="type:Button;id:{0};skin:layerclose"></div>',

    /**
     * 设置标题文字
     * 
     * @public
     * @param {string} html 要设置的文字，支持html
     */
    setTitle: function ( html ) {
        var el = esui.lib.g( this.__getId( 'title' ) );
        if ( el ) {
            el.innerHTML = html;
        }
        this.title = html;
    },

    /**
     * 设置内容
     *
     * @public
     * @param {string} content 要设置的内容，支持html.
     */
    setContent: function ( content ) {
        this.content = content;
        var body = this.getBody();
        if (body) {
            body.innerHTML = content;
            setTimeout(this._resizeHandler, 0);
        }
    },
    
    /**
     * 获取关闭按钮的点击handler
     *
     * @private
     * @return {Function}
     */
    _getCloseHandler: function () {
        var me = this;
        return function () {
            me.onhide();
            me.hide();
        };
    },
    
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

        esui.Popup.prototype.render.call(me);

        // 初始化dialog结构
        me._initStruct();
        
        // 拖拽功能初始化
        if ( this.draggable ) {
            esui.lib.draggable( layer.main, {handler:layer.main} );
        }
    },
    
    /** 
     * 初始化dialog的结构
     *
     * @private
     */
    _initStruct: function () {
        var layer = this.getLayer();
        var main = layer.main;
        var childs = [], childCount;
        var el;

        el = main.firstChild;
        while ( el ) {
            if ( el.nodeType == 1 ) {
                childs.push( el );
            }

            el = el.nextSibling;
        }
        childCount = childs.length;

        this._initHead( childCount < 2, childs[ 0 ] );
        this._initBody( childCount < 1, childs[ 1 ] || childs[ 0 ] );
        this._initFoot( childCount < 3, childs[ 2 ] );
    },
    
    /**
     * 初始化dialog的head
     *
     * @private
     * @param {boolean} needCreate 是否需要创建head元素
     * @param {HTMLElement} head 现有的head元素
     */
    _initHead: function ( needCreate, head ) {
        var me      = this;
        var layer   = me.getLayer();
        var main    = layer.main;
        var closeId = me.__getId( 'close' );
        var layerControl, closeBtn;

        if ( needCreate ) {
            head = document.createElement( 'div' );
            main.insertBefore( head, main.firstChild );
        } else {
            this.title = this.title || head.innerHTML;
        }
        
        esui.lib.addClass( head, this.__getClass( 'head' ) );
        head.id = this.__getId( 'head' );
        head.innerHTML = esui.util.format(
            me._tplHead,
            me.__getId( 'title' ),
            me.__getClass( 'title' ),
            me.title,
            (!me.closeButton  ? '' :
                esui.util.format(
                    me._tplClose,
                    closeId
            ) ),
            me.__getStrCall( '_headOver' ),
            me.__getStrCall( '_headOut' )
        );

        // 初始化关闭按钮
        layerControl = esui.util.init( head );
        closeBtn     = layerControl[ closeId ];
        if ( closeBtn ) {
            layer._controlMap._close = closeBtn;
            closeBtn.onclick = me._getCloseHandler();
        }
    },

    /**
     * 初始化dialog的body
     *
     * @private
     * @param {boolean} needCreate 是否需要创建body元素
     * @param {HTMLElement} body 现有的body元素
     */
    _initBody: function ( needCreate, body ) {
        if ( needCreate ) {
            body = document.createElement( 'div' );
            this.getLayer().main.appendChild( body );
        }
        
        esui.lib.addClass( body, this.__getClass( 'body' ) );
        body.id = this.__getId( 'body' );

        if ( this.content ) {
            body.innerHTML = this.content;
        } else {
            this.content = body.innerHTML;
        }
    },

    /**
     * 初始化dialog的foot
     *
     * @private
     * @param {boolean} needCreate 是否需要创建foot元素
     * @param {HTMLElement} foot 现有的foot元素
     */
    _initFoot: function ( needCreate, foot ) {
        var layer = this.getLayer();
        var controls;
        var control;
        var i = 0, len;
        var index = 0;

        if ( needCreate ) {
            foot = document.createElement( 'div' );
            layer.main.appendChild( foot );
        }
        
        esui.lib.addClass( foot, this.__getClass( 'foot' ) );
        foot.id = this.__getId( 'foot' );

        if ( this.footContent ) {
            foot.innerHTML = this.footContent;
        }

        // 初始化foot的按钮
        esui.util.init( foot );
        controls = esui.util.getControlsByContainer( foot );
        this._commandHandler = this._getCommandHandler();
        for ( len = controls.length; i < len; i++ ) {
            control = controls[ i ];
            if ( control instanceof esui.Button ) {
                control.onclick = this._commandHandler;
                control._dialogCmdIndex = index;
                index++;
            }

            layer._controlMap[ control.id ] = control;
        }
    },
    
    /**
     * 获取command handler
     *
     * @private
     * @return {Function} 
     */
    _getCommandHandler: function () {
        var me = this;
        return function () {
            if ( me.oncommand( { index: this._dialogCmdIndex } ) !== false ) {
                me.hide();
            }
        };
    },

    oncommand: new Function(),
    
    /**
     * 获取对话框主体的dom元素
     * 
     * @public
     * @return {HTMLElement}
     */
    getBody: function () {
        return esui.lib.g( this.__getId( 'body' ) );
    },
    
    /**
     * 获取对话框头部dom元素
     *
     * @public
     * @return {HTMLElement}
     */
    getHead: function () {
        return esui.lib.g( this.__getId( 'head' ) );
    },

    /**
     * 获取对话框腿部的dom元素
     * 
     * @public
     * @return {HTMLElement}
     */
    getFoot: function () {
        return esui.lib.g( this.__getId( 'foot' ) );
    },
    
    /**
     * 鼠标移上表头的handler
     * 
     * @private
     */
    _headOver: function () {
        esui.lib.addClass(
            this.getHead(), 
            this.__getClass( 'head-hover' ) );
    },
    
    /**
     * 鼠标移出表头的handler
     * 
     * @private
     */
    _headOut: function () {
        esui.lib.removeClass(
            this.getHead(), 
            this.__getClass( 'head-hover' ) );
    }
};

esui.lib.inherits( esui.Dialog, esui.Popup );

esui.Dialog.TOP             = 100;
esui.Dialog.WIDTH           = 400;
esui.Dialog.CLOSE_BUTTON    = 1;
esui.Dialog.OK_TEXT         = '确定';
esui.Dialog.CANCEL_TEXT     = '取消';

esui.Dialog._increment = function () {
    var i = 0;
    return function () {
        return i++;
    };
}();

/**
 * alert dialog
 */
esui.Dialog.alert = (function () {
    var dialogPrefix = '__DialogAlert';
    var buttonPrefix = '__DialogAlertOk';

    var tpl     = '<div class="ui-dialog-icon ui-dialog-icon-{0}"></div><div class="ui-dialog-text">{1}</div>';
    var footTpl = '<button ui="type:Button;id:{0};skin:em">{1}</button>';

    /**
     * 获取按钮点击的处理函数
     * 
     * @private
     * @param {Function} onok 用户定义的确定按钮点击函数
     * @return {Function}
     */
    function getDialogCommander( onok, id ) {
        return function() {
            var dialog = esui.util.get( dialogPrefix + id );
            var isFunc = ( typeof onok == 'function' );

            if ( ( isFunc && onok( dialog ) !== false ) 
                 || !isFunc
            ) {
                dialog.hide();

                esui.util.dispose( buttonPrefix + id );
                esui.util.dispose( dialog.id );
            }

            return false;
        };
    }
    
    /**
     * 显示alert
     * 
     * @public
     * @param {Object} args alert对话框的参数
     * @config {string} title 显示标题
     * @config {string} content 显示的文字内容
     * @config {Function} onok 点击确定按钮的行为，默认为关闭提示框
     */
    function show ( args ) {
        if ( !args ) {
            return;
        }
        
        var index   = esui.Dialog._increment();
        var title   = args.title || '';
        var content = args.content || '';
        var type    = args.type || 'warning';
        
        var dialog  = esui.util.create('Dialog', 
                          {
                              id            : dialogPrefix + index,
                              closeButton   : 0,
                              title         : '', 
                              width         : 440,
                              mask          : {level: 3 || args.level},
                              footContent   : esui.util.format( footTpl, buttonPrefix + index, esui.Dialog.OK_TEXT )
                          });
        
        dialog.show();
        dialog.oncommand = getDialogCommander( args.onok, index );
        dialog.setTitle( title );
        dialog.getBody().innerHTML = esui.util.format( tpl, type, content );
    }

    return show;
})();

/**
 * confirm dialog
 */
esui.Dialog.confirm = (function () {
    var dialogPrefix    = '__DialogConfirm';
    var okPrefix        = '__DialogConfirmOk';
    var cancelPrefix    = '__DialogConfirmCancel';

    var tpl = '<div class="ui-dialog-icon ui-dialog-icon-{0}"></div><div class="ui-dialog-text">{1}</div>';
    var footTpl = '<button ui="type:Button;id:{0};skin:em">{1}</button><button ui="type:Button;id:{2};">{3}</button>';

    /**
     * 获取按钮点击的处理函数
     * 
     * @private
     * @param {Function} onok 用户定义的确定按钮点击函数
     * @param {Function} oncancel 用户定义的取消按钮点击函数
     * @return {Function}
     */
    function getDialogCommander( onok, oncancel, id ) {
        return function ( args ) {
            var dialog = esui.util.get( dialogPrefix + id );
            var eventHandler = ( args.index === 0 ? onok : oncancel );
            var isFunc = (typeof eventHandler == 'function');

            if ( (isFunc && eventHandler( dialog ) !== false ) 
                 || !isFunc 
            ) {
                dialog.hide();
                esui.util.dispose( dialog.id );
            }

            return false;
        };
    }
    
    /**
     * 显示confirm
     * 
     * @public
     * @param {Object} args alert对话框的参数
     * @config {string} title 显示标题
     * @config {string} content 显示的文字内容
     * @config {Function} onok 点击确定按钮的行为，默认为关闭提示框
     * @config {Function} oncancel 点击取消按钮的行为，默认为关闭提示框
     */
    function show ( args ) {
        if ( !args ) {
            return;
        }
        
        var index       = esui.Dialog._increment();
        var title       = args.title || '';
        var content     = args.content || '';
        var type        = args.type || 'warning';

        var dialog = esui.util.create('Dialog', 
                          {
                              id            : dialogPrefix + index,
                              closeButton   : 0,
                              title         : '', 
                              width         : 440,
                              mask          : {level: 3 || args.level},
                              footContent   : esui.util.format( footTpl, 
                                                                okPrefix + index, 
                                                                esui.Dialog.OK_TEXT,
                                                                cancelPrefix + index,
                                                                esui.Dialog.CANCEL_TEXT)
                          });

        dialog.show();
        dialog.setTitle( title );
        dialog.getBody().innerHTML = esui.util.format( tpl, type, content );
        dialog.oncommand = getDialogCommander( args.onok, args.oncancel, index );
    }
    
    return show;
})();

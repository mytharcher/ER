/*
 * ESUI (Enterprise Simple UI)
 * Copyright 2011 Baidu Inc. All rights reserved.
 * 
 * path:    esui/plugin/ValidityShower.js
 * desc:    验证信息显示类
 * author:  mytharcher
 */

///import esui.lib;
///import esui.Control;
///import esui.InputControl;
///import esui.extend.InputControlValidityShower;
///import esui.extend.TextInputValidityShower;

/**
 * 输入控件验证信息处理类
 * @class esui.ValidityShower
 */
esui.ValidityShower = function(options){
    esui.Control.call(this, options);
};
esui.lib.extend(esui.ValidityShower.prototype, {
    _type: 'ValidityShower',
    
    /**
     * 渲染控件
     * 
     * @public
     */
    render: function () {
        if ( !this._isRendered ) {
            esui.lib.addClass(this.main, esui.ValidityShower.CLASS_STATUS_NORMAL);
        }
        
        esui.Control.prototype.render.call(this);
    },
    
    /**
     * 显示验证信息
     */
    showValidity: function (validity) {
        var myClass         = esui.ValidityShower,
            isValid         = validity.isValid(),
            states          = validity.getStateList(),
            customMessage   = validity.getCustomMessage(),
            msg             = [],
            i, len, state,
            elemWrap        = this.main,
            elemSuccess     = this._getSuccessBlock(),
            elemFailure     = this._getFailureBlock();
        
        esui.lib.removeClass(elemWrap, myClass.CLASS_STATUS_NORMAL);
        
        if (isValid) {
            if (elemSuccess) {
                
            }
            
            esui.lib.addClass(elemWrap, myClass.CLASS_STATUS_SUCCESS);
            esui.lib.removeClass(elemWrap, myClass.CLASS_STATUS_FAILURE);
        } else {
            if (elemFailure && !this._isSpecialBlock(elemFailure)) {
                if (customMessage) {
                    elemFailure.innerHTML = customMessage;
                } else {
                    for (i = 0, len = states.length; i < len - 1; i++) {
                        state = states[i];
                        //暂时修改为只显示一条错误信息，与系统目前保持一致，以后其他模块升级时再一起恢复
                        //!state.getState() && msg.push( state.getMessage() );
                        if (!state.getState()) {
                            msg.push(state.getMessage());
                            break;
                        }
                    }
                    
                    elemFailure.innerHTML = msg.join(', ');
                }
            }
            
            esui.lib.removeClass(elemWrap, myClass.CLASS_STATUS_SUCCESS);
            esui.lib.addClass(elemWrap, myClass.CLASS_STATUS_FAILURE);
        }
    },
    
    /**
     * 恢复到验证前的普通状态
     */
    resetValidity: function () {
        var myClass         = esui.ValidityShower,
            elemWrap        = this.main,
            elemSuccess     = this._getSuccessBlock(),
            elemFailure     = this._getFailureBlock();
        
        esui.lib.removeClass(elemWrap, myClass.CLASS_STATUS_SUCCESS);
        esui.lib.removeClass(elemWrap, myClass.CLASS_STATUS_FAILURE);
        
        esui.lib.addClass(elemWrap, myClass.CLASS_STATUS_NORMAL);
        if (elemSuccess && !this._isSpecialBlock(elemSuccess)) {
            elemSuccess.innerHTML = '';
        }
        if (elemFailure && !this._isSpecialBlock(elemFailure)) {
            elemFailure.innerHTML = '';
        }
    },
    _isSpecialBlock: function (node) {
        return (',' + this.constructor.SPECAIL_NODE_NAME + ',').indexOf(',' + node.nodeName + ',') > -1;
    },
    
    _getBlockByClass: function (cls) {
        var block = esui.lib.query('.' + cls, this.main);
        return block && block.length ? block[0] : null;
    },
    
    _getInfoBlock: function () {
        return this._getBlockByClass(this.__getClass(esui.ValidityShower.CLASS_BLOCK_INFO));
    },
    
    _getSuccessBlock: function () {
        return this._getBlockByClass(this.__getClass(esui.ValidityShower.CLASS_BLOCK_SUCCESS));
    },
    
    _getFailureBlock: function () {
        return this._getBlockByClass(this.__getClass(esui.ValidityShower.CLASS_BLOCK_FAILURE));
    }
});
esui.lib.inherits(esui.ValidityShower, esui.Control);
esui.lib.extend(esui.ValidityShower, {
    CLASS_BLOCK_INFO: 'info',
    CLASS_BLOCK_SUCCESS: 'success',
    CLASS_BLOCK_FAILURE: 'failure',
    CLASS_STATUS_NORMAL: 'status-normal',
    CLASS_STATUS_SUCCESS: 'success',
    CLASS_STATUS_FAILURE: 'error',
    SPECAIL_NODE_NAME: 'IMG,INPUT,TABLE,THEAD,TBODY,TFOOT,TR'
});

/*
use:

[html]
<div ui="type:InputInfo;id:userNameInfo">
    <input type="text" ui="
        type:TextInput;
        id:userNameInput;
        infoHandler:userNameInfo;
        name:username;
        placeholder:输入用户名;
        label:用户名;
        validateTrigger:blur;
    " />
</div>

*/
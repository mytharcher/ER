/*
 * ESUI (Enterprise Simple UI)
 * Copyright 2010 Baidu Inc. All rights reserved.
 * 
 * path:    esui/~plugin/ControlInitOptions.js
 * desc:    控件实用方法
 * author:  mytharcher
 * date:     2011-08-18
 */

///import esui.lib;
///import esui.InputControl;

/**
 * @class esui.InputControlValidityShower
 * esui插件：提供给所有InputControl组件增强的显示验证信息的功能
 */
esui.InputControlValidityShower = {
    showValidity: (function(origin){
        return function(validity){
            var handler = esui.get(this.infoHandler);
            if (handler) {
                handler.showValidity(validity);
            } else {
                origin.call(this, validity);
            }
        };
    })(esui.InputControl.prototype.showValidity),

    hideValidity: (function(origin){
        return function(validity){
            var handler = esui.get(this.infoHandler);
            if (handler) {
                handler.resetValidity();
            } else {
                origin.call(this);
            }
        };
    })(esui.InputControl.prototype.hideValidity),
    
    disable: function () {
        esui.Control.prototype.disable.call(this);
        this.hideValidity();
    }
};

esui.lib.extend(esui.InputControl.prototype, esui.InputControlValidityShower);

esui.InputControl.VALIDATE_TRIGGER_BLUR = 'blur';
esui.InputControl.VALIDATE_TRIGGER_CHANGE = 'change';
/*
 * ESUI (Enterprise Simple UI)
 * Copyright 2010 Baidu Inc. All rights reserved.
 * 
 * path:    esui/InputControl.js
 * desc:    输入控件基类
 * author:  erik
 */

///import esui.lib;
///import esui.util;
///import esui.Control;
///import esui.InputControl;
///import esui.BoxControl;

/**
 * 表单自动提交类
 * @class esui.AjaxForm
 */
esui.AjaxForm = function (options) {
    esui.Control.call(this, options);
};

esui.AjaxForm.prototype = {
    
    _type: 'AjaxForm',
    
    render: function () {
        var me   = this;
        var main = me.main;
        
        if (!me._isRendered) {
            main.action = this.action || main.action;

            main.onsubmit = this._getHandlerSubmit();
            main.onreset = this._getHandlerReset();
            
            me._handlerSubmitSuccess = this._getHandlerSubmitSuccess();
            me._handlerSubmitFailure = this._getHandlerSubmitFailure();
        }

        me.datasource && setTimeout(function () {
            me.setFormData(me.datasource);
        }, 0);
        
        // 设置disabled
        me.setDisabled( me.disabled );
        
        esui.Control.prototype.render.call(me);
    },
    
    /**
     * 循环迭代器
     * @param {Function} fn
     * @param {Object} scope
     * @param {Any...}
     */
    forEachField: function (fn, scope) {
        var args = Array.prototype.slice.call(arguments, 2),
            fields = esui.util.getControlsByContainer(this.main),
            scope = scope || this;
        
        for (var i = 0, len = fields.length; i < len; i++) {
            var field = fields[i];
            if (field instanceof esui.InputControl) {
                if (fn.apply(scope, [field].concat(args)) === false) {
                    break;
                }
            }
        }
    },
    
    /**
     * 验证表单
     * @protected
     * 
     * @param {boolean} justCheck 是否仅验证
     * @param {Boolean} all 是否要验证完全部才停止，默认：false
     * 
     * @return {boolean} 是否验证通过
     */
    __validate: function ( justCheck , all) {
        this._valid = true;
        this.forEachField(this._validateIterator, this, justCheck, all);
        return this._valid;
    },
    
    /**
     * 验证表单单个域的迭代器
     * @private
     * 
     * @param {esui.InputControl} field
     * @param {Boolean} justCheck
     * @param {Boolean} all
     */
    _validateIterator: function (field, justCheck, all) {
        if (field.isDisabled()) {
            return;
        }
        var me = this,
            originInvalidHandler = field.oninvalid;
        field.oninvalid = function (validity) {
            originInvalidHandler.call(field, validity);
            me.onfieldinvalid(field, validity);
        };
        var v = field.__validate(justCheck);
        field.oninvalid = originInvalidHandler;
        if (!v) {
            this._valid = false;
            if (!all) {
                return false;
            }
        }
    },
    
    
    
    /**
     * 验证控件，仅返回是否验证通过
     * 
     * @public
     * 
     * @param {Boolean} all 是否要验证完全部才停止，默认：false
     * 
     * @return {boolean} 是否验证通过
     */
    checkValidity: function ( all ) {
        return this.__validate( true , all );
    },
    
    /**
     * 验证控件，当值不合法时显示错误信息
     * 
     * @public
     * 
     * @param {Boolean} all 是否要验证完全部才停止，默认：false
     * 
     * @return {boolean} 是否验证通过
     */
    validate: function (all) {
        return this.__validate( false , all );
    },
    
    /**
     * 默认不编码
     * @param {String} value
     * 
     * @return {String}
     */
    dataEncoder: function (value) {return value;},
    
    /**
     * 预填表单值
     * @param {Object} data
     * @param {Object} filterMap 特殊处理过滤器表
     */
    setFormData: function (data, filterMap) {
        this.forEachField(this.setFieldData, this, data, filterMap);
    },
    
    /**
     * 预填每个域的值
     * @param {Object} data
     * @param {Object} filterMap 特殊处理过滤器表
     */
    setFieldData: function (field, data, filterMap) {
        var dataItem = data[field.name];
        
        if (typeof dataItem != 'undefined') {
            var filter;
            if (filterMap && typeof (filter = filterMap[field.name]) == 'function') {
                filter.call(field, data);
            } else {
                if (field instanceof esui.BoxControl) {
                    field.getGroup().selectByValues(dataItem.toString().split(','));
                } else {
                    field.setValue(dataItem);
                }
            }
        }
    },
    
    /**
     * 获取表单中的数据
     * 
     * @return {Object}
     */
    getFormData: function () {
        var data = {};
        this.forEachField(this._getFieldDataIterator, this, data);
        return data;
    },
    
    /**
     * @private
     * 获取每个field数据的迭代器
     * 
     * @param {esui.InputControl} field
     * @param {Object} ret
     */
    _getFieldDataIterator: function (field, ret) {
        if (!field.isDisabled()) {
            var name = field.name;
            if (name) {
                if (!ret[name]) {
                    ret[name] = [];
                }
                if (!(field instanceof esui.BoxControl) || field.isChecked()) {
                    ret[name].push(field.getValue());
                }
            }
        }
    },
    
    /**
     * 获取表单数据的查询字符串
     * 
     * @param {Function} encoder 编码函数
     * 
     * @return {String}
     */
    getQueryString: function (encoder) {
        var data = this.getFormData(),
            query = [];
        
        for (var name in data) {
            var dataItem = data[name];
            for (var i = 0, len = dataItem.length; i < len; i++) {
                var value = typeof encoder == 'function' ? encoder(dataItem[i]) : dataItem[i];
                query.push(name + '=' + value);
            }
        }
        
        return query.join('&');
    },
    
    /**
     * 准备提交表单，处理验证相关逻辑
     */
    readyToSubmit: function () {
        var valid = this.validate();
        if (valid && this.onbeforesubmit() !== false) {
            this.submitForm();
            this.resetFormError();
        }
    },
    
    /**
     * 恢复到验证之前的信息状态
     */
    resetFormError: function () {
        this._valid = true;
        this.forEachField(this._resetValidityIterator, this);
    },


    _resetValidityIterator: function (field) {
        field.hideValidity();
    },

    resetFields: function () {
        this.datasource ? this.setFormData(this.datasource) :
            this.forEachField(this._resetFieldIterator, this);
    },

    _resetFieldIterator: function (field) {
        field.render();
    },

    reset: function () {
        this.resetFields();
        this.resetFormError();
    },
    
    /**
     * 提交表单，处理Ajax相关
     */
    submitForm: function () {
        var me = this,
            form = this.main;
        esui.lib.ajax(form.action, {
            method: form.method,
            data: this.getQueryString(this.dataEncoder),
            onsuccess: this._handlerSubmitSuccess,
            onfailure: this._handlerSubmitFailure
        });
    },
    
    _getHandlerSubmit: function () {
        var me = this;
        return function (ev) {
            if (!me.disabled) {
                me.readyToSubmit();
            }
            
            return false;
        };
    },
    
    _getHandlerSubmitSuccess: function () {
        var me = this;
        return function (xhr, response) {
            me.onsubmitsuccess(xhr, response);
        };
    },
    
    _getHandlerSubmitFailure: function () {
        var me = this;
        return function (xhr) {
            me.onsubmitfailure(xhr);
        };
    },

    _getHandlerReset: function () {
        var me = this;
        return function () {
            if (me.onreset() !== false) {
                me.reset();
            }
            return false;
        };
    },
    
    onfieldinvalid: new Function(),
    
    onbeforesubmit: new Function(),
    onsubmitsuccess: new Function(),
    onsubmitfailure: new Function(),

    onreset: new Function()
};

esui.lib.inherits(esui.AjaxForm, esui.Control);
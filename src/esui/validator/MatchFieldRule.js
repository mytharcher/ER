///import esui.validator.ValidityState;
///import esui.validator.Rule;
///import esui.lib;

/**
 * 与其他域匹配规则
 * 
 * @class
 * @param {Object} options 参数
 */
esui.validator.MatchFieldRule = function( options ) {
    options = options || {};
    options.errorMessage && (this.errorMessage = options.errorMessage);
};

esui.validator.MatchFieldRule.prototype = {
    /**
     * 错误提示信息
     * 
     * @public
     */
    errorMessage : "${title}与${mirrorFieldTitle}不一致",

    /**
     * 获取规则名称
     * 
     * @public
     * @return {string}
     */
    getName: function () {
        return 'matchfield';
    },
    
    /**
     * 验证值是否合法
     * 
     * @public
     * @return {string}
     */
    check: function ( value, control ) {
        var mirror = esui.get(control.mirrorField);
        if (mirror) {
            return value == mirror.getValue();
        }

        return true;
    }
};

esui.lib.inherits( esui.validator.MatchFieldRule, esui.validator.Rule );
esui.validator.Rule.register( 'matchfield', esui.validator.MatchFieldRule );

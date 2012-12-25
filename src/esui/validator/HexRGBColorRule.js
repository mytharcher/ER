///import esui.lib;
///import esui.validator.Rule;


/**
 * 十六进制RGB颜色串验证规则
 * 
 * @class
 * @param {Object} options 参数
 */
esui.validator.HexRGBColorRule = function( options ) {
    options = options || {};
    options.errorMessage && (this.errorMessage = options.errorMessage);
};

esui.validator.HexRGBColorRule.prototype = {
    /**
     * 错误提示信息
     * 
     * @public
     */
    errorMessage : "${title}不是正确的颜色格式",

    /**
     * 获取规则名称
     * 
     * @public
     * @return {string}
     */
    getName: function () {
        return 'hexRGBColor';
    },
    
    /**
     * 验证值是否合法
     * 
     * @public
     * @return {string}
     */
    check: function ( value ) {
        return (/^[\da-f]{6}$/i).test(value);
    }
};

esui.lib.inherits( esui.validator.HexRGBColorRule, esui.validator.Rule );
esui.validator.Rule.register( 'hexRGBColor', esui.validator.HexRGBColorRule );

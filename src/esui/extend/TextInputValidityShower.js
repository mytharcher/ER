///import baidu;
///import esui.TextInput;

/**
 * @class esui.TextInputValidityShower
 * 提供给所有TextInput是否根据配置进行失焦验证的操作
 */
esui.TextInputValidityShower = (function (originBlur, originChange) {
    function validateTrigger ( ev ) {
        var ev = ev || window.event;
        var me = this;
        var value = me.main.value;
        me.setValue( me.trim ? esui.lib.trim(value) : value );
        if (me.validateTrigger && (',' + me.validateTrigger.toString() + ',').indexOf(
            ',' + ev.type + ','
            ) >= 0) {
            me.validate();
        }
    }

    return {
        _getBlurHandler: function () {
            var me = this;
            return function ( ev ) {
                var ev = ev || window.event;
                validateTrigger.call( me, ev );
                originBlur.call( me )();
            };
        },

        _getBlurChangeHandler: function () {
            var me = this;
            return function ( ev ) {
                var ev = ev || window.event;
                validateTrigger.call( me, ev );
                originChange.call( me )( ev );
            };
        }
    };
})(esui.TextInput.prototype._getBlurHandler, esui.TextInput.prototype._getBlurChangeHandler);

esui.lib.extend(esui.TextInput.prototype, esui.TextInputValidityShower);
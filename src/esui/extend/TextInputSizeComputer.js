///import baidu;
///import esui.TextInput;

/**
 * @class esui.TextInputValidityShower
 * 提供给所有TextInput计算已输入文字可视高宽的函数
 */
esui.TextInputSizeComputer = {
	/**
	 * @param {Number} width (optional)是否限制宽度
	 * 
	 * @return {Object} 返回包含width和height属性的对象（包含单位）
	 */
	computeFontSize: function (width) {
		var font = js.dom.Style.get(this.main);
		var temp = document.createElement('div');
		js.dom.Style.set(temp, {
			position: 'absolute',
			top: 0,
			left: 0,
			visibility: 'hidden',
			'font-size': font.fontSize,
			'font-family': font.fontFamily,
			'font-weight': font.fontWeight,
			'width': width ? width + 'px' : 'auto',
			'padding-top': font.paddingTop,
			'padding-right': font.paddingRight,
			'padding-bottom': font.paddingBottom,
			'padding-left': font.paddingLeft
		});
		temp.innerHTML = this.main.value;
		document.body.appendChild(temp);
		var size = {width: temp.offsetWidth + 'px', height: temp.offsetHeight + 'px'};
		document.body.removeChild(temp);
		return size;
	},
	
	/**
	 * 自动设置当前文本框尺寸
	 */
	setAutoSize: function (width) {
		var size = this.computeFontSize(this.main, width);
		js.dom.Style.set(this.main, size);
	},
	
	_getChangeHandler: (function (origin) {
		return function () {
			var me = this;
			var oHandler = origin.call(me);
			return function ( ev ) {
				if (me.autoResize && me.getValue()) {
					me.setAutoSize(me.autoResizeWidth);
				}
				oHandler( ev );
			};
		};
	})(esui.TextInput.prototype._getChangeHandler),
	
	setValue: (function (origin) {
		return function (value) {
			origin.call(this, value);
			if (this.getValue() && this.autoResize) {
				this.setAutoSize(this.autoResizeWidth);
			}
		};
	})(esui.TextInput.prototype.setValue)
};

js.util.Class.copy(esui.TextInputSizeComputer, esui.TextInput.prototype);
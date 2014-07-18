esui.Notice = function (options) {
	esui.Control.call(this, options);
	this.status = 'normal';
	this.interval = 0;
	this.__initOption('lastTime', null, 'LAST_TIME');
};

esui.Notice.prototype = {
	_type: 'notice',

	constructor: function (options) {
		esui.Control.call(this, options);
		this.status = 'normal';
		this.interval = 0;
		this.__initOption('lastTime', null, 'LAST_TIME');
	},

	render: function () {
		var rendered = this._isRendered;

		esui.Control.prototype.render.call(this);

		if ( !rendered ) {
			this.main.onclick = this.hide.bind(this);
		}
	},

	show: function (message, status) {
		clearTimeout(this.interval);
		this.main.innerHTML = message;
		esui.lib.removeClass(this.main, this.status);
		esui.lib.addClass(this.main, this.status = status);
		esui.lib.addClass(this.main, this.__getClass('active'));
		this.main.style.left = ((document.body.offsetWidth - this.main.offsetWidth) / 2) + 'px';
		if (this.lastTime > 0) {
			this.interval = setTimeout(this.hide.bind(this), this.lastTime);
		}
	},

	hide: function () {
		clearTimeout(this.interval);

		esui.lib.removeClass(this.main, this.status);
		esui.lib.removeClass(this.main, this.__getClass('active'));
	}
};

esui.lib.inherits(esui.Notice, esui.Control);

esui.Notice.LAST_TIME = 3000;

esui.util.register('Notice', esui.Notice);

esui.Notice.show = function (message, status) {
	var me = esui.Notice;
	if (!me.instance) {
		me.instance = new me();
		me.instance.appendTo();
	}
	me.instance.show(message, status);
};

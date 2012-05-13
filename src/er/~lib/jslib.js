
///import js.util.Class;

er.lib.inherits = js.util.Class.inherit;

er.lib.extend = js.util.Class.mix;

er.lib.clone = js.util.Class.clone;



///import js.dom.Stage.loadScript;

er.lib.loadScript = function (url, onload) {
	js.dom.Stage.loadScript(url, {onload: onload});
};




///import js.client.Browser;

er.lib.firefox = js.Browser.Firefox;

er.lib.ie = js.client.Browser.IE;



///import js.dom.Stage.get;

er.lib.g = js.dom.Stage.get;



///import js.text.Template;

er.lib.format = js.text.Template.format;



///import js.text.Encoder.encodeHTML;

er.lib.encodeHTML = js.text.Encoder.encodeHTML;



///import js.net.Ajax;

er.lib.ajax = function (url, options) {
	options.url = url;
	return js.net.Ajax.request(options);
};

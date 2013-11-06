///import er.lib;



///import baidu.lang.inherits;

er.lib.inherits = baidu.lang.inherits;



///import baidu.sio.callByBrowser;

er.lib.loadScript = baidu.sio.callByBrowser;



///import baidu.object.extend;

er.lib.extend = baidu.object.extend;



///import baidu.browser.firefox;

er.lib.firefox = baidu.browser.firefox;



///import baidu.brower.ie;

er.lib.ie = baidu.browser.ie;



///import baidu.dom.g;

er.lib.g = baidu.dom.g;



///import baidu.string.trim;

er.lib.trim = baidu.string.trim;



///import baidu.string.format;

er.lib.format = baidu.string.format;



///import baidu.object.clone;

er.lib.clone = baidu.object.clone;



///import baidu.string.encodeHTML;

er.lib.encodeHTML = baidu.string.encodeHTML;



///import baidu.ajax.request;

er.lib.ajax = baidu.ajax.request;



er.lib.namespace = function (nsStr, base, object, undef) {
	var isCreate = typeof object != 'undefined';
	
	var ns = window;
	
	if (nsStr) {
		switch(typeof(base)) {
		case 'object':
			ns = base;
			break;
		case 'string':
			ns = arguments.callee(base);
			break;
//				case 'undefined':
//					return (new Function('return ' + nsStr + ';'))();
		default:
			break;
		}
		if (ns) {
			nsStr = nsStr.split('.');
			for (var i = 0, l = nsStr.length; i < l; i++) {
				var word = nsStr[i];
				if (!ns[word]) {
					if (isCreate) {
						ns[word] = i < l - 1 ? {} : object;
					} else {
						ns = undef;
						break;
					}
				}
				ns = ns[word];
			}
		}
	} else {
		ns = undef;
	}
	
	return ns;
};
///import esui.lib;

///import js.util.Class;

esui.lib.inherits = js.util.Class.inherit;

esui.lib.extend = function (target, source) {
	return js.util.Class.mix(target, source, true);
};

esui.lib.clone = js.util.Class.clone;



///import js.dom.Stage.loadScript;

esui.lib.loadScript = function (url, onload) {
	js.dom.Stage.loadScript(url, {onload: onload});
};




///import js.client.Browser;

esui.lib.firefox = js.client.Browser.Firefox;

esui.lib.ie = js.client.Browser.IE;



///import js.dom.Stage.get;

esui.lib.g = js.dom.Stage.get;



///import js.text.Template;

esui.lib.format = js.text.Template.format;



///import js.text.Encoder.encodeHTML;

esui.lib.encodeHTML = js.text.Encoder.encodeHTML;



///import js.net.Ajax;

esui.lib.ajax = function (url, options) {
	options.url = url;
	return js.net.Ajax.request(options);
};



///import js.dom.Attribute;

esui.lib.setAttribute = js.dom.Attribute.set;



///import js.dom.Operation;

esui.lib.insertAfter = js.dom.Operation.after;

esui.lib.insertBefore = js.dom.Operation.before;



///import js.client.Features.~arrayIndexOf;

esui.lib.inArray = function (array, item) {
	return array.indexOf(item) > -1;
};



esui.lib.formatDate = function (source, pattern) {
	if ('string' != typeof pattern) {
		return source.toString();
	}

	function replacer(patternPart, result) {
		pattern = pattern.replace(patternPart, result);
	}
	
	var pad     = esui.lib.padNumber,
		year    = source.getFullYear(),
		month   = source.getMonth() + 1,
		date2   = source.getDate(),
		hours   = source.getHours(),
		minutes = source.getMinutes(),
		seconds = source.getSeconds();

	replacer(/yyyy/g, pad(year, 4));
	replacer(/yy/g, pad(parseInt(year.toString().slice(2), 10), 2));
	replacer(/MM/g, pad(month, 2));
	replacer(/M/g, month);
	replacer(/dd/g, pad(date2, 2));
	replacer(/d/g, date2);

	replacer(/HH/g, pad(hours, 2));
	replacer(/H/g, hours);
	replacer(/hh/g, pad(hours % 12, 2));
	replacer(/h/g, hours % 12);
	replacer(/mm/g, pad(minutes, 2));
	replacer(/m/g, minutes);
	replacer(/ss/g, pad(seconds, 2));
	replacer(/s/g, seconds);

	return pattern;
};



esui.lib.padNumber = function (source, length) {
	var pre = "",
		negative = (source < 0),
		string = String(Math.abs(source));

	if (string.length < length) {
		pre = (new Array(length - string.length + 1)).join('0');
	}

	return (negative ?  "-" : "") + pre + string;
};



///import js.dom.BoxModel;

esui.lib.getPosition = function (elem) {
    return js.dom.BoxModel.getPosition(elem, refer || esui.config.viewContextRoot || document.body);
};



esui.lib.getPageWidth = function () {
	var doc = document,
		body = doc.body,
		html = doc.documentElement,
		client = doc.compatMode == 'BackCompat' ? body : doc.documentElement;

	return Math.max(html.scrollWidth, body.scrollWidth, client.clientWidth);
};



///import js.dom.ClassName;

esui.lib.addClass = js.dom.ClassName.add;

esui.lib.removeClass = js.dom.ClassName.remove;

esui.lib.hasClass = js.dom.ClassName.has;



///import js.dom.Event.add;

esui.lib.on = js.dom.Event.add;

esui.lib.un = js.dom.Event.remove;



///import js.dom.Drag;

esui.lib.draggable = js.dom.Drag.attach;



///import js.dom.Stage.getDocumentElement;

esui.lib.getPageViewHeight = function () {
	return js.dom.Stage.getDocumentElement().clientHeight;
};

esui.lib.getPageViewWidth = function () {
	return js.dom.Stage.getDocumentElement().clientWidth;
};



esui.lib.getPageScrollTop = function (refer) {
	var d = document;
	return refer ? refer.scrollTop :
		window.pageYOffset || d.documentElement.scrollTop || d.body.scrollTop;
};

esui.lib.getPageScrollLeft = function (refer) {
	var d = document;
	return refer ? refer.scrollLeft :
		window.pageXOffset || d.documentElement.scrollLeft || d.body.scrollLeft;
};



///import js.dom.Relation;

esui.lib.firstChild = js.dom.Relation.firstChild;

esui.lib.nextSibling = js.dom.Relation.next;

esui.lib.elementContains = js.dom.Relation.contains;



///import js.dom.MouseTracker;

esui.lib.getMousePosition = function () {
	var Tracker = js.dom.MouseTracker;
	return {
		x : esui.lib.getPageScrollLeft() + Tracker.x,
		y : esui.lib.getPageScrollTop() + Tracker.y
	};
};



esui.lib.isWebkit = /webkit/i.test(navigator.userAgent);



///import js.dom.Style;

esui.lib.getStyle = js.dom.Style.get;



esui.lib.preventDefaultEvent = function (ev) {
	ev.preventDefault ? ev.preventDefault : (ev.returnValue = false);
};



///import js.client.Features.~stringTrim;

esui.lib.trim = function (str) {
	return str.trim();
};



///import js.dom.Selector;

esui.lib.query = js.dom.Selector.queryAll;

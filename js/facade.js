var Facade = {
	create : function (core, module_selector){

		var CONTAINER = core.dom.query('#' + module_selector);
		return {
			find : function (selector, context, in_context) {
				if (in_context) {
					return core.dom.find(selector, context);
				}
				if (!selector) {
					return CONTAINER;
				}
				return CONTAINER.query(selector, context);
			},
			find_element : function (selector, context) {
				return core.dom.find(selector, context);
			},
			attr : function (element,attrs) {
				return core.dom.apply_attrs(element, attrs);
			},
			add_event : function (element, type, fn) {
				return core.dom.bind(element, type, fn);
			},
			remove_event : function (element, type, fn) {
				return core.dom.unbind(element, type, fn);
			},
			notify : function (evt) {
				if (core.is_obj(evt) && evt.type) {
                    core.trigger_event(evt);
                }   
			},
			listen : function (evts) {
				if (core.is_obj(evts)) {
					core.register_events(evts, module_selector);
				}
			},
			ignore : function (evt) {
				if (core.is_obj(evts)) {
					core.remove_events(evts, module_selector);
				}
			},
			append : function (element, content) {
				return core.dom.append(element, content);
			},
			prepend : function (element, content) {
				return core.dom.prepend(element, content);
			},
			remove : function (element, selector) {
				return core.dom.remove(element, selector);
			},
			data : function (element, key, value) {
				return core.dom.data(element, key, value);
			},
			mouse_position : function (element, event) {
				return core.dom.mouse_position(element, event);
			},
			animate : function () {
				return core.dom.animate(arguments);
			},
			parent : function (element) {
				return core.dom.parent(element);
			},
			closest : function (element, selector, context) {
				return core.dom.closest(element, selector, context);
			},
			add_class : function (element, str) {
				return core.dom.add_class(element, str);
			},
			remove_class : function (element, str) {
				return core.dom.remove_class(element, str);
			},
			css : function (element, options) {
				return core.dom.css(element, options);
			},
			show : function (element) {
				return core.dom.show(element);
			},
			hide : function (element) {
				return core.dom.hide(element);
			},
			html : function (element) {
				return core.dom.html(element);
			},
			text : function (element, data) {
				return core.dom.text(element, data);
			},
			val : function (element, data) {
				return core.dom.val(element, data);
			},
			each : function (collection, fn) {
				return core.dom.each(collection, fn);
			},
			draggable : function () {
				var args = Array.prototype.slice.apply(arguments);
				return core.dom.ui.draggable.apply(this, args);
			},
			resizable : function () {
				var args = Array.prototype.slice.apply(arguments);
				return core.dom.ui.resizable.apply(this, args);
			},
			create_element : function (element, config) {
                var i, child, text;
                el = core.dom.create(element);

                if (config) {
                    if (config.children && core.is_arr(config.children)) {
                        i = 0;
                        while(child = config.children[i]) {
                            el.appendChild(child);
                            i++;
                        }
                        delete config.children;
                    }
                    if (config.text) {
                        el.appendChild(document.createTextNode(config.text));
                        // delete consfig.text;
                    }
                    this.attr(el, config);
                }
                return el;
            },
            template : function (name, data) {
            	return core.template.get(name, data);
            },
            is_empty_obj : function (obj) {
            	return core.is_empty_obj(obj);
            }
		};
	}
}
var Facade = {
	create : function (core, module_selector){

		var CONTAINER = core.dom.query('#' + module_selector);
		return {
			find : function (selector, context) {
				if (!selector) {
					return CONTAINER;
				}
				return CONTAINER.query(selector, context);
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
			animate : function () {
				return core.dom.animate(arguments);
			},
			parent : function (element) {
				return core.dom.parent(element);
			},
			closest : function (element, selector, context) {
				return core.dom.closest(element, selector, context);
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
			draggable : function (element, options) {
				return core.dom.draggable(element, options); //Is the return value ok?
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
                        delete config.text;
                    }
                    core.dom.apply_attrs(el, config);
                }
                return el;
            },
            get_template : function (name, data) {
            	return core.template.get(name, data);
            },
		};
	}
}
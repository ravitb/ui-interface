var Facade = {
	create : function (core, module_selector){

		var CONTAINER = core.external.query('#' + module_selector);
		return {
			find : function (selector) {
				return CONTAINER.query(selector);
			},
			add_event : function (element, type, fn) {
				return core.external.bind(element, type, fn);
			},
			remove_event : function (element, type, fn) {
				return core.external.unbind(element, type, fn);
			},
			notify : function (evt) {
				if (core.is_obj(evt) && evt.type) {
                    core.trigger_event(evt);
                }   
			},
			listen : function (evts) {
				if (core.is_obj(evts)) {
					core.register_events (evts, module_selector);
				}
			},
			ignore : function (evt) {
				if (core.is_obj(evts)) {
					core.remove_events(evts, module_selector);
				}
			},
			animate : function () {
				return core.external.animate(arguments);
			},
			parent : function (element) {
				return core.external.parent(element);
			},
			show : function (element) {
				return core.external.show(element);
			},
			hide : function (element) {
				return core.external.hide(element);
			},
			html : function (element) {
				return core.external.html(element);
			},
			text : function (element, data) {
				return core.external.text(element, data);
			},
			val : function (element, data) {
				console.log('val', element, data, '*');
				return core.external.val(element, data);
			},
			each : function (collection, fn) {
				return core.external.each(collection, fn);
			},
			draggable : function (element, options) {
				return core.external.draggable(element, options); //Is the return value ok?
			},
			create_element : function (element, config) {
                var i, child, text;
                el = core.external.create(element);
                
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
                    core.external.apply_attrs(el, config);
                }
                return el;
            }
		};
	}
}
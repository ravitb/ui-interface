var Facade = {
	create : function (core, module_selector){
		var CONTAINER = core.dom.query('#' + module_selector);
		return {
			find : function (selector) {
				return CONTAINER.query(selector);
			},
			add_event : function (element, type, fn) {
				core.dom.bind(element, type, fn);
			},
			remove_event : function (element, type, fn) {
				core.dom.unbind(element, type, fn);
			},
			notify : function (evt) {
				if (core.is_obj(evt) && evt.type) {
                    core.triggerEvent(evt);
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
			// show : function () {

			// },
			// hide : function () {

			// },
			// css : function () {

			// },
			create_element : function (el, config) {
                var i, child, text;
                el = core.dom.create(el);
                
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
            }
		};
	}
}
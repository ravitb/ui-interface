var Facade = {
	create : function (core, module_selector){

		var CONTAINER = core.external.query('#' + module_selector);
		return {
			find : function (selector) {
				return CONTAINER.query(selector);
			},
			add_event : function (element, type, fn) {
				core.external.bind(element, type, fn);
			},
			remove_event : function (element, type, fn) {
				core.external.unbind(element, type, fn);
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
				console.log('animate', arguments)
				var obj = {},
					new_obj = core.external.extend_args(obj,{c:3,d:4}, {m:5});
				console.log('test', new_obj);
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
			text : function (element) {
				return core.external.text(element);
			},
			each : function (collection, fn) {
				core.external.each(collection, fn);
			},
			draggable : function () {
				var obj  = core.external.extend({}, arguments);
				console.log('facade draggable', obj);
				return core.external.draggable(obj); //Is this leagal???
			},
			// css : function () {

			// },
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
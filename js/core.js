//Microsoft Virtual WiFi Miniport Adapter (Device Manager -> View -> Show hidden devices); init_value = enabled.
var CORE = (function (){
	var moduleData = {},
		to_string = function (obj) { return Object.prototype.toString.call(obj);};
		// debug = true;

		return {
            create_module : function (moduleID, creator) {
                var temp;
                if (typeof moduleID === 'string' && typeof creator === 'function') {
                    temp = creator(Facade.create(this, moduleID));
                    if (temp.init && typeof temp.init === 'function' && temp.destroy && typeof temp.destroy === 'function') {
                        temp = null;
                        moduleData[moduleID] = {
                            create : creator,
                            instance : null
                        };
                    } else {
                        console.log(1, moduleID, temp.destroy, "Module ", moduleID, "Registration : FAILED. instance has no init or destory functions");
                    }
                } else {
                    console.log(1, "Module '",  moduleID, "' Registration : FAILED. one or more arguments are of incorrect type");    
                }
            },
            start : function (moduleID) {
                var mod = moduleData[moduleID];
                if (mod) {
                    mod.instance = mod.create(Facade.create(this, moduleID));
                    mod.instance.init();
                }
            },
            start_all : function () {
                var moduleID;
                for (moduleID in moduleData) {
                    if (moduleData.hasOwnProperty(moduleID)) {
                        this.start(moduleID);
                    }
                }
            },
            stop : function (moduleID) {
                var data;
                if (data = moduleData[moduleID] && data.instance) {
                    data.instance.destroy();
                    data.instance = null;
                } else {
                    console.log(1, "Stop Module '", moduleID, "': FAILED : module does not exist or has not been started");    
                }
            },
            stop_all : function () {
                var moduleID;
                for (moduleID in moduleData) {
                    if (moduleData.hasOwnProperty(moduleID)) {
                        this.stop(moduleID);
                    }
                }
            },
            register_events : function (evts, module) {
                if (this.is_obj(evts) && module) {
                    if (moduleData[module]) {
                        moduleData[module].events = evts;
                    } else {
                        console.log(1, "");
                    }
                } else {
                    console.log(1, "");
                }
            },
            trigger_event : function (evt) {
                var module;
                for (module in moduleData) {
                    if (moduleData.hasOwnProperty(module)){
                        module = moduleData[module];
                        if (module.events && module.events[evt.type]) {
                            module.events[evt.type](evt.data);
                        }
                    }
                }
            },
            remove_events : function (evts, module) {
                if (this.is_obj(evts) && module && (module = moduleData[module]) && module.events) {
                    delete module.events;
                }
            },
            external : {
                query : function (selector, context) {
                    var resault = {},
                        that = this,
                        jqElement, 
                        i = 0;
                    if (context && context.find) {
                        jqElement = context.find(selector);
                    } else {
                        jqElement = jQuery(selector);
                    }

                    resault = jqElement.get();
                    resault.length = jqElement.length;
                    resault.query = function (sel) {
                        return that.query(sel, jqElement);
                    }
                    return resault;
                },
                bind : function (element, evt, fn) {
                    if (element && evt) {
                        if (typeof evt === 'function') {
                            fn = evt;
                            evt = 'click';
                        }
                        jQuery(element).bind(evt, fn);
                    } else {
                        console.log(2, "Dom Bind FAILED : one of the params is missing");    
                    }
                },
                unbind : function (element, evt, fn) {
                    if (element && evt) {
                        if (typeof evt === 'function') {
                            fn = evt;
                            evt = 'click';
                        }
                        jQuery(element).unbind(evt, fn);
                    } else {
                        console.log(2, "Dom Unbind FAILED : one of the params is missing");   
                    }
                },
                extend_args : function () {  //Covert args to obj
                    var obj = arguments[0] || {},
                        args = [].slice.apply(arguments);
                    console.log('recursia', args);
                    if (args.length <= 2) {
                        obj = jQuery.extend(obj, args[1]);
                        console.log('length <= 2',obj);
                        return obj;
                    }

                    for (var i = 1, l = args.length; i < l; i++) {
                        console.log('args ', args[i]);
                        this.extend_args(obj, args[i]);
                        // jQuery.extend(obj, arguments[i]);
                        // console.log('obj',obj, arguments[i]);
                    }
                    // return obj;
                },
                extend : function () {
                    return jQuery.extend(arguments);
                },
                create : function (element) {
                    // return jQuery(el);
                    return document.createElement(element);
                },
                apply_attrs : function (element, attrs) {
                    return jQuery(element).attr(attrs);
                },
                animate : function (element, options, fn) {
                    if (element && options) {
                        if (typeof options === 'function') {
                            options = {};
                            fn = options;
                        }
                        return jQuery(element).animate(options, fn);
                    }
                },
                parent : function (element) {
                    return jQuery(element).parent();
                },
                show : function (element) {
                    return jQuery(element).show();
                },
                hide : function (element) {
                    return jQuery(element).hide();
                },
                html : function (element) {
                    return jQuery(element).html(); 
                },
                text : function(element) {
                    return jQuery(element).text();
                },
                each : function (collection, fn) {
                    return jQuery.each(collection, fn);
                },
                draggable : function () {
                    console.log('draggable', arguments);
                    // if (jQuery().drags) {
                    //     return jQuery(element).drags(options);
                    // }
                }
            },
            is_arr : function (arr) {
                return jQuery.isArray(arr);  
            },
            is_obj : function (obj) {
                return jQuery.isPlainObject(obj);
            },
            shift_args : function () {
                return Array.prototype.shift.call(arguments);
            },
            slice : function (args, from, to) { //return an array
                return Array.prototype.slice.apply(arguments, from, to);//***
            },
            slice_args : function (args, from, to) { //return object

            }
        }
})();   
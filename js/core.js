//Microsoft Virtual WiFi Miniport Adapter (Device Manager -> View -> Show hidden devices); init_value = enabled.
var CORE = (function ($, hb){
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
                        console.log(1, "Event Registration'", moduleID, "': FAILED : module not founs");
                    }
                } else {
                    console.log(1, "Event Registration'", moduleID, "': FAILED");
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
            dom : {
                query : function (selector, context) {
                    var resault = {},
                        that = this,
                        jqElement;

                    if (context && context.find) {
                        jqElement = context.find(selector);
                    } else {
                        jqElement = $(selector);
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
                        $(element).bind(evt, fn);
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
                        $(element).unbind(evt, fn);
                    } else {
                        console.log(2, "Dom Unbind FAILED : one of the params is missing");   
                    }
                },
                extend_obj : function (init_obj, args) {  //Covert args to obj
                    var obj = init_obj || {};

                    for (var i = 0, l = args.length; i < l; i++) {
                        // if (typeof args[i] !== 'object') {
                        //     args['' + i] = args[i];
                        // }
                        obj = $.extend(obj, args[i]);
                    }
                    return obj;
                },
                extend : function () {
                    $.extend(arguments);
                    return arguments;
                },
                create : function (element) {
                    // return $(el);
                    return document.createElement(element);
                },
                find : function (selector, context) {
                    return $(context).find(selector);
                },
                apply_attrs : function (element, attrs) {
                    return $(element).attr(attrs);
                },
                append : function (element, content) {
                    return $(element).append(content);
                },
                prepend : function (element, content) {
                    return $(element).prepend(content);
                },
                remove : function (element, selector) {
                    return $(element).remove(selector);
                },
                data : function (element, key, value) {
                    if (!value) {
                        return $(element).data(key);
                    } else {
                        return $(element).data(key, value);
                    }
                },
                mouse_position : function (element, event) {
                    return {
                        left : event.pageX - $(element).offset().left,
                        top : event.pageY - $(element).offset().top,
                    }
                },
                animate : function (element, properties, duration, easing, fn) {
                    var args = arguments[0];
                    return $(args[0]).animate(args[1], args[2], args[3], args[4]);
                },
                parent : function (element) {
                    return $(element).parent();
                },
                closest : function (element, selector, context) {
                    return $(element).closest(selector, context);
                },
                add_class : function (element, str) {
                    $(element).addClass(str);
                },
                remove_class : function (element, str) {
                    $(element).removeClass(str);
                },
                css : function (element, options) {
                    return $(element).css(options);
                },
                show : function (element) {
                    return $(element).show();
                },
                hide : function (element) {
                    return $(element).hide();
                },
                html : function (element) {
                    return $(element).html(); 
                },
                text : function(element, data) {
                    if (typeof data === 'undefined') {
                        return $(element).text();
                    } else {
                        return $(element).text(data);
                    }
                },
                val : function(element, data) {
                    if (typeof data === 'undefined') {
                        return $(element).val();
                    } else {
                        return $(element).val(data);
                    }
                },
                each : function (collection, fn) {
                    return $.each(collection, fn);
                },
                shift_args : function () {
                    Array.prototype.shift.call(arguments);
                    return arguments;
                },
                slice_args : function (args, from, to) { //return an array
                    Array.prototype.slice.apply(arguments, from, to);//***
                    return arguments;
                },
                ui : {
                    // draggable : function (element, options, fn) {
                    //     if (!!$().drags) {
                    //         return $(element).drags(options, fn);
                    //     } else {
                    //         return $(element);
                    //     }
                    // },
                    draggable : function (element, options) {
                        var args = Array.prototype.slice.apply(arguments);
                        return $(args[0]).draggable(args.slice(1)[0]);
                    },
                    resizable : function (element, options) {
                        var args = Array.prototype.slice.apply(arguments);
                        return $(args[0]).resizable(args.slice(1)[0]);
                    }
                },
            },
            template : {
                get : function (name, data) {
                    var source = $(name).html(),
                        template = hb.compile(source);


                    return template(data);
                }
            },
            is_arr : function (arr) {
                return $.isArray(arr);  
            },
            is_obj : function (obj) {
                return $.isPlainObject(obj);
            },
            is_empty_obj :  function (obj) {
                console.log('is_empty_obj', obj);
                for (var key in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, key)) {
                        return false;
                    }
                }
                return true;
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
})(jQuery, Handlebars);
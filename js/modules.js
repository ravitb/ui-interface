
CORE.create_module('header', function (facade) {
    
    return {
        top_menu : undefined,
        init : function () {
            var that = this;

            this.top_menu = facade.find('.menu li');
            facade.each(this.top_menu, function(index, value){
                facade.add_event(value, 'click', function() {
                    switch (facade.html(value).toLowerCase()) {
                        case 'new' : 
                            console.log('new?');
                            facade.notify({
                                type : 'create-canvas'
                            });
                            break;
                        default : console.log('Unable to complete the selected action');
                    }
                });
            });
        }, 
        destroy : function () {
            this.canvas.destroy();
            facade.each(top_menu, function(key, value){
                facade.remove_event(value, 'click', function() {
                    switch (facade.text(value).toLowerCase()) {
                        case 'new' : 
                            facade.notify({
                                type : 'create-canvas'
                            });
                            break;
                        default : console.log('Unable to complete the selected action');
                    }
                });
            });
            facade.ignore(['create-canvas']);
        }
    }
});

CORE.create_module('init-canvas', function (facade) {

    return {
        interval : 100,
        hide : facade.find('.remove'),
        input : facade.find('input'),
        dialog : facade.find('.wrapper'),

        init : function () {
            var that = this;
            facade.add_event(this.hide, 'click', function() {
                that.remove(that.dialog);
            });
            
            facade.each(this.input, function(index, value){
                switch (value.name) {
                    case 'reset' : 
                        facade.add_event(value, 'click', function() {
                            that.reset();
                        });
                        break;
                    case 'submit' :
                        facade.add_event(value, 'click', function(e) {
                            e.preventDefault();
                            that.submit();
                        });
                        break;
                    // default :   console.log('Unable to complete the selected action');
                }
            });
            facade.listen({
                'create-canvas' : function(opt) {
                    that.create(opt);
                }
            });
            this.create();
        },
        destroy : function () {
            var that = this;
            facade.remove_event(this.hide, 'click', function() {
                that.remove(that.dialog);
            });
            
            facade.each(this.input, function(index, value){
                switch (value.name) {
                    case 'reset' : 
                        facade.remove_event(value, 'click', function() {
                            that.reset();
                        });
                        break;
                    case 'submit' :
                        facade.remove_event(value, 'click', function(e) {
                            e.preventDefault();
                            that.submit();
                        });
                        break;
                    // default :   console.log('Unable to complete the selected action');
                }
            });
        },
        create : function () {
            var dialog = facade.find('.wrapper');

            facade.draggable(dialog, {handle : 'header', cursor : 'crosshair'});
            facade.show(this.dialog);
            facade.animate(this.dialog, {opacity: '1'}, this.interval);
        },
        remove : function (target) {
            facade.animate(target, {opacity: '0'}, this.interval, function() {
                facade.hide(target);
            });
        },
        reset : function () {            
            facade.val(this.input.slice(0,3), '');
        },
        submit : function () {  
            var res = {
                        css : {
                            'width' : this.input[1].value,
                            'height' : this.input[2].value,
                            'background-color' : this.input[3].value
                        },
                        name : this.input[0].value  
                    } 

            facade.notify({
                 type : 'create_canvas',
                 data :res
             });
            this.remove(this.dialog);
        }
    }
});


CORE.create_module('canvas-container', function(facade) {

    return {
        sheets : {
            data : [],
            push_layer : function (sheet) {
                var id = this.data.length;
                this.data.push(sheet);
                facade.data(sheet, {'layer' : id});
                this.layer_activation();
                return id;
            },
            pop_layer : function () {
                var sheet = this.data.pop();
                facade.data(sheet, {'layer' : 'undefined'});
                this.layer_activation();
            },
            cut_layer : function (pos) {
                // return this.data.splice(pos, 1);  
                var new_arr = [];
                this.iterate( function (sheet, layer) {
                    if (layer !== pos) {
                        facade.data(sheet, {'layer' : new_arr.length})
                        new_arr.push(sheet);
                    } 
                });  
                delete this.data;
                this.data = new_arr;
                this.layer_activation();
            },
            layer_activation : function () {
                var that = this;
                this.iterate( function(sheet, layer) {
                    if (layer === that.data.length - 1) {
                        facade.add_class(sheet, 'active');
                    } else {
                        facade.remove_class(sheet, 'active');
                    }
                });
            },
            indexing : function () {
                this.iterate( function (sheet, layer) {
                    facade.data(sheet, {'layer' : layer});
                });
            },
            iterate : function (fn) {
                for (var i = 0, l = this.data.length; i < l; i++) {
                    fn(this.data[i], i);
                };
            },
            layer_up : function (sheet) {
                var layer = facade.data(sheet, 'layer'),
                    that = this;
        
                if (layer < this.data.length - 1) {
                    if (typeof layer === 'number') {
                        this.cut_layer(layer);
                    } 
                    this.push_layer(sheet);
                    this.indexing();
                }
                this.layer_activation();
            },
            get_title : function (sheet) { //For debug purposes
                var html = facade.html(sheet),
                    start = html.substring(html.indexOf('>') + 1),
                    end = start.substring(0, start.indexOf('<'));
                    return  end.replace(/\s+/g, ' ');
            },
            remove : function (sheet) {
                var top = this.layer_up(sheet);
                this.pop_layer();
                this.layer_activation();
            }
        },
        interval : 200,
        z_index : 10,
        tool : '',
        tool_data : {},
        init : function () {
            var that = this;
            facade.listen({
                'create_canvas' : function (opt) {
                    that.create(opt);
                },
                'tool-selected' : function (opt) {
                    that.tool = opt.id;
                },
                'create-element' : function (opt) {
                    that.tool_data = opt;
                }
            });
        },
        destroy : function () {
            var delete_btn;
            for (i = 0, l = sheets.data.length; i < l; i++) {
                delete_btn = facade.find('header .remove', sheet[i]);
                facade.remove_event(delete_btn, 'click', this.remove(sheet));
            }
            facade.ignore(['create_canvas']);
        },
        create : function (opt) {
            var that = this,
                container = facade.find(),
                canvas = this.template(container, opt),
                header = facade.find_element('header', canvas),
                remove = facade.find_element('header .remove', canvas),
                minmax = facade.find_element('header .min-max', canvas),
                content = facade.find_element('.content', canvas),
                info = facade.find_element('.info', content);
                width = facade.find_element('.width', info);
                height = facade.find_element('.height', info);
                element = {
                    container : container,
                    canvas : canvas,
                    header : header,
                    remove : remove,
                    minmax : minmax,
                    content :content,
                    info : info,
                    width : width,
                    height : height
                }
            this.resize_canvas(element, {width : opt.css.width, height : opt.css.height});
            facade.prepend(element.container, element.canvas);
            this.reorder(element.canvas);
            console.log('create',element);

            // console.log('z-index', facade.css(collection, 'z-index'));
            facade.add_event(element.remove, 'click', function(e) {
                that.remove(e);
            });
            
            facade.add_event(element.minmax, 'click', function(e) {
                that.toggleMinMax(element);
            });

            facade.add_event(element.content, 'click', function(e){
                that.reorder(element.canvas);
                console.log('no new element', (e.target === e.currentTarget), that.tool_data === {});
                if (e.target === e.currentTarget && that.tool_data !== {}) {
                    position = facade.mouse_position(element.content, e);
                    if (!facade.is_empty_obj(that.tool_data)) {
                        that.add_element(element.content, position);
                    } else {
                        console.log('Please select a tool first.');
                    }
                }
                return false;
            });

            facade.add_event(element.info, 'click', function(e){
                that.edit_info(element);
                return false;
            });
            
            facade.draggable(element.canvas, {
                opacity : 0.7,
                handle : 'header', 
                cursor : 'crosshair', 
                stack : '.canvas',
                stop : function(e, ui) {
                    var top = facade.draggable.apply(this, element.canvas, 'option', 'stack')
                    facade.remove_class('.canvas', 'active');
                    facade.add_class(top, 'active');                }
            });
            facade.resizable(element.content, {
                start : function (e, ui) {

                    
                },
                resize : function (e, ui) {
                    that.resize_canvas(element, ui.size);
                },
                stop : function (e, ui) {

                }
            });
            return canvas;
        },
        template : function (container, opt) {
            console.log('template', opt)
            var template =  facade.template('#canvas-template', {'title' : opt.name}),
                canvas  = facade.append(facade.create_element('div', {'class' : 'canvas'}), template),
                layer = this.sheets.push_layer(canvas),
                content = facade.find_element('.content', canvas);

            facade.data(canvas, 'layer', layer);
            facade.css(canvas, {'top' : (layer*2 + 4) + 'rem',
                                 'left' : (layer*2 + 4) + 'rem',
                                 'z-index' : Math.min(layer*1 + this.z_index*1, 999)});

            facade.css(content, opt.css);
            return canvas;

        },
        reorder : function (element) {
            this.sheets.layer_up(element);
            var that = this;
            this.sheets.iterate(function(sheet, layer) {
                facade.css(sheet, {'z-index' : that.z_index + layer});
            });
        },
        remove : function (element) {
            var that = this,
                sheet = facade.closest(element.target, '.canvas');

            facade.animate(sheet, {opacity: '0'}, this.interval, function() {
                that.sheets.remove(sheet); //remove from model
                facade.remove(sheet);  //renove from view
            });
        },
        add_new : function (element, opt) {
            opt = $.extend({}, opt);

            facade.draggable(element);
            if (opt.css !== '') {
                facade.css(element, opt.css);
            }
            element.appendTo($(opt.parent));
        },
        add_element : function (content, position) {
            var new_el = facade.create_element(this.tool_data.type, this.tool_data.attr),
                header = facade.create_element('header', {'class' : 'box', text : 'test1234'}),
                remove = facade.create_element("span", { 'class' : 'remove'}),
                wrapper = facade.create_element('div', {'class' : 'element-frame'}),
                element;

            element = facade.prepend(facade.prepend(wrapper, new_el), facade.append(header, remove), this.tool_data);
            facade.css(element, {position : 'absolute'});
            facade.css(element, position);
            facade.append(content, element);

            facade.add_event(remove, 'click', function () {
               facade.remove(element);
            });

            facade.draggable(element, {handle : 'header', cursor : 'crosshair' , containment : '.content'});
        }, 
        resize_canvas : function (element, opt) {
            console.log('resize_canvas', opt);
            facade.text(element.width, opt.width);
            facade.attr(element.width, {value : opt.width});
            facade.text(element.height, opt.height);
            facade.attr(element.height, {value : opt.height});
            facade.css(element.header, {width : opt.width - 64});
        },
        edit_info : function (element) {
            // console.log('edit_info', );
            if (facade.find_element('.edit-info', element.info).length !== 0) {
                return false;
            }

            var that = this,
                width = facade.text(element.width),
                height = facade.text(element.height),
                form = facade.create_element('form', { 'class' : 'edit-info', children : [
                    facade.create_element('input', {'class' : 'width', value : width}),
                    facade.create_element('span', {text : '×'}),
                    facade.create_element('input', {'class' : 'height', value : height})
                ]}),
                ok =  facade.create_element('input', {type : 'button', 'class' : 'ok', value : 'ok'});
            
            // span = facade.find_element('span', info);
            facade.remove(element.width);
            facade.remove(element.height);

            facade.append(element.info, facade.append(form, ok));
            facade.add_event(ok, 'click', function(e) {
                that.update_info(element);
                return false;
            })
        },
        update_info : function (element) {
            var form = facade.find_element('form', element.info),
                width = facade.val(facade.find_element('.width', form)),
                height = facade.val(facade.find_element('.height', form)),
                el_width = facade.create_element('span', {'class' : 'width', text : width}),
                el = facade.create_element('span', {text : '×'}),
                el_height = facade.create_element('span', {'class' : 'height', text : height});
            
            facade.remove(form);
            facade.css(element.canvas, {width : width, height : height});
            facade.css(element.header, {width : width});
            facade.append(element.info, el_width);
            facade.append(element.info, el);
            facade.append(element.info, el_height);
        },
        toggleMinMax : function(element) {
            this.resize_canvas(element, {width : facade.text(element.width), height : facade.text(element.height)});
            if (facade.has_class(element.canvas, 'min')){
                facade.css(element.canvas, {'position' : 'absolute'});
                facade.css(element.content, {'display' : 'block'});
                facade.css(element.header, {'width' : facade.text(element.width) - 64});
                facade.remove_class(element.canvas, 'min');
            } else {
                facade.css(element.canvas, {'position' : 'inherit', 'float' : 'left'});
                facade.css(element.content, {'display' : 'none'});
                facade.css(element.header, {'width' : '10rem'});
                facade.add_class(element.canvas, 'min');
            }
        }
    }
});

CORE.create_module('edit-navigation', function(facade) {

    return {
        init : function () {
            var that = this;
            facade.listen({
                'tool-selected' : function (opt) {
                    that.create_tool(opt);
                }
            })
        },
        destroy : function () {
            facade.ignore(['tool-selected']);
        },
        create_tool : function (opt) {
            var that = this,
                form = facade.find('.edit'),
                submit = facade.create_element('input', {'class' : 'create-element', value : 'ok', type : 'button'}),
                form_elements,
                form_data,
                data = {attr : {}},
                form_data,
                el;
            
            facade.remove('#link-form');
            switch (opt.id) {
                case 'link' : 
                    form_elements = that.create_link(opt);
                    data.type = 'a';
                    break;
                case 'img' :
                    form_elements = that.create_img(opt);
                    data.type = 'img';
                    break;
                case 'paragraph' :
                    form_elements = that.create_p(opt);
                    data.type = 'p';
                    break;
                default : console.log('Tool type does not exist', opt.id);
            }
            facade.append(form_elements, submit);
            facade.prepend(form, form_elements);

            facade.add_event(submit, 'click', function () {
                form_data = facade.find('input');
                for(var i = 0, l = form_data.length; i < l; i++) {
                    if (form_data[i].value.length > 2) { //counting "".length = 2
                        data.attr[form_data[i].id] = form_data[i].value;
                    }
                }
                console.log(data);
                facade.notify({
                    type : 'create-element',
                    data : data
                });
            });
        },
        create_link : function (opt) {
            // var text = (typeof opt === 'undefined') ? '' : opt.text.value,
            //     href = (!!opt.href.value) ? '' : opt.href.value;
            console.log('create_link', opt);

            var form_elements = facade.create_element('div', {id : 'link-form', children: [
                                    facade.create_element('input', {id : 'text', 'class' : 'text', value : 'testi test'}),
                                    facade.create_element('input', {id : 'href', 'class' : 'href', value : 'linki link blink'})
                                ]});
            return form_elements;
        },
        create_img : function (opt) {
            var form_elements = facade.create_element('div', {id : 'link-form', children: [
                                    facade.create_element('input', {id : 'title', 'class' : 'title', value : 'test1'}),
                                    facade.create_element('input', {id : 'src', 'class' : 'image', value : 'http://lorempixel.com/60/60/'})
                                ]});
            return form_elements;
        },
        create_p : function (opt) {
            var form_elements = facade.create_element('div', {id : 'link-form', children: [
                                    facade.create_element('input', {id : 'text', 'class' : 'text', value : 'text area?! lalalalala land'})
                                ]});
            return form_elements;
        }
    }
});

CORE.create_module('toolkit', function(facade) {

    var tools;

    function each_tool (fn) {
        for (var i = 0, tool ; tool = tools[i]; i++) {
            fn(tool);
        }
    }
    function reset () {
        each_tool(function (tool) {
            facade.remove_class(tool, 'selected');
        });
    }

    return {
        init : function () {
            var that = this,
                toolbox = facade.find('.tools-frame');

            tools = facade.find('nav ul li');

            if (tools.length > 0 ) {
                facade.add_class(tools[0], 'selected');
                facade.notify({
                    type : 'tool-selected',
                    data : {id : tools[0].id}
                })
            }
            each_tool(function(tool){
                facade.add_event(tool, 'click', that.select);
            });
            facade.draggable(toolbox, {handle : 'header', cursor : 'crosshair'});  

        },
        destroy : function () {
            each_tool(function(tool){
                facade.remove_event(tool, 'click', that.select);
            });
            facade.ignore(['tool-selected']);
        },
        select : function(e) {
            console.log('select_tool', this, e.currentTarget);
            var li = e.currentTarget;
            reset();
            facade.add_class(li, 'selected');
            facade.notify({
                type : 'tool-selected',
                data : {id : li.id}
            })
        }
    }
});


CORE.start_all();

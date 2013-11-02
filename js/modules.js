
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
        hide : facade.find('.close'),
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
                    default :   console.log('Unable to complete the selected action');
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
                    default :   console.log('Unable to complete the selected action');
                }
            });
        },
        create : function () {
            var drag = facade.find('header'),
                dragged = facade.find('.wrapper');

            facade.draggable(this.drag, {dragged : this.dragged});
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
                    that.canvas(opt);
                },
                'tool-selected' : function (opt) {
                    that.tool = opt.id;
                },
                'new-element-data' : function (opt) {
                    that.tool_data = opt;
                }
            });
        },
        destroy : function () {
            var delete_btn;
            for (i = 0, l = sheets.data.length; i < l; i++) {
                delete_btn = facade.find('header .close', sheet[i]);
                facade.remove_event(delete_btn, 'click', this.remove_sheet(sheet));
            }
            facade.ignore(['create_canvas']);
        },
        canvas : function (opt) {
            var that = this,
                container = facade.find(),
                element = this.create(container, opt),
                header,
                delete_btn,
                content;
            
            delete_btn = facade.find_element('header .close', element);
            facade.add_event(delete_btn, 'click', function(e) {
                that.remove_sheet(e);
            });
            content = facade.find_element('.content', element);
            facade.add_event(content, 'click', function(e){
                that.reorder_canvas(element);
                
                if (e.target === e.currentTarget) {
                    var position = facade.mouse_position(content, e),
                        new_el = facade.create_element(that.tool_data.type, that.tool_data.attr);

                    facade.css(new_el, {position : 'absolute'});
                    facade.css(new_el, position);
                    facade.append(content, new_el);
                }
                e.stopPropagation();
            });
            header = facade.find('header', element);        
            facade.draggable(header, {dragged : '.canvas-frame', z_index: facade.css(element, 'z-index')});            
            return element;
        },
        create : function (container, opt) {
            var template =  facade.get_template('#canvas-template', {'title' : opt.name}),
                element  = facade.append(facade.create_element('div', {'class' : 'canvas-frame'}), template),
                layer = this.sheets.push_layer(element),
                content;

            facade.data(element, 'layer', layer);
            facade.css(element, {'top' : (layer*2 + 4) + 'rem',
                                 'left' : (layer*2 + 4) + 'rem',
                                 'z-index' : Math.min(layer*1 + this.z_index*1, 999)});

            facade.prepend(container, element);

            content = facade.find_element('.content', element);
            facade.css(content, opt.css);

            return element;

        },
        reorder_canvas : function (element) {
            this.sheets.layer_up(element);
            var that = this;
            this.sheets.iterate(function(sheet, layer) {
                facade.css(sheet, {'z-index' : that.z_index + layer});
            });
        },
        remove_sheet : function (element) {
            var that = this,
                sheet = facade.closest(element.target, '.canvas-frame');

            facade.animate(sheet, {opacity: '0'}, this.interval, function() {
                that.sheets.remove(sheet); //remove from model
                facade.remove(sheet);  //renove from view
            });
        },
        add_new : function (element, opt) {
            opt = $.extend({}, opt);

            // console.log('add_new', element, opt);
            facade.draggable(element);
            if (opt.css !== '') {
                facade.css(element, opt.css);
            }
            element.appendTo($(opt.parent));

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
            facade.ignore(['create-tool']);
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
                case 'p' :
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
                
                facade.notify({
                    type : 'new-element-data',
                    data : data
                })
            })
        },
        create_link : function (opt) {
            var form_elements = facade.create_element('div', {id : 'link-form', children: [
                                    facade.create_element('input', {id : 'text', 'class' : 'text', value : 'test1'}),
                                    facade.create_element('input', {id : 'href', 'class' : 'href', value : 'test2'})
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
                header = facade.find('header');

            tools = facade.find('nav ul li');

            if (tools.length > 0 ) {
                facade.add_class(tools[0], 'selected');
                facade.notify({
                    type : 'tool-selected',
                    data : {id : tools[0].id}
                })
            }
            each_tool(function(tool){
                facade.add_event(tool, 'click', that.select_tool);
            });
            facade.draggable(header, {dragged : '.tools-frame'});  

        },
        destroy : function () {
            each_tool(function(tool){
                facade.remove_event(tool, 'click', that.select_tool);
            });
            facade.ignore(['tool-selected']);
        },
        select_tool : function(e) {
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

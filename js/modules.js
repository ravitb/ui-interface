
CORE.create_module('header', function (facade) {
    
    return {
        top_menu : undefined,
        init : function () {
            var that = this;

            this.canvas.init();
            this.canvas.create();
            this.top_menu = facade.find('.menu li');
            facade.each(this.top_menu, function(index, value){
                facade.add_event(value, 'click', function() {
                    switch (facade.html(value).toLowerCase()) {
                        case 'new' : 
                            that.canvas.create();
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
                            that.canvas.create();
                            break;
                        default : console.log('Unable to complete the selected action');
                    }
                });
            });
        },
        canvas : {
            interval : 100,
            hide : facade.find('.init-canvas .close'),
            dialog : facade.find('.init-canvas'),
            header : facade.find('.init-canvas header'),
            drag : facade.find('.init-canvas header'),
            dragged : facade.find('.init-canvas .wrapper'),
            input : facade.find('.init-canvas input'),

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
            },
            destroy : function () {
                var that = this;
                facade.remove_event(this.hide, 'click', function() {
                    that.remove(that.dialog);
                });
                
                facade.each(this.canvas.input, function(index, value){
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
    };
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
        init : function () {
            var that = this;
            facade.listen({
                'create_canvas' : function (opt) {
                    that.canvas(opt);
                },
                'tool-selected' : function (opt) {
                    that.tool = opt.id;
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
            content = facade.find_element(element, '.content');
            facade.add_event(content, 'click', function(e){
                e.stopPropagation();
                that.reorder_canvas(element);
                
                if (e.target === e.currentTarget) {
                    var input = facade.create_element("input", { 'class' : 'input-box' })
                        pos = facade.mouse_position(content, e);

                    facade.append(content, input);
                    facade.css(input,{'position' : 'absolute'});
                    facade.css(input, pos);
                }
            });
            header = facade.find('header', element);        
            facade.draggable(header, { 
                    dragged : '.canvas-frame',
                    z_index: facade.css(element, 'z-index'),
                    // helper : 'clone',
                    // parent : '#canvas-container'
                },
                function(drag, clone) {
                    var sheet = facade.closest(drag, '.canvas-frame');
                    that.reorder_canvas(sheet);
                    if (typeof clone !== 'undefined') {
                        that.add_new(clone, {
                                parent : '#canvas-container',
                                css : {
                                    'opacity' : 1
                                }
                        });
                    }
            });
            
            return element;
        },
        create : function (container, opt) {
            var template =  facade.get_template('#some-template', {'title' : opt.name}),
                element  = facade.append(facade.create_element('div', {'class' : 'canvas-frame'}), template),
                layer = this.sheets.push_layer(element),
                sheet;

            facade.data(element, 'layer', layer);
            facade.css(element, {'top' : (layer*2 + 4) + 'rem',
                                 'left' : (layer*2 + 4) + 'rem',
                                 'z-index' : Math.min(layer*1 + this.z_index*1, 999)});

            facade.prepend(container, element);

            sheet = facade.find('.content', element);
            facade.css(sheet, opt.css);
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
                console.log('remove', that.sheets.data);
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
            var that = this;

            tools = facade.find('nav ul li');
            console.log('init tools:', tools.length);
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

        },
        destroy : function () {
            each_tool(function(tool){
                facade.remove_event(tool, 'click', that.select_tool);
            });
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

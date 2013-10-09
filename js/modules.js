
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
                                    console.log('input', index, value.name);
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
            counter : 0,
            set_layer : function () {
                return this.counter++;
            },
            get_layer : function (layer) {
                for (var i = 0, l = this.data.length; i < l; i++) {
                   if (layer === facade.data(this.data[i].element, 'sheet-layer')) {
                        return i;
                   }
                }
            },
            move_to_top : function () {

            },
            remove : function (sheet) {
                var layer = this.get_layer(facade.data(sheet, 'sheet-layer'));
                for (var i = 0, l = this.data.length, j; i < l; i++) {
                    if (this.data[i].layer > layer) {
                        this.data[i].layer--;
                    } else if (this.data[i].layer === layer) {
                        j = i;
                    }
                }
                this.counter--;
                this.data.splice(j, 1);
            }
        },
        interval : 200,
        init : function () {
            console.log('init', this);
            var that = this,
                delete_btn,
                sheet;
            facade.listen({
                'create_canvas' : function (opt) {
                    sheet = that.canvas(opt);
                    delete_btn = facade.find('header .close', sheet);
                    facade.add_event(delete_btn, 'click', function(e) {
                        that.remove_sheet(e);
                    });
                }
            });
        },
        destroy : function () {
            var delete_btn;
            for (i = 0, l = sheets.data.length; i < l; i++) {
                delete_btn = facade.find('header .close', sheet[i]);
                facade.remove_event(delete_btn, 'click', this.remove_sheet(sheet));
            }
        },
        canvas : function (opt) {
            var that = this,
                container = facade.find(),
                item = this.create(opt),
                sheet,
                header;

            facade.prepend(container, item.element);
            this.sheets.data.push({'element' : item.element, 'layer' : item.layer});
            
            header = facade.find('header', item.element);
            facade.draggable(header, {dragged : '.canvas-frame', z_index: 900 + item.layer}, function() {
                that.reorder_canvas(item.element);
                that.activate_canvas(item.element);
            });
            
            sheet = facade.find('.content', item.element);
            facade.css(sheet, opt.css); //how can I concatinate functions? with prototype and call?
            return item;
        },
        create : function (opt) {
            var template =  facade.get_template('#some-template', {'title' : opt.name}),
                element  = facade.append(facade.create_element('div', {'class' : 'canvas-frame'}), template),
                layer = this.sheets.set_layer();

            facade.data(element, 'sheet-layer', layer);
            facade.css(element, {'top' : (this.sheets.counter*2 + 4) + 'rem',
                                 'left' : (this.sheets.counter*2 + 4) + 'rem',
                                 'z-index' : Math.min(layer + 100, 999)});
            return {'element' : element, 'layer' : layer};

        },
        reorder_canvas : function (element) {
            // console.log('reorder_canvas', facade.data(element, 'sheet-layer'), this.sheets.counter);
            for (var i = 0, l = this.sheets.data.length; i < l; i++) {
                // console.log('sheet', i, this.sheets.data[i].element);
            }


        },
        activate_canvas : function () {

        },
        remove_sheet : function (element) {
            var that = this,
                sheet = facade.closest(element.target, '.canvas-frame');

            facade.animate(sheet, {opacity: '0'}, this.interval, function() {
                facade.remove(sheet);  //renove from view
                that.sheets.remove(sheet); //remove from model
            });
        }
    }
});


CORE.start_all();

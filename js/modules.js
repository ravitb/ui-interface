
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
            set_counter : function () {
                return this.counter++;
            },
            shift_layer : function () {
                console.log('shift_layer', this.data.shift());
            },
            push_layer : function (sheet) {
                var layer = this.set_counter();
                this.data.push({'element' : sheet, 'layer' : layer});
                return layer;
            },
            pop_layer : function () {
                this.data.pop();
                this.counter--;
            },
            layer_up : function (sheet) {
                var layer = facade.data(sheet, 'sheet-layer');
                if (typeof layer === 'number') {
                    for (var i = 0, l = this.data.length, j; i < l; i++) {
                        if (this.data[i].layer > layer) {
                            this.data[i].layer--;
                        } else if (this.data[i].layer === layer) {
                            j = i;
                        }
                    }
                    this.cut(j);
                }
                // this.push_layer(sheet);
                // console.log('layer_up', this.data);
            },
            cut : function (pos) {
                // return this.data.splice(pos, 1);
                var item,
                    popped;
                console.log('cut', pos);
                for (var i = 0, l = this.data.length; i < l; i++) {
                    if (this.data[i].layer !== pos) {
                        item = this.data.shift();
                        this.(item);
                        console.log('pop', item, this.data);
                    } else {
                        popped = this.data.pop();
                        console.log('popped', popped, this.data);
                        this.counter--;
                    }
                }
                return popped;
            },
            remove : function (sheet) {
                var top = this.layer_up(sheet);
                this.pop_layer();
            }
        },
        interval : 200,
        z_index : 100,
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
                element = this.create(opt),
                layer = this.sheets.counter,
                sheet,
                header;

            facade.prepend(container, element);
        
            header = facade.find('header', element);
            facade.draggable(header, {dragged : '.canvas-frame', z_index: facade.css(element, 'z-index')}, function() {
                that.reorder_canvas(element);
                that.activate_canvas(element);
            });
            
            sheet = facade.find('.content', element);
            facade.css(sheet, opt.css); //how can I concatinate functions? with prototype and call?
            return element;
        },
        create : function (opt) {
            var template =  facade.get_template('#some-template', {'title' : opt.name}),
                element  = facade.append(facade.create_element('div', {'class' : 'canvas-frame'}), template),
                layer = this.sheets.push_layer(element);

            facade.data(element, 'sheet-layer', layer);
            facade.css(element, {'top' : (this.sheets.counter*2 + 4) + 'rem',
                                 'left' : (this.sheets.counter*2 + 4) + 'rem',
                                 'z-index' : Math.min(layer + this.z_index, 999)});
            return element;

        },
        reorder_canvas : function (element) {
            this.sheets.layer_up(element);
            // for (var i = 0, l = this.sheets.data.length; i < l; i++) {
            //     facade.css(this.sheets.data[i].element, {'z-index' : this.z_index + this.sheets.data[i].layer});
            //     console.log('sheet', facade.css(this.sheets.data[i].element, 'z-index'));
            // }
            // console.log('sheet', this.sheets.data);
        },
        activate_canvas : function () {

        },
        remove_sheet : function (element) {
            var that = this,
                sheet = facade.closest(element.target, '.canvas-frame');

            facade.animate(sheet, {opacity: '0'}, this.interval, function() {
                that.sheets.remove(sheet); //remove from model
                facade.remove(sheet);  //renove from view
            });
        }
    }
});


CORE.start_all();

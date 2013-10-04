
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
            set_id : function () {
                return this.counter++;
            },
            get_id : function (id) {
                for (var i = 0, l = this.data.length; i < l; i++) {
                   if (id === facade.data(this.data[i], 'sheet-id')) {
                        return i;
                   }
                }
            },
            remove : function (sheet) {
                var id = this.get_id(facade.data(sheet, 'sheet-id'));
                this.data.splice(id, 1);
            }
        },

        interval : 100,
        init : function () {
            console.log('init', this);
            var that = this,
                delete_btn,
                sheet;
            facade.listen({
                'create_canvas' : function (opt) {
                    sheet = that.create(opt);
                    delete_btn = facade.find('header .close', sheet);
                    facade.add_event(delete_btn, 'click', function(e) {
                        that.remove_sheet(e);
                    });
                },
                'create_canvas2' : this.create_leaf
            });
        },
        destroy : function () {
            var delete_btn;
            for (i = 0, l = sheets.data.length; i < l; i++) {
                delete_btn = facade.find('header .close', sheet[i]);
                facade.remove_event(delete_btn, 'click', this.remove_sheet(sheet));
            }
        },
        create : function (opt) {
            var container = facade.find(),
                template  = facade.get_template('#some-template', {'title' : opt.name}),
                element   = facade.create_element('div'),
                header,
                sheet;

            element = facade.prepend(element, template);
            facade.data(element, 'sheet-id', this.sheets.set_id());
            facade.prepend(container, element);
            this.sheets.data.push(element);

            header = facade.find('header', element);
            facade.draggable(header, {dragged : element});

            sheet = facade.find('.content', element);
            facade.css(sheet, opt.css); //how can I concatinate functions?
            return element;
        },
        remove_sheet : function (element) {
            var that = this,
                sheet = facade.parent(facade.closest(element.target, '.canvas-frame'));

            facade.animate(sheet, {opacity: '0'}, this.interval, function() {
                facade.remove(sheet);  //renove from view
                that.sheets.remove(sheet); //remove from model
            });
        }
    }
});


CORE.start_all();

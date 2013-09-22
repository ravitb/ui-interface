
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
                    switch (facade.text(value).toLowerCase()) {
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
                    that.canvas.remove(that.dialog);
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
                                    console.log('input', index, value.name);
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
                    width : this.input[0].value,
                    height : this.input[1].value,
                    hex : this.input[2].value
                }

                facade.notify({
                     type : 'create_canvas',
                     data :res
                 });
                console.log('submit', this.input.slice(0,3), res);
            }
        }
    };
});


// CORE.create_module('init-canvas', function (facade) {
//     var hide_btn;
//     return {
//         init : function () {

//             submit_btn = facade.find('.submit')[0];
//         	hide_btn = facade.find('.hide')[0];

//             // facade.
//         	facade.add_event(submit_btn, 'click', this.submit);
//             facade.add_event(hide_btn, 'click', this.hide);
        
//         	facade.listen({
//         		'init-canvas' : this.show
//         	})
//         }, 
//         destroy : function () {
// 	    	Facade.remove_event(hide_element, 'click', this.hide_dialog);
//             Facade.ignore(['init-canvas'])
//         },
//         submit : function () {
//             console.log('');
//         },
//         show : function (e) {
//             console.log('show', this);
//         	facade.show(facade.find('#init-canvas'));
//         },
//         hide : function(){
//         	facade.find('init-canvas').hide();
//         }

//     };
// });

// CORE.create_module('canvas', function (facade) {
// 	var canvas_wrapper;

//     return {
//         init : function () {
//         	canvas_wrapper = facade.find('section.main-content')[0];
//         	facade.listen({
//         		'create' : this.create
//         	});
//         }, 
//         destroy : function () {
//             // facade.destroy_element('section.canvas');
//             Facade.ignore(['create']);
//         },
//         //open: function(){},
//         create : function(options){
//         	var canvas;
//         	this.options = Facade.extend({
//         		'width': '600px',
//         		'min-height': '800px',
//         		'background-color': '#fff'
//         	}, options);
//         	canvas = facade.create_element('section', {'class' : 'canvas', children : [
//         		Facade.create_element('div', {'options' : this.options})
//         	]});
//         	canvas_wrapper.append_child(canvas);
//         },
//         save: function(e) {
//         	facade.notify({
//         		type : 'save-canvas'
//         	});
//         },
//         reset: function(){
//         	facade.reset_element('section.canvas');
//         }
//     };
// });

CORE.start_all();

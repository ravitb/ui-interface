
CORE.create_module('header', function (facade) {
    
    var menu_item,
        init_canvas,
        hide_canvas;
    return {
        init : function () {
            var that = this;

            init_canvas = facade.find('.init-canvas');
            hide_canvas = facade.find('.init-canvas .close');
            facade.add_event(hide_canvas, 'click', this.canvas.remove);

            menu_item = facade.find('.menu li');
            facade.each(menu_item, function(index, value){
                facade.add_event(value, 'click', function() {
                    that['_' + facade.text(value).toLowerCase()]();
                });
            });
        }, 
        destroy : function () {
           facade.each(menu_item, function(key, value){
                facade.remove_event(value, 'click', function() {
                    that['_' + facade.text(value).toLowerCase()]
                });
            }); 
        },
        _new : function () {
            this.canvas.create();
        },
        canvas : {
            display_interval : 100,
            create : function () {
                canvas_header = facade.find('.init-canvas header');
                
                facade.draggable(init_canvas, {cursor: 'default'}).show(init_canvas);
                facade.animate(init_canvas, {opacity: '1'}, this.display_interval);
            },
            remove : function () {
                facade.animate(init_canvas, {opacity: '0'}, this.display_interval, function() {
                    facade.hide(init_canvas)
                });
            },
            reset : function () {            
                console.log('reset');
            },
            submit : function (e) {
                e.preventDefault();
                console.log('submit');
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


CORE.create_module('header', function (facade) {
    
    var menu_item,
        init_canvas,
        canvas_header;
    return {
        init : function () {
            var that = this;

            init_canvas = facade.find('.init-canvas');
            // facade.hide(init_canvas);
            
            this._new(); //To remove

            menu_item = facade.find('.menu li');
            facade.each(menu_item, function(index, value){
                facade.add_event(value, 'click', that['_' + facade.text(value).toLowerCase()]);
            });
        }, 
        destroy : function () {
           facade.each(menu_item, function(index, value){
                facade.remove_event(value, 'click', that['_' + facade.text(value).toLowerCase()]);
            }); 
        },
        _new : function () {
            console.log('NEW!!!');
            canvas_header = facade.find('.init-canvas header');
            console.log('init-canvas', facade.html(canvas_header));
            facade.draggable(init_canvas, {'cursor': 'default'})
            facade.animate(1, 'aaa',2);
            // facade.show(init_canvas);
        },
        _reset : function () {
            var input = facade.find('input');
            console.log('reset', input);
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

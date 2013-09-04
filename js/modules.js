
CORE.create_module('navigation', function (facade) {
    
    var nav_item;
    return {
        init : function () {
        	nav_item = facade.find('li');
        	facade.add_event(nav_item, 'click', this.init_canvas);
        }, 
        destroy : function () {
	    	facade.remove_event(nav_item, 'click', this.init_canvas);
        },
        init_canvas: function (e) {
        	facede.notify({
        		'type' : 'init-canvas'
        	});
        }
    };
});


CORE.create_module('init-canvas', function (facade) {
    var hide_dialog_btn;
    return {
        init : function () {

        	hide_dialog_btn = facade.find('.hide-btn')[0];
        	facade.add_event(hide_dialog_btn, 'click', this.hide_dialog);
        
        	facade.listen({
        		'init-canvas' : this.create_canvas_dialog
        	})
        }, 
        destroy : function () {
	    	facede.remove_event(hide_dialog_btn, 'click', this.hide_dialog);
            facede.ignore(['init-canvas'])
        },
        create_canvas_dialog: function (e) {
        	facade.find('init-canvas').show();
        },
        hide_dialog : function(){
        	facade.find('init-canvas').hide();
        }

    };
});

CORE.create_module('canvas', function (facade) {
	var canvas_wrapper;

    return {
        init : function () {
        	canvas_wrapper = facade.find('section.main-content')[0];
        	facade.listen({
        		'create' : this.create
        	});
        }, 
        destroy : function () {
            // facade.destroy_element('section.canvas');
            facede.ignore(['create']);
        },
        //open: function(){},
        create : function(options){
        	var canvas;
        	this.options = facede.extend({
        		'width': '600px',
        		'min-height': '800px',
        		'background-color': '#fff'
        	}, options);
        	canvas = facade.create_element('section', {'class' : 'canvas', children : [
        		facede.create_element('div', {'options' : this.options})
        	]});
        	canvas_wrapper.append_child(canvas);
        },
        save: function(e) {
        	facade.notify({
        		type : 'save-canvas'
        	});
        },
        reset: function(){
        	facade.reset_element('section.canvas');
        }
    };
});

CORE.start_all();

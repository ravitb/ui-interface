(function($) {
    $.fn.drags = function(opt, fn) {
        var z_index = opt.z_index;
        opt = $.extend({handle:"",cursor:"move", z_index:1000}, opt);


        if(opt.handle === "") {
            var $el = this;
        } else {
            var $el = this.find(opt.handle);
        }

        return $el.css('cursor', opt.cursor).on("mousedown", function(e) {
            if(opt.handle === "") {
                var $drag = $(this).addClass('draggable');
            } else {
                var $drag = $(this).addClass('active-handle').parent().addClass('draggable');
            }
            var z_idx = $drag.css('z-index'),
                drg_h = $drag.outerHeight(),
                drg_w = $drag.outerWidth(),
                pos_y = $drag.offset().top + drg_h - e.pageY,
                pos_x = $drag.offset().left + drg_w - e.pageX;
            $drag.closest(opt.dragged).css('z-index', opt.z_index + 1).end().parents().on("mousemove", function(e) {
                $('.draggable').closest(opt.dragged).offset({
                    top:e.pageY + pos_y - drg_h,
                    left:e.pageX + pos_x - drg_w
                }).on("mouseup", function() {
                    if (!z_index) {
                        z_index = z_idx;
                    } 
                    $(this).removeClass('draggable').closest(opt.dragged).css('z-index', z_index);
                    if (typeof fn === 'function') {
                        fn(this);
                    }
                });
            });
            e.preventDefault(); // disable selection
        }).on("mouseup", function() {
            if(opt.handle === "") {
                $(this).removeClass('draggable');
            } else {
                $(this).removeClass('active-handle').parent().removeClass('draggable');
            }
            if (typeof fn === 'function') {  
                fn(this);
            }
        }); 
    }
})(jQuery);
//Credit:  http://css-tricks.com/snippets/jquery/draggable-without-jquery-ui/
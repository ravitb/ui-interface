(function($) {
    $.fn.drags = function(opt, fn) {
        var $this = $(this),
            $clone;
        
        opt = $.extend({handle:"",cursor:"move", z_index:1000, parent:$('body')}, opt);

        return this.css('cursor', opt.cursor).on("mousedown", function(e) {
            if (opt.helper === 'clone') {
                var $drag = $(this).closest(opt.dragged).clone().css('opacity', 0.5).appendTo(opt.parent);
                $clone = $drag;
            } else {
                var $drag = $(this);
            }
            $drag.addClass('draggable');
            
            var stopDragging = function () {
                if (!z_index) {
                    z_index = z_idx;
                } 
                $drag.removeClass('draggable').closest(opt.dragged).css('z-index', z_index);
                if (typeof fn === 'function') {
                    fn(this, $clone);
                }
            }

            var z_idx = z_index = $drag.css('z-index'),
                drg_h = $drag.outerHeight(),
                drg_w = $drag.outerWidth(),
                pos_y = $drag.offset().top + drg_h - e.pageY,
                pos_x = $drag.offset().left + drg_w - e.pageX;
            $drag.closest(opt.dragged).css('z-index', opt.z_index + 1).end().parents().on("mousemove", function(e) {
                // e.stopPropagation();
                e.preventDefault();
                $('.draggable').closest(opt.dragged).offset({
                    top:e.pageY + pos_y - drg_h,
                    left:e.pageX + pos_x - drg_w
                });
            });

            $drag.on("mouseup", function() {
                stopDragging();
            });

            $drag.on("click", function() {
                stopDragging();
            });
        }).on("mouseup", function() {
            $this.removeClass('draggable');
            if (typeof fn === 'function') {  
                fn(this, $clone);
            }
        }); 
    }
})(jQuery);
//Credit:  http://css-tricks.com/snippets/jquery/draggable-without-jquery-ui/
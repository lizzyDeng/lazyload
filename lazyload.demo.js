(function(window,$,undefined){
	var default_settings = {
		event: 'scroll',
		failure_limit: 0,
		effect: 'show',
		container: window,
		data_attribute: 'original',
		skip_invisible: false,
		load: null,
		appear: null,
		placehold: './placeholder.png'
	}
    function lazyLoad(elements,options){
        this.$elems = $(elements);
        this.settings = $.extend({},options,default_settings);
        this.$container = (this.settings.container == 'window'|| this.settings.container == undefined) ? $(window) : $(this.settings.container);


        var that = this;
        $.each(this.$elems,function(){
        var $elem = $(this);

                $elem.loaded = false;
                console.log($elem[0].id + " " +$elem.loaded);
                if($elem.attr("src") == undefined || $elem.attr("src") == false){
                	if($elem.is("img")){
                		$elem.attr("src",that.settings.placehold);
                	}
                }// 没加载的实现现实缺省图片

                $elem.one("appear",function(){
                	if(!this.loaded){
                        var $pic = $(this);

                		var original_url = $pic.attr("data-" + that.settings.data_attribute);
                            //
                            $pic.hide();
                            if($pic.is("img")){
                                console.log(original_url);
                               $pic.attr("src",original_url);
                            }else{
                               $pic.src("background_image",original_url);
                            }

                            $pic.show();
                            
                		this.loaded = true;

                		var temp = $.grep(that.$elems,function(elem){
                			return !elem.loaded;
                		});

                		that.$elems = $(temp);

                        $(this).removeClass("lazy");
                	}

                });//.attr("src",that.settings.placehold);

        	});  

            var that = this;
            if(this.settings.event.indexOf('scroll') !== 0){
            	this.$container.on(this.settings.event,function(){
            		update(that);
            	})
            }

            
            $(document).ready(function(){
            	update(that);
            })

    }

     function update(context){
            var count = 0,
                that = context;

            $.each(that.$elems,function(elem){
                var $this = $(this);
                if(that.settings.skip_invisible || $this.loaded){
                    return ;
                }

                if(that.aboveTheTop($this) || that.leftOfBegin($this)){
                }else if(!that.belowTheFold($this) && !that.rightOfEnd($this)){
                    $this.trigger("appear");
                    count = 0;
                }else{
                    if(++count > that.settings.failure_limit){
                        return false;
                    }
                }
            });

            if(that.settings.event.indexOf('scroll') == 0){
                that.$container.on('scroll',function(){
                    update(that);
                })
              }
            }

     
        lazyLoad.prototype.aboveTheTop = function(elem){
        	var fold;

        	if(this.settings.container == undefined || this.settings.container == window){
        		fold = $(window).scrollTop()
        	}else{
        		var 
        		fold = $(this.settings.container).offset().top;
        	}

        	return fold >= $(elem).offset().top + $(elem).height();
        }
        lazyLoad.prototype.leftOfBegin = function(elem){
        	var fold;

        	if(this.settings.container == undefined || this.settings.container == window){
        		fold = $(window).scrollLeft();
        	}else{
        		fold = $(this.settings.container).scrollLeft();
        	}

        	return $(elem).offset().left + $(elem).width() <= fold;
        }
        lazyLoad.prototype.belowTheFold = function(elem){
        	var fold;

        	if(this.settings.container == undefined || this.settings.container == window){
        		fold = (window.innerHeight ? window.innerHeight : $(window).height()) + $(window).scrollTop();
        	}else{
        		var $container = $(this.settings.container);
        		fold = $container.scrollTop() + $container.height();
        	}

        	return fold <= $(elem).offset().top;
        }
        lazyLoad.prototype.rightOfEnd = function(elem){
            var fold;

            if(this.settings.container == undefined || this.settings.container == window){
            	fold = (window.innerWidth?window.innerWidth : $(window).width()) + $(window).scrollLeft();
            }else{
            	fold = $(this.settings.container).offset().left + $(this.settings.container).width();
            }

            return fold <= $(elem).offset().left;
            }


    function Plugin(options){
       return $.each(this,function(){
       	var $this = $(this),
       	    data = $this.data('fn.lazyLoad'),
       	    options = typeof options == 'object'&& options;

       	    if(!data){ $this.data('fn.lazyLoad', new lazyLoad($this,options));}
       });
    }

    $.fn.lazyLoad = Plugin;
    $.fn.lazyLoad.Constructor = lazyLoad;

})(window,jQuery)
/*
 * 	loopedSlider 0.5.6 - jQuery plugin
 *	written by Nathan Searles	
 *	http://nathansearles.com/loopedslider/
 *
 *	Copyright (c) 2009 Nathan Searles (http://nathansearles.com/)
 *	Dual licensed under the MIT (MIT-LICENSE.txt)
 *	and GPL (GPL-LICENSE.txt) licenses.
 *
 *	Built for jQuery library
 *	http://jquery.com
 *	Compatible with jQuery 1.3.2+
 *
 */

/*
 *	markup example for $jx("#loopedSlider").loopedSlider();
 *
 *	<div id="loopedSlider">	
 *		<div class="container">
 *			<div class="slides">
 *				<div><img src="01.jpg" alt="" /></div>
 *				<div><img src="02.jpg" alt="" /></div>
 *				<div><img src="03.jpg" alt="" /></div>
 *				<div><img src="04.jpg" alt="" /></div>
 *			</div>
 *		</div>
 *		<a href="#" class="previous">previous</a>
 *		<a href="#" class="next">next</a>	
 *	</div>
 *
*/

var $jx = jQuery.noConflict();

if(typeof jQuery != 'undefined') {
	jQuery(function($jx) {
		$jx.fn.extend({
			loopedSlider: function(options) {
				var settings = $jx.extend({}, $jx.fn.loopedSlider.defaults, options);
			
				return this.each(
					function() {
					if($jx.fn.jquery < '1.3.2') {return;}
					var $jxt = $jx(this);
					var o = $jx.metadata ? $jx.extend({}, settings, $jxt.metadata()) : settings;
					
					var distance = 0;
					var times = 1;
					var slides = $jx(o.slides,$jxt).children().size();
					var width = $jx(o.slides,$jxt).children().outerWidth();
					var position = 0;
					var active = false;
					var number = 0;
					var interval = 0;
					var restart = 0;
					var pagination = $jx("."+o.pagination+" li a",$jxt);

					if(o.addPagination && !$jx(pagination).length){
						var buttons = slides;
						$jx($jxt).append("<ul class="+o.pagination+">");
						$jx(o.slides,$jxt).children().each(function(){
							if (number<buttons) {
								$jx("."+o.pagination,$jxt).append("<li><a rel="+(number+1)+" href=\"#\" >"+(number+1)+"</a></li>");
								number = number+1;
							} else {
								number = 0;
								return false;
							}
							$jx("."+o.pagination+" li a:eq(0)",$jxt).parent().addClass("active");
						});
						pagination = $jx("."+o.pagination+" li a",$jxt);
					} else {
						$jx(pagination,$jxt).each(function(){
							number=number+1;
							$jx(this).attr("rel",number);
							$jx(pagination.eq(0),$jxt).parent().addClass("active");
						});
					}

					if (slides===1) {
						$jx(o.slides,$jxt).children().css({position:"absolute",left:position,display:"block"});
						return;
					}

					$jx(o.slides,$jxt).css({width:(slides*width)});

					$jx(o.slides,$jxt).children().each(function(){
						$jx(this).css({position:"absolute",left:position,display:"block"});
						position=position+width;
					});

					$jx(o.slides,$jxt).children(":eq("+(slides-1)+")").css({position:"absolute",left:-width});

					if (slides>3) {
						$jx(o.slides,$jxt).children(":eq("+(slides-1)+")").css({position:"absolute",left:-width});
					}

					if(o.autoHeight){autoHeight(times);}

					$jx(".next",$jxt).click(function(){
						if(active===false) {
							animate("next",true);
							if(o.autoStart){
								if (o.restart) {autoStart();}
								else {clearInterval(sliderIntervalID);}
							}
						} return false;
					});

					$jx(".previous",$jxt).click(function(){
						if(active===false) {	
							animate("prev",true);
							if(o.autoStart){
								if (o.restart) {autoStart();}
								else {clearInterval(sliderIntervalID);}
							}
						} return false;
					});

					if (o.containerClick) {
						$jx(o.container,$jxt).click(function(){
							if(active===false) {
								animate("next",true);
								if(o.autoStart){
									if (o.restart) {autoStart();}
									else {clearInterval(sliderIntervalID);}
								}
							} return false;
						});
					}

					$jx(pagination,$jxt).click(function(){
						if ($jx(this).parent().hasClass("active")) {return false;}
						else {
							times = $jx(this).attr("rel");
							$jx(pagination,$jxt).parent().siblings().removeClass("active");
							$jx(this).parent().addClass("active");
							animate("fade",times);
							if(o.autoStart){
								if (o.restart) {autoStart();}
								else {clearInterval(sliderIntervalID);}
							}
						} return false;
					});

					if (o.autoStart) {
						sliderIntervalID = setInterval(function(){
							if(active===false) {animate("next",true);}
						},o.autoStart);
						function autoStart() {
							if (o.restart) {
							clearInterval(sliderIntervalID,interval);
							clearTimeout(restart);
								restart = setTimeout(function() {
									interval = setInterval(	function(){
										animate("next",true);
									},o.autoStart);
								},o.restart);
							} else {
								sliderIntervalID = setInterval(function(){
									if(active===false) {animate("next",true);}
								},o.autoStart);
							}
						};
					}

					function current(times) {
						if(times===slides+1){times = 1;}
						if(times===0){times = slides;}
						$jx(pagination,$jxt).parent().siblings().removeClass("active");
						$jx(pagination+"[rel='" + (times) + "']",$jxt).parent().addClass("active");
					};

					function autoHeight(times) {
						if(times===slides+1){times=1;}
						if(times===0){times=slides;}	
						var getHeight = $jx(o.slides,$jxt).children(":eq("+(times-1)+")",$jxt).outerHeight();
						$jx(o.container,$jxt).animate({height: getHeight},o.autoHeight);					
					};		

					function animate(dir,clicked){	
						active = true;	
						switch(dir){
							case "next":
								times = times+1;
								distance = (-(times*width-width));
								current(times);
								if(o.autoHeight){autoHeight(times);}
								if(slides<3){
									if (times===3){$jx(o.slides,$jxt).children(":eq(0)").css({left:(slides*width)});}
									if (times===2){$jx(o.slides,$jxt).children(":eq("+(slides-1)+")").css({position:"absolute",left:width});}
								}
								$jx(o.slides,$jxt).animate({left: distance}, o.slidespeed,function(){
									if (times===slides+1) {
										times = 1;
										$jx(o.slides,$jxt).css({left:0},function(){$jx(o.slides,$jxt).animate({left:distance})});							
										$jx(o.slides,$jxt).children(":eq(0)").css({left:0});
										$jx(o.slides,$jxt).children(":eq("+(slides-1)+")").css({ position:"absolute",left:-width});				
									}
									if (times===slides) $jx(o.slides,$jxt).children(":eq(0)").css({left:(slides*width)});
									if (times===slides-1) $jx(o.slides,$jxt).children(":eq("+(slides-1)+")").css({left:(slides*width-width)});
									active = false;
								});					
								break; 
							case "prev":
								times = times-1;
								distance = (-(times*width-width));
								current(times);
								if(o.autoHeight){autoHeight(times);}
								if (slides<3){
									if(times===0){$jx(o.slides,$jxt).children(":eq("+(slides-1)+")").css({position:"absolute",left:(-width)});}
									if(times===1){$jx(o.slides,$jxt).children(":eq(0)").css({position:"absolute",left:0});}
								}
								$jx(o.slides,$jxt).animate({left: distance}, o.slidespeed,function(){
									if (times===0) {
										times = slides;
										$jx(o.slides,$jxt).children(":eq("+(slides-1)+")").css({position:"absolute",left:(slides*width-width)});
										$jx(o.slides,$jxt).css({left: -(slides*width-width)});
										$jx(o.slides,$jxt).children(":eq(0)").css({left:(slides*width)});
									}
									if (times===2 ) $jx(o.slides,$jxt).children(":eq(0)").css({position:"absolute",left:0});
									if (times===1) $jx(o.slides,$jxt).children(":eq("+ (slides-1) +")").css({position:"absolute",left:-width});
									active = false;
								});
								break;
							case "fade":
								times = [times]*1;
								distance = (-(times*width-width));
								current(times);
								if(o.autoHeight){autoHeight(times);}
								$jx(o.slides,$jxt).children().fadeOut(o.fadespeed, function(){
									$jx(o.slides,$jxt).css({left: distance});
									$jx(o.slides,$jxt).children(":eq("+(slides-1)+")").css({left:slides*width-width});
									$jx(o.slides,$jxt).children(":eq(0)").css({left:0});
									if(times===slides){$jx(o.slides,$jxt).children(":eq(0)").css({left:(slides*width)});}
									if(times===1){$jx(o.slides,$jxt).children(":eq("+(slides-1)+")").css({ position:"absolute",left:-width});}
									$jx(o.slides,$jxt).children().fadeIn(o.fadespeed);
									active = false;
								});
								break; 
							default:
								break;
							}					
						};
					}
				);
			}
		});
		$jx.fn.loopedSlider.defaults = {
			container: ".container", //Class/id of main container. You can use "#container" for an id.
			slides: ".slides", //Class/id of slide container. You can use "#slides" for an id.
			pagination: "pagination", //Class name of parent ul for numbered links. Don't add a "." here.
			containerClick: true, //Click slider to goto next slide? true/false
			autoStart: 0, //Set to positive number for true. This number will be the time between transitions.
			restart: 0, //Set to positive number for true. Sets time until autoStart is restarted.
			slidespeed: 300, //Speed of slide animation, 1000 = 1second.
			fadespeed: 200, //Speed of fade animation, 1000 = 1second.
			autoHeight: 0, //Set to positive number for true. This number will be the speed of the animation.
			addPagination: false //Add pagination links based on content? true/false
		};
	});
}
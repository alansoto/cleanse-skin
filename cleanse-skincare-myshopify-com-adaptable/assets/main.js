/**
* hoverIntent r6 // 2011.02.26 // jQuery 1.5.1+
* <http://cherne.net/brian/resources/jquery.hoverIntent.html>
* 
* @param  f  onMouseOver function || An object with configuration options
* @param  g  onMouseOut function  || Nothing (use configuration options object)
* @author    Brian Cherne brian(at)cherne(dot)net
*/
(function($){$.fn.hoverIntent=function(f,g){var cfg={sensitivity:7,interval:100,timeout:0};cfg=$.extend(cfg,g?{over:f,out:g}:f);var cX,cY,pX,pY;var track=function(ev){cX=ev.pageX;cY=ev.pageY};var compare=function(ev,ob){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);if((Math.abs(pX-cX)+Math.abs(pY-cY))<cfg.sensitivity){$(ob).unbind("mousemove",track);ob.hoverIntent_s=1;return cfg.over.apply(ob,[ev])}else{pX=cX;pY=cY;ob.hoverIntent_t=setTimeout(function(){compare(ev,ob)},cfg.interval)}};var delay=function(ev,ob){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);ob.hoverIntent_s=0;return cfg.out.apply(ob,[ev])};var handleHover=function(e){var ev=jQuery.extend({},e);var ob=this;if(ob.hoverIntent_t){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t)}if(e.type=="mouseenter"){pX=ev.pageX;pY=ev.pageY;$(ob).bind("mousemove",track);if(ob.hoverIntent_s!=1){ob.hoverIntent_t=setTimeout(function(){compare(ev,ob)},cfg.interval)}}else{$(ob).unbind("mousemove",track);if(ob.hoverIntent_s==1){ob.hoverIntent_t=setTimeout(function(){delay(ev,ob)},cfg.timeout)}}};return this.bind('mouseenter',handleHover).bind('mouseleave',handleHover)}})(jQuery);

var nav_init = false;
var subnav_visible = false;

$(function() {
    
	// Toggle RSS link
	if ($("link[type='application/atom+xml']").length)
	{
		$("#social .rss a").attr("href", $("link[type='application/atom+xml']").attr("href"));
		$("#social .rss").css({ display: 'block' });
	}
	
	// Sub-Navigation, use hoverIntent if there is a subnav
	if ($("#subnav").length)
	{
		if ($("#subnav").hasClass("dropdown"))
		{
			$("#nav > li").hover(function() 
			{
				if (!$(this).hasClass("active")) 
				{
					$("#nav > li.active").removeClass("active");
					$(this).addClass("active");
					//$("#subnav ul").stop(true, true).hide();
				}
	            $(this).find("ul").show();
			}, function() { 
	            $(this).find("ul").hide();
	            $("#nav > li.active").removeClass("active");
	    	});
		}
		else
		{
			$("#nav > li").hoverIntent({ over: function() 
			{
				if (!$(this).hasClass("active")) 
				{
					$("#nav > li.active").removeClass("active");
					$(this).addClass("active");
					$("#subnav ul").stop(true, true).hide();
				}
				if ($(this).find("ul"))
				{
					new_menu = $(this).find("ul").html();
					$("#subnav ul").html(new_menu).fadeIn(500);
					subnav_visible = true;
				}
			}, out: function() { return false; }, interval: 30 });
		}
	}
	else
	{
		$("#nav > li").hover(function() 
		{
			if (!$(this).hasClass("active")) 
			{
				$("#nav > li.active").removeClass("active");
				$(this).addClass("active");
				$("#subnav ul").stop(true, true).hide();
			}
			if ($(this).find("ul"))
			{
				new_menu = $(this).find("ul").html();
				$("#subnav ul").html(new_menu).fadeIn(500);
				subnav_visible = true;
			}
		});
	}
    if (!$("#subnav").hasClass("dropdown"))
    {
    	resetNav();
    	$(document).mousemove(function(e) {
    		if (subnav_visible && e.pageX < $("#nav-zone").position().left || e.pageX > $("#nav-zone").position().left + $("#nav-zone").width() || e.pageY < $("#nav-zone").position().top || e.pageY > $("#nav-zone").position().top + $("#nav-zone").height() + 20)
    			resetNav();
    	});
    }
	
	// Homepage banner
	if ($('#banner div').length > 1)
	{
		$('#banner').cycle({
			fx: banner_effect,
			speed: banner_transition_speed, 
			timeout: banner_pause,
			pager:  '#banner-pager', 
			/*pause: 1,*/
			pagerAnchorBuilder: function(idx, slide) { 
				return '<li><a href="#">&bull;</a></li>'; 
			}
		});			
	}
	

	// Cart quantity auto-updater
	if ($("#cart-wrapper").length)
	{
		$("#cart-wrapper .field[id^=updates]").change(function () {
			$(this).parent().addClass("ajax");
			$("input.update").click();
		});
		$(".update a").click(function () {
			$("input.update").click();
			return false;
		});
	}
	
	// Thumbnails - Preload extra images and set up image switcher
	$('a[rel="product-thumbs"]').each(function() {
		$('<img/>')[0].src = $(this).attr("href");
		$(this).click(function() { 
			$("#image img").attr("src", $(this).attr("href"));
    		$("#image a").attr("href", $(this).attr("href").replace("_large","_grande"));
			$("#thumbs .active").removeClass("active");
			$(this).parent().addClass("active");
			return false;
		});
	});
	
	// Search box focus clearing
	$("#q").focus(function () {
		if ($(this).val("Search"))
		{
			$(this).val("");
			$(this).css({ color: "#555" });
		}
	});
		
});

function resetNav()
{
	subnav_visible = false;
	if ($("#nav > li.real_active").length)
	{
		// If the real subnav isn't already visible
		if (!$("#nav > li.real_active").hasClass("active"))
		{
			$("#nav > li.active").removeClass("active");
			if ($("#nav > li.real_active").length)
			{
				$("#nav > li.real_active").addClass("active");
				$("#subnav ul").stop(true, true).hide().html($("#nav > li.real_active > ul").html());
				if (nav_init) 
					$("#subnav ul").fadeIn(500);
				else
				{
					$("#subnav ul").show();
					nav_init = true;
				}
			}
		}
	}
	else
	{
		$("#nav > li.active").removeClass("active");
		$("#subnav ul").stop(true, true).hide();	
	}
}

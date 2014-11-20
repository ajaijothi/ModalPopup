ModalPopup
==========
<code>
$.modal(title, content, options);
</code>
<br>
<code>
$.aside(title, content, options);
</code>
<h3>Options</h3>

<pre>
        width (default:500)
        height (default:500)
        fullscreen (make the popup fullscreen on open - accepts boolean, default: false)
        disableFullscreen (enable/disabled fullscreen button - accepts boolean, default: false)
        resizable (enable/disable window resize option, default :true)
        movable (enable/disable draggable option, default:true)
        reload (enable/disable reload option, default:true)
        type (iframe, html, default:''),
        name (window name, default:'')
        animate (enable/disable animation)
</pre>

<h3>External Methods</h3>
<pre>

//example
var popup = $.modal('title','http://ownmycode.blogspot.in',{type:'iframe'});

External methods/options
-------------------------

popup.name = 'some name'
popup.close();
popup.reload();
popup.toggleFullScreen();
popup.setContent(content);
popup.makeCenter();
popup.options(optionName, value);

</pre>

<h2><a href="http://jsfiddle.net/ajai/4ud8dkhf/" target="_blank">Demo</a></h2>

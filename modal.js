(function ($, window, undefined) {
    'use strict';
    
    if (!window.glams)
        window.glams = {};
    if (!window.glams.modal)
        window.glams.modal = [];
    
    window.glams.modal = {
        _popup: [],
        getAll: function(){
            return window.glams.modal._popup;
        },
        getByName: function(name){
            var _m = [];
            $.each(window.glams.modal._popup, function(i, p){
                if(p.name == name)
                    _m.push(p);
            });
            return _m;
        },
        insert: function(popup){
            return window.glams.modal._popup.push(popup);
        },
        remove: function(modal){
            var index = $.inArray(modal, window.glams.modal._popup);
            if(index>=0){
                window.glams.modal._popup.splice(index,1);
                return true;
            }
            return false;
        }
    }
    
    $.modal = function (title, content, options) {
        var _options = options || {};
            title = title || '',
            _options.width = _options.width || 500,
            _options.height = _options.height || 500,
            _options.fullscreen = (typeof _options.fullscreen == 'boolean')?_options.fullscreen:false,
            _options.disableFullscreen = (typeof _options.disableFullscreen == 'boolean')?_options.disableFullscreen:false,
            _options.resizable = (typeof _options.resizable == 'boolean')?_options.resizable:!_options.disableFullscreen,
            _options.movable = (typeof _options.movable == 'boolean')?_options.movable:true,
            _options.reload = (typeof _options.reload == 'boolean')?_options.reload:true,
            _options.type = _options.type || '',
            _options.name = _options.name || '';
            _options.animate = (typeof _options.animate == 'boolean')?_options.animate:true;
                
            var _fullscreen = _options.fullscreen,
            _template = ['<div class="_modal-wrapper _animate">',
                            '<div class="_modal">',
                                '<div class="_modal-title">',
                                    '<span class="_title">'+title+'</span>',
                                    '<div class="_icons">',
                            	       '<i class="fa fa-refresh _reload"></i>',
                                       '<i class="_toggle fa"></i>',
                                        '<i class="fa fa-times _close"></i>',
                                    '</div>',
                                '</div>',                                
                                '<div class="_modal-body"></div>',                
                            '</div>',
                        '</div>'].join(''),

            _modal = $(_template),
            _alert = _modal.find('._modal'),
            _body = _modal.find('._modal-body'),
            _header = _modal.find('._modal-title'),
            _title = _header.find('._title'),
            _close = _header.find('._close'),
            _reload =  _header.find('._reload'),
            _fullscreenToggler = _header.find('._toggle');
        
        function loadContent(){
            _body.html('');
            _modal.removeClass('iframe');
            if(_options.type == 'iframe'){
                var iframe = $('<iframe frameborder="0"/>');
                var loader = $('<div class="gif-loader" />');
                loader.appendTo(_body);
                iframe.attr('src', content);
                
                _body.append(iframe);
                _modal.addClass('iframe');
                iframe.on('load', function(){
                    loader.remove();
                });
            }
            else{  
                _options.reload = false;
                _body.append(content);
            }            
        }
        
        function setSize(width, height){
            _alert.width(width);
            _alert.height(height);
        }
        
        function initFullScreen(){
            _modal.removeClass('_fullscreen');
            _fullscreenToggler.removeClass('fa-compress');
            _fullscreenToggler.removeClass('fa-expand');
            if(!_options.fullscreen){                        
                _fullscreenToggler.addClass('fa-expand');            
            }
            else{
                _modal.addClass('_fullscreen');
                _fullscreenToggler.addClass('fa-compress');            
            }
            
            _header.on('dblclick', function(e){
                ExternalMethods.toggleFullScreen()
            });
            
            if(_options.disableFullscreen){
                _fullscreenToggler.hide();
            }
            else{
                _fullscreenToggler.show();
            }
        }
        
        function initResizable(){
            _alert.resizable({
                containment: "parent",
                minHeight: _options.height,
                minWidth: _options.width
            }).on('resize', function (e) {
                e.stopPropagation(); 
            });
            
            _alert.resizable("option", "disabled", !_options.resizable);
            if(!_options.resizable){
                _fullscreenToggler.hide();
            }else{
                _fullscreenToggler.show();
            }
        }
        
        function initReload(){
            if(_options.reload)
                _reload.show();
            else
                _reload.hide();
        }
        
        function initMovable(){
            _alert.draggable({
                containment: "parent",
                handle: '._modal-title',
                cancel: '.fa'
            });
            _alert.draggable( "option", "disabled", !_options.movable);
        }
        
        function makeCenter(){
            var top = ($(window).height() - _options.height)/2,
                left = ($(window).width() - _options.width)/2;
            
            top = top<0?0:top;
            left = left<0?0:left;
            
            _alert.css('left', left);
            _alert.css('top', top);
            
        };
        
        function setOptions(option, value){
            
            switch(option){
                    case 'fullscreen':
                        _options.fullscreen = (typeof value == 'boolean')?value:_options.fullscreen;
                        _fullscreen = _options.fullscreen;
                        initFullScreen();
                    break;
                    case 'width':
                        _options.width = value || _options.width;
                        setSize(_options.width, _options.height);
                    break;
                    case 'height':
                        _options.height = value || _options.height;
                        setSize(_options.width, _options.height);
                    break;
                    case 'resizable':
                        _options.resizable = (typeof value == 'boolean')?value:_options.resizable;
                        initResizable();                        
                    break;
                    case 'movable':
                        _options.movable = (typeof value == 'boolean')?value:_options.movable;
                        initMovable();
                    break;
                    case 'reload':
                        _options.reload = (typeof value == 'boolean')?value:_options.reload;
                        initReload();
                    break;
                    case 'disableFullscreen':
                        _options.disableFullscreen = (typeof value == 'boolean')?value:_options.disableFullscreen;
                        initFullScreen();
                    break;
                    case 'type':
                        _options.type = value || _options.type;
                        ExternalMethods.reload();
                    break;
            }
        }
        
        function initEvents(){
            _fullscreenToggler.on('click', function(e){
                e.preventDefault();
                e.stopPropagation();
                ExternalMethods.toggleFullScreen();
            }).on('dblclick', function(e){
                e.stopPropagation();
                e.preventDefault();
            });
            
            _close.on('click', function(e){
                e.preventDefault();
                e.stopPropagation();
                ExternalMethods.close();
            }).on('dblclick', function(e){
                e.stopPropagation();
                e.preventDefault();
            });
            
            _reload.on('click', function(e){
                e.preventDefault();
                e.stopPropagation();
                ExternalMethods.reload();
            }).on('dblclick', function(e){
                e.stopPropagation();
                e.preventDefault();
            });            
            
            
            $(window).on('resize', function(){
                if(_modal.makeCenter)
                    _modal.makeCenter();
            });
            
            initMovable();
            initFullScreen();
            initResizable();
            initReload()
            makeCenter();
        }
        
        function initModalWindow(){
            loadContent();
            if(!_options.animate){
                _modal.removeClass('_animate');
            }
            _modal.appendTo('body');
            setSize(_options.width, _options.height);
            
            window.glams.modal.insert(_modal);

        }
        
        function initExternalMethods(){
            for(var k in ExternalMethods){
                _modal[k] = ExternalMethods[k];
            }
        }
        
        var ExternalMethods = {
            name: _options.name,
            close : function () {                
                if(_modal.triggerHandler('close')!=false){
                    window.glams.modal.remove(_modal);
                    _modal.remove();                    
                }
            },
            reload: function(){
                loadContent();
            },
            toggleFullScreen: function(){
                if(!_options.disableFullscreen && _options.resizable){
                    _fullscreen = !_fullscreen;
                    _fullscreenToggler.removeClass('fa-compress');
                    _fullscreenToggler.removeClass('fa-expand');
                    if(!_fullscreen){
                        _modal.removeClass('_fullscreen');
                        _fullscreenToggler.addClass('fa-expand');
                    }
                    else{
                        _modal.addClass('_fullscreen');
                        _fullscreenToggler.addClass('fa-compress');
                    }
                    
                }
            },
            setContent: function(_content){
                content = _content;
                ExternalMethods.reload();
            },
            makeCenter: function(){
                makeCenter();
            },
            options: function(option, value){
                if(typeof option == 'string'){
                    setOptions(option, value);                    
                }
                else if(typeof option == 'object'){
                    for(var o in option){
                        setOptions(o, option[o]);
                    }
                }
            }
        };
        
        (function init(){            
            initModalWindow();
            initEvents();
            initExternalMethods();
            _modal.removeClass('_animate');
        })();
        
        return _modal;
    };
    
    
    $.aside = function(title, content, options){
        var _options = options || {};
            title = title || '',
            _options.width = _options.width || 350,
            _options.height = _options.height || '100%',
            _options.fullscreen = false,
            _options.disableFullscreen = true,
            _options.resizable = false,
            _options.movable = false,
            _options.reload = (typeof _options.reload == 'boolean')?_options.reload:true,
            _options.type = _options.type || '',
            _options.name = _options.name || '',
            _options.animate = false,
            _options.position = _options.position || 'right';
        
            var _modal = $.modal(title, content,_options),
                _animationObj = {},
                _window = _modal.find('._modal');
                
            _window.removeAttr('style');        
            _modal.addClass('_aside').addClass('_'+_options.position);
                                
            _animationObj[_options.position] = 0;
            _window.animate(_animationObj, 500,'easeOutExpo');
        
            delete _modal['makeCenter'];
            delete _modal['options'];
            delete _modal['toggleFullScreen'];
            return _modal;
    };
})(jQuery, window);

var __included__ = {};
var __src_path__ = '/src';

function include( pack ) {
    if ( __included__[ pack ] ) {
        return;
    }

    __included__[ pack ] = 1;
    baidu.ajax.request( __src_path__ + '/' + pack.replace( /\./g, '/' ) + '.js?' + (new Date().getTime()),
        {
            method: 'get',
            async: false,
            onsuccess: function ( xhr ) {
                var text = xhr.responseText;
                var lines = text.split( /\r?\n/ );
                
                for ( var i = 0, len = lines.length; i < len; i++ ) {
                    var line = lines[ i ];
                    if ( /^\/\/\/\s*import\s+([^;]+)\s*;\s*$/.test( line ) ) {
                        var depend = RegExp.$1;
                        if ( depend.indexOf( 'baidu.' ) === 0 || depend.indexOf('js.') === 0 ) {
                            continue;
                        }

                        if (depend == 'esui.lib') {
                            include(depend);
                            include(window.baidu ? 'esui.~lib.tangram' : 'esui.~lib.jslib');
                            continue;
                        }

                        var dotIndex = depend.indexOf( '.' );
                        
                        while ( dotIndex > 0 ) {
                            include( depend.substr( 0, dotIndex ) );
                            dotIndex = depend.indexOf( '.', dotIndex + 1 );
                        }

                        include( depend );
                    }
                }
                
                try {
                    if ( window.execScript ) {    // IE Chrome
                        window.execScript( text );
                    } else {  
                        var ss = document.getElementsByTagName( 'script' );
                        var s = document.createElement( "script" );
                        s.type = "text/javascript";
                        s.appendChild( document.createTextNode( text ) );
                        ss[ ss.length - 1 ].parentNode.appendChild( s );
                        s = null;
                    }
                } catch ( ex ) {
                    throw new error( "parse error: " + pack );
                }
            },

            onfailure: new Function()
        });

    
}
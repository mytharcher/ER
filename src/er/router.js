/*
 * ER (Enterprise RIA)
 * Copyright 2010 Baidu Inc. All rights reserved.
 * 
 * path:    er/router.js
 * desc:    路由器
 * author:  erik
 */

///import er;

er.router = function () {
    var routers = [];

    function router( loc ) {
        var i, len, item, rule, func, matches;

        var found = find(loc);
        switch (typeof found) {
            case 'string':
                er.locator.redirect( found );
                break;

            case 'object':
                found.func.apply( this, found.params );
                break;

            default:
                break;
        }

        return;
    }

    function find (loc) {
        var ret;

        for ( i = 0, len = routers.length; i < len; i++ ) {
            item = routers[ i ];
            rule = item.loc;
            func = item.func;

            if ( rule instanceof RegExp
                 && ( matches = loc.match(rule) ) !== null
            ) {
                if (!(ret = authorize(matches[1]))) {
                    ret = {
                        func: func,
                        params: matches
                    };
                }
                break;

            } else if ( typeof rule == 'string' 
                        && rule == loc
            ) {
                ret = {
                    func: func,
                    params: [loc]
                };
                break;
            }
        }

        return ret;
    }

    router.add = function ( rule, func ) {
        routers.push( {
            loc  : rule,
            func : func
        } );
    };


    
    var authorizers = [];
    
    /**
     * 权限验证
     *
     * @inner
     * @return {string} 验证失败时验证器返回转向地址
     */
    function authorize( path ) {
        var i = 0;
        var len = authorizers.length;
        var loc;

        for ( ; i < len; i++ ) {
            loc = authorizers[ i ]( path );
            if ( loc ) {
                return loc;
            }
        }
        return null;
    }

    /**
     * 增加权限验证器
     *
     * @public
     * @param {Function} authorizer 验证器，验证失败时验证器返回转向地址
     */
    router.addAuthorizer = function ( authorizer ) {
        if ( 'function' == typeof authorizer ) {
            authorizers.push( authorizer );
        }
    };

    return router;
}();

///import er.locator;

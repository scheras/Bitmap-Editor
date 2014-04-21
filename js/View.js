/**
 * 
 * @class beView
 * @author Šimon Schierreich <simon+BitmapEditor@scheras.eu>
 * @description Třída má za úkol předat řízení správnému zobrazovacímu modulu.
 * @since 0.5
 * 
 */
function beView () {
    
    /**
     * 
     * @author Šimon Schierreich <simon+BitmapEditor@scheras.eu>
     * @description Seznam dostupných modulů.
     * @memberOf beView
     * @since 0.5
     * @type Array
     * 
     * 
     */
    var views = new Array();
    
    /**
     * 
     * @author Šimon Schierreich <simon+BitmapEditor@scheras.eu>
     * @description Stará se pouze o předání řízení správnému modulu.
     * @memberOf beView
     * @since 0.5
     * @param {Array} imageData Obrazová data.
     * @param {String} to Cílový formát a zároveň název modulu, který bude na zpracování dat použit.
     * 
     * 
     */
    this.displayData = function ( imageData, to ) {
        
        to = to.toUpperCase();
        
        be( beLoader.settings.errorElement ).css( 'visibility', 'hidden' );
        
        if ( to in views ) {
            
            var view = new views[ to ];
            
            view.displayData( imageData );
            be( beLoader.settings.imageDisplayElement ).load();
            
        }
        else {
            View.displayError( "Požadovaný zobrazovací modul neexistuje." );
        }
        
    };
    
    /**
     * 
     * @author Šimon Schierreich <simon+BitmapEditor@scheras.eu>
     * @description Stará se o předání řízení správnému modulu v případě, že je potřeba převzít nějaká data z aplikace.
     * @memberOf beView
     * @since 0.6
     * @param {String} viewName Jméno aktivního zobrazovacího modulu, který by se také měl postarat o převzetí dat.
     * @param {Object} image Objekt HTML elementu obsahující obrázek.
     * @return {Uint8Array}
     * 
     * 
     */
    this.assumeData = function ( viewName, image ) {
        
        viewName = viewName.toUpperCase();
        
        if ( viewName in views ) {
            
            var view = new views[ viewName ];
            return view.assumeData( image );
            
        }
        
    };
    
    /**
     * 
     * @author Šimon Schierreich <simon+BitmapEditor@scheras.eu>
     * @description Zaregistruje view, kterému v případě potřeby bude možno předat řízení nad zobrazováním.
     * @memberOf beView
     * @since 0.5
     * @param {String} viewName Jméno modulu, který chceme zaregistrovat.
     * @param {Object} viewObject Objekt modulu, který chceme zaregistrovat.
     * 
     * 
     */
    this.registerView = function ( viewName, viewObject ) {
        
        var sanitizedViewName = viewName.replace( /[^A-Z0-9.]/g, '' ).substr( 0, 5 );
        
        if ( views.indexOf( sanitizedViewName ) === -1 && sanitizedViewName.length > 0 ) {
            
            views[ sanitizedViewName ] = viewObject;
            
        }
        
    };
    
    /**
     * 
     * @author Šimon Schierreich
     * @description Stará se o zobrazení chyb.
     * @memberOf beView
     * @since 0.7
     * @param {String} error Text chyby, který se zobrazí na hlavní obrazovce.
     * 
     * 
     */
    this.displayError = function ( error ) {
        
        be( beLoader.settings.errorElement ).text( error ).css( 'visibility', 'inherit' );
        
    };
}


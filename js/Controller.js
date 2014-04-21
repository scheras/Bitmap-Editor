/**
 * 
 * @class beController
 * @author Šimon Schierreich <simon+BitmapEditor@scheras.eu>
 * @description Třída se stará o kontrolu hlavní obrazovky a uživatelských akcí.
 * @since 0.5
 * 
 */
function beController() {
    
    /**
     * 
     * @author Šimon Schierreich <simon+BitmapEditor@scheras.eu>
     * @description Uchává informaci o aktuálním zobrazovacím modulu
     * @memberOf beController
     * @since 1.0
     * @type String
     * 
     */
    beController.prototype.view = beLoader.settings.view;
    
    /**
     * 
     * @author Šimon Schierreich <simon+BitmapEditor@scheras.eu>
     * @description Metoda je nahrazována kontrolery modulů.
     * @memberOf beController
     * @since 0.7
     * 
     * 
     */
    beController.prototype.activeController = function(){};
    
    /**
     * 
     * @author Šimon Schierreich <simon+BitmapEditor@scheras.eu>
     * @description Metoda je nahrazována zvýrazňovačem syntaxe modulů.
     * @memberOf beController
     * @since 0.9
     * 
     * 
     */
    beController.prototype.activeHighlighter = function(){};
    
    /**
     * 
     * @author Šimon Schierreich <simon+BitmapEditor@scheras.eu>
     * @description Akce při změně binárních dat.
     * @memberOf beController
     * @since 1.0
     * 
     * @todo - Přebírat View z url.
     * 
     */
    beController.prototype.binaryChanged = function(){
        var string = be( beLoader.settings.binaryDisplayElement ).text().replace( /[^0|1.]/g, '');
        var arraySize = Math.ceil( string.length / 8 );
        var binData = new Uint8Array( arraySize );
        for ( var i = 0; i <= arraySize; i++ ) {
            binData[ i ] = parseInt( string.substr( ( i * 8 ), 8  ), 2 );
        }
        var from = be( 'input[name=inputFormat]:checked' ).val().toUpperCase();
        var to = be( 'input[name=outputFormat]:checked' ).val().toUpperCase();
        Model.convertData( binData, from, to, Controller.view );
    };
    
    /**
     * 
     * @author Šimon Schierreich <simon+BitmapEditor@scheras.eu>
     * @description Akce při změně obrázku.
     * @memberOf beController
     * @since 1.0
     * 
     */
    beController.prototype.imageChanged = function() {
        
        var output = be( beLoader.settings.imageDisplayElement );
        
        var binData = View.assumeData( output.data( 'view' ), output.children() );
        
        var to = be( 'input[name=inputFormat]:checked' ).val().toUpperCase();
        var from = be( 'input[name=outputFormat]:checked' ).val().toUpperCase();
        Model.convertData( binData, from, to );
    };
    
}

var be = jQuery.noConflict();

be( document ).ready( function() {
    
    beLoader.start();
    
    be( beLoader.settings.binaryDisplayElement ).on( 'focusout', function() {
        Controller.activeHighlighter();
    });
    
    be( beLoader.settings.binaryDisplayElement ).on( 'keyup paste change focus', function( event ) {
            Controller.binaryChanged();
    });
    
    be( beLoader.settings.imageDisplayElement ).on( 'load', function() {
        Controller.activeController();
    });
    
    be( beLoader.settings.outputSettingsElement ).on( 'change click', function() {
        be( beLoader.settings.imageDisplayElement ).click();
    });
    
    be( beLoader.settings.imageDisplayElement ).on( 'click', function() {  
        Controller.imageChanged();
        Controller.activeController();
        Controller.activeHighlighter();
    });
});
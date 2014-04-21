/**
 * 
 * @namespace
 * 
 */
var beLoader = {
    
    /**
     * 
     * @author Šimon Schierreich <simon+BitmapEditor@scheras.eu>
     * @description Objekt ochovávající všechny nastavení aplikace.
     * @memberOf beLoader
     * @since 0.8
     * @type Object
     * 
     * 
     */
    settings: {
        'imageDisplayElement'   : '#output-data',
        'binaryDisplayElement'  : '#input-data',
        'outputSettingsElement' : '#output-settings',
        'errorElement'          : '#error',
        'view'                  : 'table'
    },
    
    /**
     * 
     * @author Šimon Schierreich <simon+BitmapEditor@scheras.eu>
     * @description Funkce se stará o spuštění celé aplikace. Konkrétně zaregistruje všechny moduly a vytvoří instance potřebných tříd.
     * @memberOf beLoader
     * @since 0.5
     * 
     * 
     */
    start: function() {
        Controller = new beController();
        Model = new beModel();
        View = new beView();
        
        this.findModules();
        
        be( this.settings.outputSettingsElement + ' input' ).eq( 0 ).attr( 'checked', 'checked' );    
        Controller.binaryChanged();
        Controller.activeController();
        Controller.activeHighlighter();
        
    },
    
    /**
     * 
     * @author Šimon Schiereich <simon+BitmapEditor@scheras.eu>
     * @description Funkce vyhledávající dostupné moduly.
     * @memberOf beLoader
     * @since 0.6
     * 
     * 
     */
    findModules: function() {
        for ( var obj in window ) {
            if ( obj.indexOf( 'beModule' ) === 0 ) {
                var moduleName = obj.substr( 8 );
                Model.registerModule( moduleName.toUpperCase(), window[ obj ] );
                be( this.settings.outputSettingsElement ).html( be( this.settings.outputSettingsElement ).html() + moduleName + ' <input type="radio" name="outputFormat" value="' + moduleName.toLowerCase() +'"> ' );
            }
            else if ( obj.indexOf( 'beView' ) === 0 ) {
                var viewName = obj.substr( 6 );
                View.registerView( viewName.toUpperCase(), window[ obj ] );
            }
        }
    }
    
};



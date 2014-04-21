/**
 *
 * @class beModel
 * @author Šimon Schierreich <simon+BitmapEditor@scheras.eu>
 * @description Třída se stará o předání řízení správnému modulu.
 * @since 0.5
 * 
 */
function beModel () {
    
    /**
     * 
     * @author Šimon Schierreich <simon+BitmapEditor@scheras.eu>
     * @description Seznam dostupných modulů.
     * @memberOf beModel
     * @since 0.5
     * @type Array
     * 
     */
    var modules = new Array();
    
    /**
     * 
     * @author Šimon Schierreich <simon+BitmapEditor@scheras.eu>
     * @description Stará se pouze o předání řízení správnému modulu.
     * @memberOf beModel
     * @since 0.5
     * @param {Uint8Array} binData Obrazová data.
     * @param {String} from Zdrojový formát dat.
     * @param {String} to Cílový formát dat.
     * @param {String} view Zobrazovací modul, který má být použit
     * 
     */
    this.convertData = function ( binData, from, to, view ) {
        
        if ( to in modules ) {
            
            var module = new modules[ to ];
            module.renderBitmap( binData, view );
            
        }
        else if ( from in modules ) {
            
            var module = new modules[ from ];
            module.renderBinaryString( binData );
            
        }
        else {
            View.displayError( "Požadovaný modul neexistuje." );
        }
        
    };
    
    /**
     * 
     * @author Šimon Schierreich <simon+BitmapEditor@scheras.eu>
     * @description Zaregistruje modul, kterému v případě potřeby bude možno předat řízení.
     * @memberOf beModel
     * @since 0.5
     * @param {String} moduleName Jméno modulu. Pod tímto jménem bude následně dostupný.
     * @param {Object} moduleObject Objekt modulu.
     * 
     */
    this.registerModule = function ( moduleName, moduleObject ) {
        
        var sanitizedModuleName = moduleName.replace( /[^A-Z0-9.]/g, '' ).substr( 0, 5 );
        
        if ( modules.indexOf( sanitizedModuleName ) === -1 ) {
            
            modules[ sanitizedModuleName ] = moduleObject;
            
        }
        
    };
    
}
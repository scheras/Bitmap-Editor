/**
 * 
 * @class beViewINPUT
 * @author Šimon Schierreich <simon+BitmapEditor@scheras.eu>
 * @description Třída modulu, který vypisuje binární reprezentaci obrázku do stránky.
 * @since 0.5
 * 
 */
function beViewINPUT () {
    
    /**
     * 
     * @author Šimon Schierreich <simon+BitmapEditor@scheras.eu>
     * @description Stará se o vypsání data na obrazovku.
     * @memberOf beViewINPUT
     * @since 0.2
     * @param {Uint8Array} binData
     * 
     *
     */
    beViewINPUT.prototype.displayData = function ( binData ) {
        
        string = "";
        
        for ( var byte in binData ) {
            
            var bites = "";
            for ( var i = 0; i < 8; i++ ) {
                
                bit = ( ( binData[ byte ] >> i ) & 1 );
                bites += bit;
                
            }
            
            string += bites.split( "" ).reverse().join( "" );
            
        }
        
        be( beLoader.settings.binaryDisplayElement ).text( string );
    };
};
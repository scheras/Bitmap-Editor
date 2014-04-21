/**
 * 
 * @class beViewTABLE
 * @author Šimon Schierreich <simon+BitmapEditor@scheras.eu>
 * @description Třída zobrazovací modulu, který zobrazuje obrázek na stránce ve formě tabulky.
 * @since 0.5
 * 
 */
function beViewTABLE () {
    
    /**
     * 
     * @author Šimon Schierreich <simon+BitmapEditor@scheras.eu>
     * @description Metoda displayData se stará o zobrazení obrázku ve formě tabulky na hlavní stránce aplikace.
     * @memberOf beViewTABLE
     * @since 0.5
     * @param {Array} imageData Šířka, výška a samotná bitmapa.
     * 
     * 
     */
    this.displayData = function( imageData ) {
        
        var targetElement = beLoader.settings.imageDisplayElement;
        be( targetElement ).data( 'view', 'table' );
        be( targetElement ).empty();
        
        be( targetElement ).append( '<table data-width="' + imageData['width'][ 0 ] + '" data-height="' + imageData['height'][ 0 ] + '">' );
        be( targetElement + ' table' ).append( '<tbody>' );
        
        for ( var i = 0; i < imageData[ 'bitmap' ].length; i++ ) {
            
            be( targetElement + ' table tbody' ).append( '<tr>' );
            var rowData = imageData[ 'bitmap' ][ i ];
            
            for ( var j = 0; j < rowData.length; j++ ) {
                
                var byte = '';
                
                for ( var k = 0; k < 8; k++ ) {
                    bit = ( ( rowData[ j ] >> k ) & 1 );
                    byte += bit;
                }
                
                byte = byte.split( "" ).reverse().join( "" ).substr( 0, 8 );
                
                if ( j === ( rowData.length - 1 ) ) {
                    for ( var l = 0; l < ( imageData[ 'width' ][ 0 ] % 8 ); l++ ) {
                        be( targetElement + ' table tbody tr:eq(' + i + ')' ).append( '<td>' + byte[ l ] + '</td>' );
                    }
                }
                else {
                    for ( var l = 0; l < 8; l++ ) {
                        be( targetElement + ' table tbody tr:eq(' + i + ')' ).append( '<td>' + byte[ l ] + '</td>' );
                    }
                }
            }
        }
        
    };
    
    /**
     * 
     * @author Šimon Schierreich <simon+BitmapEditor@scheras.eu>
     * @description Přebírá data, která v aplikaci zobrazila metoda displayData, zbavuje je html značek a vytváří z nich binární data.
     * @memberOf beViewTABLE
     * @since 0.7
     * @param {Object} table Objekt tabulky.
     * @returns {Uint8Array}
     * 
     * 
     */
    this.assumeData = function( table ) {
        
        var width = table.data( 'width' );
        var height = table.data( 'height' );
        
        if ( table.data( 'colors' ) === undefined ) {
            var colors = [];
        }
        else {
            var colors = table.data( 'colors' ).split( ';' );
            colors[ 0 ] = colors[ 0 ].split( ',' );
            colors[ 1 ] = colors[ 1 ].split( ',' );
        }
        
        var imageData = table.children( 'tbody' );
        var rows = imageData.children( 'tr' );
        
        var binData = new Uint8Array( ( height * width ) + 2 + ( colors.length * 3 ) );
        binData[ 0 ] = width;
        binData[ 1 ] = height;

        for ( var i = 0; i < colors.length; i++  ) {
            for ( var j = 0; j < 3; j++ ) {
                binData[ 2 + ( i * 3 ) + j ] = colors[ i ][ j ];
            }
        }
        
        for ( var i = 0; i < height; i++ ) {
            for ( var j = 0; j < width; j++ ) {
                binData[ 2 + ( i * width ) + j + ( colors.length * 3 )  ] += rows.eq( i ).children( 'td' ).eq( j ).text();
            }
        }
        
        return binData;
        
    };
    
};
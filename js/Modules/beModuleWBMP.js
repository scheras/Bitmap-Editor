/**
 * 
 * @class beModuleWBMP
 * @author Šimon Schierreich <simon+BitmapEditor@scheras.eu>
 * @description Třída modulu, který dokáže pracovat s formátem WBMP.
 * @since 0.5
 * 
 */
function beModuleWBMP() {
    
    /**
     * 
     * @author Šimon Schierreich <simon+BitmapEditor@scheras.eu>
     * @description Ověřuje, jestli jsou správně uvedeny hlavičky, a připravuje data na zobrazení ve stránce.
     * @memberOf beModuleWBMP
     * @since 0.5
     * @param {Uint8Array} binData Binární data, která by se měl modul pokusit převést do formátu WBMP a prezentovat.
     * @param {String} view Zobrazovací modul, který má být použit
     * 
     */
    this.renderBitmap = function( binData, view ) {
        
        view = view || 'table';
        
        var header = new Uint8Array( 2 );
        header[ 0 ] = binData[ 0 ];
        header[ 1 ] = binData[ 1 ];
        
        var width = new Uint8Array( 1 );
        width[ 0 ] = binData[ 2 ];
        
        var height = new Uint8Array( 1 );
        height[ 0 ] = binData[ 3 ];
        
        var bytesPerRow = Math.ceil( width[ 0 ] / 8 );
        var imageData = new Array();
        var bitmap = [];
        var count = 4;
        for ( var i = 0; i < height[ 0 ]; i++ ) {
            var row = new Uint8Array( bytesPerRow );
            for ( var j = 0; j < bytesPerRow; j++ ){
                row[ j ] = binData[ count ] || 0;
                count++;
            }
            bitmap.push( row );
        }
        imageData['bitmap'] = bitmap;
        imageData['width'] = width;
        imageData['height'] = height;
        
        Controller.activeController = moduleController;
        Controller.activeHighlighter = moduleHighlighter;
        if ( checkMetaData( header, width, height ) ) {
            View.displayData( imageData, view );
        }        
        
    };
    
    /**
     * 
     * @author Šimon Schierreich <simon+BitmapEditor@scheras.eu>
     * @description K obrazovým datům přidá potřebné hlavičky a výsledek pošle na výstup.
     * @memberOf beModuleWBMP
     * @since 0.5
     * @param {Uint8Array} binData Binární data vytvořená z obrázku.
     * 
     */
    this.renderBinaryString = function( binData ) {        
        var result = new Uint8Array( 4 + ( Math.ceil( binData[ 0 ] / 8 ) * binData[ 1 ] )  );
        result[ 2 ] = binData[ 0 ];
        result[ 3 ] = binData[ 1 ];
        
        var bytesPerRow = Math.ceil( result[ 2 ] / 8 );
        
        var nulls = "";
        for ( var i = 0; i < ( 8 - ( result[ 2 ] % 8 ) ); i++ ) {
            nulls += "0";
        }
        
        var imageDataString = "";
        
        for ( var i = 0; i < result[ 3 ]; i++ ) {
            
            var rowData = "";
            
            for ( var j = 0; j < result[ 2 ]; j++ ) {
                rowData += binData[ ( i * result[ 2 ] ) + j + 2 ].toString( 10 );
            }
            rowData = rowData + nulls;
            imageDataString += rowData;
        }
        
        for ( var i = 0; i < ( result[ 3 ] * bytesPerRow ); i++ ) {
            result[ 4 + i ] = parseInt( imageDataString.substr( ( i * 8 ), 8 ), 2 );      
        }
        
        View.displayData( result, 'input' );
        Controller.activeController = moduleController;
        Controller.activeHighlighter = moduleHighlighter;
    };
    
    /**
     * 
     * @author Šimon Schierreich <simon+BitmapEditor@scheras.eu>
     * @description Provádí kontrolu hlaviček a rozměrů.
     * @memberOf beModuleWBMP
     * @since 0.6
     * @param {Uint8Array} header Hlavičky obrázku.
     * @param {Uint8Array} width Šířka obrázku.
     * @param {Uint8Array} height Výška obrázku.
     * @returns {Boolean}
     * 
     */
    var checkMetaData = function( header, width, height ) {
        if ( header[ 0 ] === 0 && header[ 1 ] === 0 ) {
            if ( width[ 0 ] > 0 && height[ 0 ] > 0 ) {
                return true;
            }
            else {
                View.displayError( "Nebyly vloženy rozměry obrázku nebo se jeden z nich rovná nule." );
                return false;
            }
        }
        else {
            View.displayError( "První dva bajty musí mít hodnotu 0." );
            return false;
        }
    };
    
    /**
     * 
     * @author Šimon Schierreich <simon+BitmapEditor@scheras.eu>
     * @description Stará se o správné zobrazení tabulky a o provedení změn při kliknutí na buňku.
     * @memberOf beModuleWBMP
     * @since 0.7
     * 
     */
    var moduleController = function() {
        
        be( 'table' ).removeData( 'colors' );
        
        be( 'td:contains(0)' ).css( 'background-color', 'black'  );
        be( 'td:contains(1)' ).css( 'background-color', 'white'  );
        
        be( 'td:contains(0)' ).on( 'click change', function() {
            be( this ).text( 1 ).css( 'background-color', 'white' );
        });
        be( 'td:contains(1)' ).on( 'click change', function() {
            be( this ).text( 0 ).css( 'background-color', 'black' );
        });
        
    };
    
    /**
     * 
     * @author Šimon Schierreich <simon+BitmapEditor@scheras.eu>
     * @description Zvýrazňování syntaxe formátu WBMP
     * @memberOf beModuleWBMP
     * @since 1.0
     * 
     */
    var moduleHighlighter = function() {
        
        var text = be( beLoader.settings.binaryDisplayElement ).text();
        text = text.replace( /[^0|1.]/g, "");
        var headers = '<span class="headers" contenteditable>' + text.substr( 0, 16 ).replace(/(\d{8})/g, '$1 ').replace(/(^\s+|\s+$)/,'') + '</span> ';
        var proportions = '<span class="proportions" contenteditable>' + text.substr( 16, 16 ).replace(/(\d{8})/g, '$1 ').replace(/(^\s+|\s+$)/,'') + '</span> ';
        var imageData = '<span class="imageData">' + text.substr( 32 ).replace(/(\d{8})/g, '$1 ').replace(/(^\s+|\s+$)/,'') + '</span>';
        be( beLoader.settings.binaryDisplayElement ).html( headers + proportions + imageData );
        
    };
    
};



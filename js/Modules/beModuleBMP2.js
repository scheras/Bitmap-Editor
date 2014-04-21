/**
 * 
 * @class beModuleBMP2
 * @author Šimon Schierreich <simon+BitmapEditor@scheras.eu>
 * @description Třída modulu, který dokáže pracovat s formátem BMP2.
 * @since 0.5
 * 
 */
function beModuleBMP2() {
    
    /**
     * 
     * @author Šimon Schierreich <simon+BitmapEditor@scheras.eu>
     * @description Pole uchovávající aktuálně používané barvy.
     * @memberOf beModuleBMP2
     * @since 0.9
     * @type Array
     * 
     * 
     */
    var colors = [ 
        [ 0, 0, 0 ],
        [ 255, 255, 255 ]
    ];
    
    /**
     * 
     * @author Šimon Schierreich <simon+BitmapEditor@scheras.eu>
     * @description Ověřuje, jestli jsou správně uvedeny hlavičky, a připravuje data na zobrazení ve stránce.
     * @memberOf beModuleBMP2
     * @since 0.5
     * @param {Uint8Array} binData Binární data, která by se měl modul pokusit převést do formátu WBMP a prezentovat.
     * @param {String} view Zobrazovací modul, který má být použit k prezentaci
     * 
     */
    this.renderBitmap = function( binData, view ) {
        
        view = view || 'table';
        
        Controller.activeController = this.moduleController;
        Controller.activeHighlighter = moduleHighlighter;

        var header = new Uint8Array( 54 );
        for ( var i = 0; i < 54; i++ ) {
            header[ i ] = binData[ i ];
        }
        
        var width = new Uint8Array( 1 );
        width[ 0 ] = binData[ 21 ];
        
        var height = new Uint8Array( 1 );
        height[ 0 ] = binData[ 25 ];
        
        colors = new Array();
        colors[ 0 ] = new Uint8Array( 3 );
        colors[ 1 ] = new Uint8Array( 3 );
        for ( var j = 0; j < 3; j++ ) {
            colors[ 0 ][ j ] = binData[ 54 + j ];
        }
        for ( var j = 0; j < 3; j++ ) {
            colors[ 1 ][ j ] = binData[ 58 + j ];
        }
        
        var bytesPerRow = Math.ceil( width[ 0 ] / 8 );
        var imageData = new Array();
        var bitmap = [];
        var count = 62;
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
        
        
        
        if ( checkMetaData( header, width, height ) ) {
            View.displayData( imageData, view );
        }        
        
        
    };
    
    /**
     * 
     * @author Šimon Schierreich <simon+BitmapEditor@scheras.eu>
     * @description K obrazovým datům přidá potřebné hlavičky a výsledek pošle na výstup.
     * @memberOf beModuleBMP2
     * @since 0.5
     * @param {Uint8Array} binData Binární data vytvořená z obrázku.
     * 
     * 
     */
    this.renderBinaryString = function( binData ) {    
        Controller.activeController = this.moduleController;
        Controller.activeHighlighter = moduleHighlighter;
        
        var offset;
        
        if ( binData.length === ( ( binData[ 0 ] * binData[ 1 ] ) + 2 ) ) {
            
            colors[ 0 ] = new Uint8Array( 3 );
            colors[0][0] = 0;
            colors[0][1] = 0;
            colors[0][2] = 0;
            
            colors[ 1 ] = new Uint8Array( 3 );
            colors[1][0] = 255;
            colors[1][1] = 255;
            colors[1][2] = 255;
            
            offset = 2;
            
        }
        else {
            
            colors[ 0 ] = new Uint8Array( 3 );
            colors[0][0] = binData[ 2 ];
            colors[0][1] = binData[ 3 ];
            colors[0][2] = binData[ 4 ];
            
            colors[ 1 ] = new Uint8Array( 3 );
            colors[1][0] = binData[ 5 ];
            colors[1][1] = binData[ 6 ];
            colors[1][2] = binData[ 7 ];
            
            offset = 8;
            
        }
        
        var result = new Uint8Array( 54 + 8 + ( Math.ceil( binData[ 0 ] / 8 ) * binData[ 1 ] ) );
        
        result[ 0 ] = 66;
        result[ 1 ] = 77;
        result[ 13 ] = 62;
        result[ 17 ] = 40;
        
        result[ 21 ] = binData[ 0 ]; 
        result[ 25 ] = binData[ 1 ];
        result[ 27 ] = 1;
        result[ 29 ] = 1;
        
        result[ 54 ] = colors[ 0 ][ 0 ];
        result[ 55 ] = colors[ 0 ][ 1 ];
        result[ 56 ] = colors[ 0 ][ 2 ];
        
        result[ 58 ] = colors[ 1 ][ 0 ];
        result[ 59 ] = colors[ 1 ][ 1 ];
        result[ 60 ] = colors[ 1 ][ 2 ];
        
        var bytesPerRow = Math.ceil( binData[ 0 ] / 8 );
        
        var nulls = "";
        for ( var i = 0; i < ( 8 - ( binData[ 0 ] % 8 ) ); i++ ) {
            nulls += "0";
        }
        
        var imageDataString = "";
        
        for ( var i = 0; i < binData[ 1 ]; i++ ) {
            
            var rowData = "";
            
            for ( var j = 0; j < binData[ 0 ]; j++ ) {
                rowData += binData[ ( i * binData[ 0 ] ) + j + offset ].toString( 10 );
            }
            rowData = rowData + nulls;
            imageDataString += rowData;
        }
        
        for ( var i = 0; i < ( binData[ 1 ] * bytesPerRow ); i++ ) {
            result[ 62 + i ] = parseInt( imageDataString.substr( ( i * 8 ), 8 ), 2 );      
        }
        
        
        
        View.displayData( result, 'input' );
    };
    
    /**
     * 
     * @author Šimon Schierreich <simon+BitmapEditor@scheras.eu>
     * @description Provádí kontrolu hlaviček a rozměrů.
     * @memberOf beModuleBMP2
     * @since 0.6
     * @param {Uint8Array} header Hlavičky obrázku.
     * @param {Uint8Array} width Šířka obrázku.
     * @param {Uint8Array} height Výška obrázku.
     * @returns {Boolean}
     * 
     * 
     */
    var checkMetaData = function( header, width, height ) {
        
        if ( header[ 0 ] === 66 && header[ 1 ] === 77 ) {
            for ( var i = 0; i < 8; i++ ) {
                if ( header[ i + 2 ] !== 0 ) {
                    View.displayError( "Položky bfSize, bfReserved1 a bfReserved2 (dohromady 8 bytů) musí mít hodnotu 0. " );
                    return false;
                }
            }
            if ( header[ 10 ] === 0 && header[ 11 ] === 0 && header[ 12 ] === 0 && header[ 13 ] === 62 ) {
                if ( header[ 14 ] === 0 && header[ 15 ] === 0 && header[ 16 ] === 0 && header[ 17 ] === 40 ){
                    if ( width[ 0 ] > 0 && height[ 0 ] > 0 ) {
                        if ( header[ 26 ] === 0 && header[ 27 ] === 1 ) {
                            if ( header[ 28 ] === 0 && header[ 29 ] === 1 ) {
                                for ( var i = 0; i < 24; i++ ) {
                                    if ( header[ i + 30 ] !== 0 ) {
                                        View.displayError( "Posledních 24 bytů hlavičky obsahuje informace takové, které se dají buď dopočíta, nebo existují z historických důvodů. Nastavíme je tedy všechny na 0." );
                                        return false;
                                    }
                                }
                                return true;
                            }
                            else {
                                View.displayError( "Položka biBitCount (2 byty) obsahuje informaci o počtu bitů na pixel. V našem případě musí mít hodnotu 1." );
                                return false;
                            }
                        }
                        else {
                            View.displayError( "Položka biPlanes (2 byty) existuje z historických důvodů a má vždy hodnotu 1." );
                            return false;
                        }
                    }
                    else {
                        View.displayError( "Rozměry obrázku musí být větší než 0." );
                        return false;
                    }
                }
                else {
                    View.displayError( "Položky biSize (4 byty) musí mít vždy hodnotu 40. " );
                    return false;
                }
            }
            else {
                View.displayError( "Položky bfOffBits (4 byty) udává informaci o posunu obrazových dat od začátku dokumentu. V našem případě je to tedy 62. " );
                return false;
            }
        }
        else {
            View.displayError( "První 2 byty (tzv. bfType) musí mít ASCII hodnotu BM (bin.: 0100001001001101 )." );
            return false;
        }
    };
    
    /**
     * 
     * @author Šimon Schierreich <simon+BitmapEditor@scheras.eu>
     * @description Stará se o správné zobrazení tabulky (barvy) a o provedení změn při kliknutí na buňku.
     * @memberOf beModuleBMP2
     * @since 0.7
     * 
     * 
     */
    this.moduleController = function() {
        
        be( 'td:contains(0)' ).css( 'background-color', 'rgb(' + colors[ 0 ][ 2 ] + ',' + colors[ 0 ][ 1 ] + ',' + colors[ 0 ][ 0 ] +  ')' );
        be( 'td:contains(1)' ).css( 'background-color', 'rgb(' + colors[ 1 ][ 2 ] + ',' + colors[ 1 ][ 1 ] + ',' + colors[ 1 ][ 0 ] +  ')' );
        
        be( 'td:contains(0)' ).on( 'click change', function() {
            be( this ).text( 1 ).css( 'background-color', 'rgb(' + colors[ 1 ][ 2 ] + ',' + colors[ 1 ][ 1 ] + ',' + colors[ 1 ][ 0 ] +  ')' );
        });
        be( 'td:contains(1)' ).on( 'click change', function() {
            be( this ).text( 0 ).css( 'background-color', 'rgb(' + colors[ 0 ][ 2 ] + ',' + colors[ 0 ][ 1 ] + ',' + colors[ 0 ][ 0 ] +  ')' );
        });
        
        be( beLoader.settings.imageDisplayElement + ' table' ).data( 'colors', ( colors[ 0 ][ 0 ] + ',' + colors[ 0 ][ 1 ] + ',' + colors[ 0 ][ 2 ] + ';' + colors[ 1 ][ 0 ] + ',' + colors[ 1 ][ 1 ] + ',' + colors[ 1 ][ 2 ] ) );
        
    };
    
    /**
     * 
     * @author Šimon Schierreich <simon+BitmapEditor@scheras.eu>
     * @description Zvýrazňování syntaxe formátu BMP2
     * @memberOf beModuleBMP2
     * @since 1.0
     * 
     * 
     */
    var moduleHighlighter = function() {
        
        var text = be( beLoader.settings.binaryDisplayElement ).text();
        text = text.replace( /[^0|1.]/g, '');
        var headers1 = '<span class="headers">' + text.substr( 0, ( 18 * 8 ) ).replace(/(\d{8})/g, '$1 ').replace(/(^\s+|\s+$)/,'') + '</span> ';
        var headers2 = '<span class="headers">' + text.substr( ( 18 * 8 ) + ( 8 * 8), ( 28 * 8 ) ).replace(/(\d{8})/g, '$1 ').replace(/(^\s+|\s+$)/,'') + '</span> ';
        var proportions = '<span class="proportions">' + text.substr( ( 18 * 8 ), ( 8 * 8 ) ).replace(/(\d{8})/g, '$1 ').replace(/(^\s+|\s+$)/,'') + '</span> ';
        var colors = '<span class="colors">' + text.substr( ( 18 * 8 ) + ( 8 * 8) + ( 28 * 8 ), ( 8 * 8 ) ).replace(/(\d{8})/g, '$1 ').replace(/(^\s+|\s+$)/,'') + '</span> ';
        var imageData = '<span class="imageData">' + text.substr( ( 18 * 8 ) + ( 2 * ( 8 * 8) ) + ( 28 * 8 ) ).replace(/(\d{8})/g, '$1 ').replace(/(^\s+|\s+$)/,'') + '</span>';
        be( beLoader.settings.binaryDisplayElement ).html( headers1 + proportions + headers2 + colors + imageData );
        
    };
    
};



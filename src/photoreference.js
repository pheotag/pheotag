const fs = require( 'fs' );
const url = require( 'url' );
const path = require( 'path' );
const piexif = require( 'piexifjs' );

/**
 * 
 */
class PhotoReference {

    /**
     * 
     * @param {*} file 
     */
    constructor( file ) {
        this._imageFile = file;
        this._imageEXIF = undefined;
        this.loadEXIF();
    }

    /**
     * 
     * @param {*} sexagesimal 
     */
    _sexagesimal2decimal( sexagesimal ) {
        try {
            let decimal = 0.0;
            // degrees
            if( sexagesimal.length > 0 && sexagesimal[0].length == 2 ) {
                decimal += ( sexagesimal[0][0] / ( 1 * sexagesimal[0][1] ) );
            }
            // minutes
            if( sexagesimal.length > 1 && sexagesimal[1].length == 2 ) {
                decimal += ( sexagesimal[1][0] / ( 60 * sexagesimal[1][1] ) );
            }
            // seconds
            if( sexagesimal.length > 2 && sexagesimal[2].length == 2 ) {
                decimal += ( sexagesimal[2][0] / ( 3600 * sexagesimal[2][1] ) );
            }
            return decimal;
        } catch( e ) {
            //console.warn( e );
            return Number.NaN;
        }
    }

    /**
     * 
     * @param {*} decimal 
     */
    _decimal2sexagesimal( decimal ) {
        try {
            let sexagesimal = [
                [0, 1],
                [0, 1],
                [0, 100]
            ];
            let sign = ( decimal < 0.0 ? -1 : 1 );
            let residual = sign * decimal;
            // degrees
            sexagesimal[0][0] = Math.floor( 1 * residual * sexagesimal[0][1] );
            residual -= sexagesimal[0][0] / sexagesimal[0][1] / 1;
            // minutes
            sexagesimal[1][0] = Math.floor( 60 * residual * sexagesimal[1][1] );
            residual -= sexagesimal[1][0] / sexagesimal[1][1] / 60;
            // seconds
            sexagesimal[2][0] = Math.round( 3600 * residual * sexagesimal[2][1] );
            residual -= sexagesimal[2][0] / sexagesimal[2][1] / 3600;
            return sexagesimal;
        } catch( e ) {
            //console.warn( e );
            return undefined;
        }
    }

    /**
     * 
     */
    loadEXIF() {
        try {
            let jpeg = fs.readFileSync( this._imageFile );
            let data = jpeg.toString( 'binary' );
            this._imageEXIF = piexif.load( data );
        } catch( e ) {
            console.error( e );
        }
    }

    /**
     * 
     */
    saveEXIF() {
        try {
            let jpeg = fs.readFileSync( this._imageFile );
            let data = jpeg.toString( 'binary' );
            var exifbytes = piexif.dump( this._imageEXIF );
            var newData = piexif.insert( exifbytes, data );
            var newJpeg = new Buffer( newData, 'binary' );
            fs.writeFileSync( this._imageFile, newJpeg );
        } catch( e ) {
            console.error( e );
        }
    }

    /**
     * 
     * @param {*} ifd 
     * @param {*} index 
     */
    _date( ifd, index ) {
        try {
            if( !this._imageEXIF || !this._imageEXIF[ifd] ) {
                return undefined;
            }
            let dateTime = this._imageEXIF[ifd][index].split( ' ' );
            return ( dateTime ? dateTime[0].split( ':' ).join( '-' ) : undefined );
        } catch( e ) {
            //console.warn( e );
            return undefined;
        }
    }

    /**
     * 
     * @param {*} ifd 
     * @param {*} index 
     */
    _time( ifd, index ) {
        try {
            if( !this._imageEXIF || !this._imageEXIF[ifd] ) {
                return undefined;
            }
            let dateTime = this._imageEXIF[ifd][index].split( ' ' );
            return ( dateTime ? dateTime[1] : undefined );
        } catch( e ) {
            //console.warn( e );
            return undefined;
        }
    }

    /**
     * 
     */
    get uri() {
        try {
            return url.format( {
                pathname: this._imageFile,
                protocol: 'file:',
                slashes: true
            } );
        } catch( e ) {
            //console.warn( e );
            return undefined;
        }
    }

    /**
     * 
     */
    get date() {
        try {
            return this._date( '0th', piexif.ImageIFD.DateTime );
        } catch( e ) {
            //console.warn( e );
            return undefined;
        }
    }

    /**
     * 
     */
    get time() {
        try {
            return this._time( '0th', piexif.ImageIFD.DateTime );
        } catch( e ) {
            //console.warn( e );
            return undefined;
        }
    }

    /**
     * 
     */
    get dateOriginal() {
        try {
            return this._date( 'Exif', piexif.ExifIFD.DateTimeOriginal );
        } catch( e ) {
            //console.warn( e );
            return undefined;
        }
    }

    /**
     * 
     */
    get timeOriginal() {
        try {
            return this._time( 'Exif', piexif.ExifIFD.DateTimeOriginal );
        } catch( e ) {
            //console.warn( e );
            return undefined;
        }
    }

    /**
     * The latitude from EXIF data in decimal degrees.
     * Positive latitude is north and negative latitude is south.
     */
    get latitude() {
        try {
            if( !this._imageEXIF ) {
                throw new Error( 'EXIF data missing!' );
            }
            if( !this._imageEXIF['GPS'] ) {
                throw new Error( 'GPS data missing!' );
            }
            let sign = ( this._imageEXIF['GPS'][piexif.GPSIFD.GPSLatitudeRef] === 'N' ? 1 : -1 );
            let sexagesimal = this._imageEXIF['GPS'][piexif.GPSIFD.GPSLatitude];
            return ( sign * this._sexagesimal2decimal( sexagesimal ) );
        } catch( e ) {
            //console.warn( e );
            return undefined;
        }
    }

    /**
     * 
     */
    set latitude( value ) {
        try {
            if( !this._imageEXIF ) {
                return;
            }
            this._imageEXIF['GPS'][piexif.GPSIFD.GPSLatitudeRef] = ( value < 0 ? 'S' : 'N' );
            this._imageEXIF['GPS'][piexif.GPSIFD.GPSLatitude] = this._decimal2sexagesimal( value );
        } catch( e ) {
            console.error( e );
        }
    }

    /**
     * The longitude from EXIF data in decimal degrees.
     * Positive longitude is east and negative longitude is west.
     */
    get longitude() {
        try {
            if( !this._imageEXIF ) {
                throw new Error( 'EXIF data missing!' );
            }
            if( !this._imageEXIF['GPS'] ) {
                throw new Error( 'GPS data missing!' );
            }
            let sign = ( this._imageEXIF['GPS'][piexif.GPSIFD.GPSLongitudeRef] === 'E' ? 1 : -1 );
            let sexagesimal = this._imageEXIF['GPS'][piexif.GPSIFD.GPSLongitude];
            return ( sign * this._sexagesimal2decimal( sexagesimal ) );
        } catch( e ) {
            //console.warn( e );
            return undefined;
        }
    }

    /**
     * 
     */
    set longitude( value ) {
        try {
            if( !this._imageEXIF ) {
                return;
            }
            this._imageEXIF['GPS'][piexif.GPSIFD.GPSLongitudeRef] = ( value < 0 ? 'W' : 'E' );
            this._imageEXIF['GPS'][piexif.GPSIFD.GPSLongitude] = this._decimal2sexagesimal( value );
        } catch( e ) {
            console.error( e );
        }
    }

    /**
     * The altitude from EXIF data in decimal meters.
     * Positive altitude is above sea level and negative altitude is below sea level.
     */
    get altitude() {
        try {
            if( !this._imageEXIF ) {
                throw new Error( 'EXIF data missing!' );
            }
            if( !this._imageEXIF['GPS'] ) {
                throw new Error( 'GPS data missing!' );
            }
            let sign = ( this._imageEXIF['GPS'][piexif.GPSIFD.GPSAltitudeRef] === 0 ? 1 : -1 );
            let rational = this._imageEXIF['GPS'][piexif.GPSIFD.GPSAltitude];
            return ( sign * rational[0] / rational[1] );
        } catch( e ) {
            //console.warn( e );
            return undefined;
        }
    }

    /**
     *
     */
    set altitude( value ) {
        try {
            if( !this._imageEXIF ) {
                return;
            }
            this._imageEXIF['GPS'][piexif.GPSIFD.GPSAltitudeRef] = ( value < 0 ? 1 : 0 );
            this._imageEXIF['GPS'][piexif.GPSIFD.GPSAltitude] = [
                Math.round( value ),
                1
            ];
        } catch( e ) {
            console.error( e );
        }
    }
}

module.exports = PhotoReference;
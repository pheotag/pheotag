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
            let bytes = fs.readFileSync( this._imageFile, 'binary' );
            this._imageEXIF = piexif.load( bytes );
        } catch( e ) {
            console.error( e );
        }
    }

    /**
     * 
     */
    saveEXIF() {
        try {
            let bytes = fs.readFileSync( this._imageFile, 'binary' );
            let exif = piexif.dump( this._imageEXIF );
            bytes = piexif.insert( exif, bytes );
            fs.writeFileSync( this._imageFile, bytes, 'binary' );
        } catch( e ) {
            console.error( e );
        }
    }

    /**
     * 
     */
    get orientation() {
        try {
            return this._imageEXIF['0th'][piexif.ImageIFD.Orientation];
        } catch( e ) {
            return undefined;
        }
    }

    /**
     * 
     * @param {*} ifd 
     * @param {*} index 
     */
    _exif2date( value) {
        let dateTime = value.replace( ':', '-' ).replace( ':', '-' ).replace( ' ', 'T' );
        return ( new Date( dateTime ) );
    }

    /**
     * 
     * @param {*} ifd 
     * @param {*} index 
     */
    _date2exif( value ) {
        let dateTime = value.toISOString().substring( 0, 19 );
        return dateTime.replace( '-', ':' ).replace( '-', ':' ).replace( 'T', ' ' );
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
            return undefined;
        }
    }

    /**
     * 
     */
    get dateTime() {
        try {
            return this._exif2date( this._imageEXIF['0th'][piexif.ImageIFD.DateTime] );
        } catch( e ) {
            return undefined;
        }
    }

    /**
     * 
     */
    set dateTime( value ) {
        try {
            this._imageEXIF['0th'][piexif.ImageIFD.DateTime] = this._date2exif( value );
        } catch( e ) {
            console.error( e );
        }
    }

    /**
     * 
     */
    get dateTimeOriginal() {
        try {
            return this._exif2date( this._imageEXIF['Exif'][piexif.ExifIFD.DateTimeOriginal] );
        } catch( e ) {
            return undefined;
        }
    }

    /**
     * 
     */
    set dateTimeOriginal( value ) {
        try {
            this._imageEXIF['Exif'][piexif.ExifIFD.DateTimeOriginal] = this._date2exif( value );
        } catch( e ) {
            console.error( e );
        }
    }

    /**
     * The latitude from EXIF data in decimal degrees.
     * Positive latitude is north and negative latitude is south.
     */
    get latitude() {
        try {
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
            let sign = ( this._imageEXIF['GPS'][piexif.GPSIFD.GPSLongitudeRef] === 'E' ? 1 : -1 );
            let sexagesimal = this._imageEXIF['GPS'][piexif.GPSIFD.GPSLongitude];
            return ( sign * this._sexagesimal2decimal( sexagesimal ) );
        } catch( e ) {
            return undefined;
        }
    }

    /**
     * 
     */
    set longitude( value ) {
        try {
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
            let sign = ( this._imageEXIF['GPS'][piexif.GPSIFD.GPSAltitudeRef] === 0 ? 1 : -1 );
            let rational = this._imageEXIF['GPS'][piexif.GPSIFD.GPSAltitude];
            return ( sign * rational[0] / rational[1] );
        } catch( e ) {
            return undefined;
        }
    }

    /**
     *
     */
    set altitude( value ) {
        try {
            this._imageEXIF['GPS'][piexif.GPSIFD.GPSAltitudeRef] = ( value < 0 ? 1 : 0 );
            this._imageEXIF['GPS'][piexif.GPSIFD.GPSAltitude] = [ Math.round( value ), 1 ];
        } catch( e ) {
            console.error( e );
        }
    }
}

module.exports = PhotoReference;
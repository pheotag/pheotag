const fs = require( 'fs' );
const url = require( 'url' );
const path = require( 'path' );
const piexif = require( 'xml2js' );

/**
 * 
 */
class GeoFile {

    /**
     * 
     */
    constructor() {
        this.waypoints = [];
    }

    /**
     * 
     */
    importGEO( file ) {
        try {
            console.log( 'TODO: import file ...', file );
            if( file.toLowerCase().endsWith( '.gpx' ) ) {
                this._importGPX( file );
                return;
            }
            if( file.toLowerCase().endsWith( '.kml' ) ) {
                this._importGPX( file );
                return;
            }
            throw new Error( 'Unsupported file format!' );
        } catch( e ) {
            console.error( e );
            throw e;
        }
    }

    /**
     * 
     */
    _importGPX( gpx ) {
        try {
            console.log( 'TODO: import GPX ...', gpx );
            this.waypoints = [
                {
                    title: 'A',
                    description: 'aaa',
                    time: new Date(),
                    timezone: undefined,
                    latitude: 1.234567,
                    longitude: 7.654321,
                    altitude: 0.0,
                    link: 'DSC0001.jpg'
                },
                {
                    title: 'Z',
                    description: 'zzz',
                    time: new Date(),
                    timezone: undefined,
                    latitude: 1.234567,
                    longitude: 7.654321,
                    altitude: 0.0,
                    link: ''
                }
            ];
        } catch( e ) {
            console.error( e );
        }
    }

    /**
     * 
     */
    _importKML( kml ) {
        try {
            console.log( 'TODO: import KML ...', kml );
        } catch( e ) {
            console.error( e );
        }
    }

    /**
     * 
     */
    exportGEO( file ) {
        try {
            console.log( 'TODO: export file ...', file );
            if( file.toLowerCase().endsWith( '.gpx' ) ) {
                this._importGPX( file );
                return;
            }
            if( file.toLowerCase().endsWith( '.kml' ) ) {
                this._importGPX( file );
                return;
            }
            throw new Error( 'Unsupported file format!' );
        } catch( e ) {
            console.error( e );
            throw e;
        }
    }

    /**
     * 
     */
    _exportGPX( gpx ) {
        try {
            console.log( 'TODO: export GPX ...', gpx );
        } catch( e ) {
            console.error( e );
        }
    }

    /**
     * 
     */
    _exportKML( kml ) {
        try {
            console.log( 'TODO: export KML ...', kml );
        } catch( e ) {
            console.error( e );
        }
    }
}

module.exports = GeoFile;
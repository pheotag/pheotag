const fs = require( 'fs' );
const url = require( 'url' );
const path = require( 'path' );
const piexif = require( 'xml2js' );
const Waypoint = require( './waypoint' );

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
                new Waypoint( 70.0, 70.0 ),
                new Waypoint( 71.0, 71.0 )
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

    /**
     * Insert a new waypoint after the given index, or at the end if no valid index is given.
     */
    addWaypoint( index, title, description, time, timezone, latitude, longitude, elevation, link ) {
        try {
            index = ( Number.isInteger( index ) ? index : this.waypoints.length - 1 );
            let waypoint = new Waypoint( latitude, longitude );
            waypoint.title = title;
            waypoint.description = description;
            waypoint.time = ( time instanceof Date ? time.toISOString() : time );
            waypoint.timezone = timezone;
            waypoint.elevation = elevation;
            waypoint.link = link;
            //this.waypoints.push( waypoint );
            this.waypoints.splice( index + 1, 0, waypoint );
        } catch( e ) {
            throw e;
        }
    }

    /**
     * 
     */
    removeWaypoint( index ) {
        try {
            this.waypoints.splice( index, 1 );
        } catch( e ) {
            throw e;
        }
    }
}

module.exports = GeoFile;
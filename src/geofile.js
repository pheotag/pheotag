const fs = require( 'fs' );
const url = require( 'url' );
const path = require( 'path' );
const xml2js = require( 'xml2js' );
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
    _flatten( array, property ) {
        return array.reduce( ( accumulator, current ) => {
            return accumulator.concat( current[property] );
        }, [] );
    }
    
    /**
     * 
     */
    _createWaypoint( p ) {
        return {
            latitude: parseFloat( p.$.lat ),
            longitude: parseFloat( p.$.lon ),
            elevation: ( p.ele ? parseFloat( p.ele[0] ) : undefined ),
            time: ( p.time ? p.time[0] : undefined ),
            name: ( p.name ? p.name[0] : undefined ),
            description: ( p.desc ? p.desc[0] : undefined ),
            link: ( p.link ? p.link[0].$.href : undefined )
        }
    }

    /**
     * 
     */
    importGEO( file ) {
        try {
            if( file.toLowerCase().endsWith( '.gpx' ) ) {
                return this._importGPX( file );
            }
            if( file.toLowerCase().endsWith( '.kml' ) ) {
                return this._importKML( file );
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
        return new Promise( ( resolve, reject ) => {
            fs.readFile( gpx, ( errorFile, data ) => {
                try {
                    if( errorFile ) {
                        throw errorFile;
                    }
                    let parser = new xml2js.Parser()
                    parser.parseString( data, ( errorXML, result ) => {
                        try {
                            if( errorXML ) {
                                throw errorXML;
                            }
                            // Get waypoints from GPX
                            //let waypoints = result.gpx.wpt.map( this._createWaypoint );
        
                            // Get routepoints from GPX (all routes)
                            //let routes = result.gpx.rte; 
                            //let routepoints = this._flatten( routes, 'rtept' ).map( this._createWaypoint );
                    
                            // Get trackpoints from GPX (all tracks with all segments)
                            let tracks = result.gpx.trk; // [ result.gpx.trk[0] ]
                            let segments = this._flatten( tracks, 'trkseg' );   
                            let trackpoints = this._flatten( segments, 'trkpt' ).map( this._createWaypoint );
        
                            // Assign points from GPX
                            this.waypoints = trackpoints;
                            resolve();
                        } catch( e ) {
                            reject( e );
                        }
                    } );
                } catch( e ) {
                    reject( e );
                }
            } );
        } );
    }

    /**
     * 
     */
    _importKML( kml ) {
        return new Promise( ( resolve, reject ) => {
            //reject( new Error( 'KML import not yet supported!' ) );
            throw new Error( 'KML import not yet supported!' );
        } );
    }

    /**
     * 
     */
    exportGEO( file ) {
        try {
            /*
            if( file.toLowerCase().endsWith( '.gpx' ) ) {
                this._importGPX( file );
                return;
            }
            */
            if( file.toLowerCase().endsWith( '.kml' ) ) {
                return this._importGPX( file );
            }
            throw new Error( 'Unsupported file format!' );
        } catch( e ) {
            return new Promise( ( resolve, reject ) => {
                reject( e );
            } );
        }
    }

    /**
     * 
     */
    /*
    _exportGPX( gpx ) {
        return new Promise( ( resolve, reject ) => {
            reject( 'GPX export not supported!' );
        } );
    }
    */

    /**
     * 
     */
    _exportKML( kml ) {
        return new Promise( ( resolve, reject ) => {
            reject( new Error( 'KML export not yet supported!' ) );
        } );
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
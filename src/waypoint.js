/**
 * 
 */
class Waypoint {

    /**
     * 
     */
    constructor( latitude, longitude ) {
        this.title = '',
        this.description = '',
        this.time = undefined,
        this.timezone = undefined,
        this.latitude = ( latitude ? latitude : Number.NaN ),
        this.longitude = ( longitude ? longitude : Number.NaN ),
        this.altitude = 0.0,
        this.link = undefined
    }
}

module.exports = Waypoint;
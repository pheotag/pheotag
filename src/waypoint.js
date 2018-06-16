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
        // ISO time e.g. 2000-01-01T08:00:00Z
        this.time = undefined,
        // ID of the timezone e.g. Europe/Berlin
        this.timezone = undefined,
        this.latitude = ( latitude ? latitude : Number.NaN ),
        this.longitude = ( longitude ? longitude : Number.NaN ),
        // eleveation in meters e.g. 512.6
        this.elevation = 0.0,
        this.link = undefined
    }
}

module.exports = Waypoint;
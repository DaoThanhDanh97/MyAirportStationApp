export class StationDetail {
    public lat: number;
    public long: number;
    public isInternational: boolean;
    public airportCode: string;
    public isMajor: boolean;
    public stateName: string;
    public stateAbbr: string;
    public airportName: string;

    constructor(lat: number, long: number, isInternational: boolean, airportCode: string, isMajor: any, stateName: string, stateAbbr: string, airportName: string) {
        this.lat = lat;
        this.long = long;
        this.isInternational = isInternational;
        this.airportCode = airportCode;
        this.isMajor = (isMajor == true);
        this.stateName = stateName;
        this.stateAbbr = stateAbbr;
        this.airportName = airportName;
    }
}
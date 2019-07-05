export class StateInfo {
    public lat: number;
    public long: number;
    public name: string;
    public state: string;

    constructor(lat: number, long: number, name: string, state: string) {
        this.lat = lat;
        this.long = long;
        this.name = name;
        this.state = state;
    }
}
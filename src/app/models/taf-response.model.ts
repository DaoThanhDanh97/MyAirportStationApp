export class TafResponse {
    private response: any;

    constructor(response: any) {
        this.response = response.response;
    }

    getResponse() {
        return this.response;
    }
}
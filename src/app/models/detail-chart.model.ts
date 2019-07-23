export class DetailChart {
    private _chartTitle: string;
    private _chartType: string;
    private _columns: Array<string>;
    private _data: Array<Array<any>>;
    private _options: any;
    private _isEnd: boolean;
    private _divId: string;

    constructor(chartTitle: string, chartType: string, columns: Array<string>, options: any, isEnd: boolean, divId: string) {
        this.chartTitle = chartTitle;
        this.chartType = chartType;
        this.columns = columns;
        this.data = [];
        this.options = options;
        this.isEnd = isEnd;
        this.divId = divId;
    }

    public get chartTitle(): string {
        return this._chartTitle;
    }
    public set chartTitle(value: string) {
        this._chartTitle = value;
    }

    public get chartType(): string {
        return this._chartType;
    }
    public set chartType(value: string) {
        this._chartType = value;
    }

    public get columns(): Array<string> {
        return this._columns;
    }
    public set columns(value: Array<string>) {
        this._columns = value;
    }

    public get data(): Array<Array<any>> {
        return this._data;
    }
    public set data(value: Array<Array<any>>) {
        this._data = value;
    }

    public get options(): any {
        return this._options;
    }
    public set options(value: any) {
        this._options = value;
    }

    public get isEnd(): boolean {
        return this._isEnd;
    }
    public set isEnd(value: boolean) {
        this._isEnd = value;
    }

    public get divId(): string {
        return this._divId;
    }
    public set divId(value: string) {
        this._divId = value;
    }
}
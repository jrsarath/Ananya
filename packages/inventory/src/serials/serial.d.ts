export interface SerialProps {
    id: string;
    componentId: string;
    serialNumber: string;
    locationId?: string | null;
    createdAt: Date;
}
export interface CreateSerialInput {
    componentId: string;
    serialNumber: string;
    locationId?: string | null;
}
export declare class Serial {
    readonly id: string;
    readonly componentId: string;
    readonly serialNumber: string;
    readonly locationId?: string | null;
    readonly createdAt: Date;
    private constructor();
    static create(input: CreateSerialInput): Serial;
    static rehydrate(props: SerialProps): Serial;
}
//# sourceMappingURL=serial.d.ts.map
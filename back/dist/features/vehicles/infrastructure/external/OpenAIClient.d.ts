export declare class OpenAIClient {
    private client;
    constructor(apiKey: string);
    generateVehicleDescription(vehicleData: {
        type: string;
        brand: string;
        modelName: string;
        color: string;
        engineSize: string;
        year: number;
        price: number;
    }): Promise<string>;
    private buildDescriptionPrompt;
}
//# sourceMappingURL=OpenAIClient.d.ts.map
interface CreateLinkOptions {
    fileUrl: string;
    expiresIn: string;
    maxClicks: number;
}
interface BlinkOptions {
    apiKey: string;
    baseUrl?: string;
}
declare class Blink {
    private apiKey;
    private baseUrl;
    constructor({ apiKey, baseUrl }: BlinkOptions);
    createLink(options: CreateLinkOptions): Promise<{
        url: string;
    }>;
}

export { Blink, type BlinkOptions, type CreateLinkOptions };

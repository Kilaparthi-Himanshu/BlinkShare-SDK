interface BlinkOptions {
    apiKey: string;
    baseUrl?: string;
}
interface CreateLinkOptions {
    fileUrl: string;
    expiresIn: string;
    maxClicks: number;
}
interface CreateEncryptedLinkOptions {
    file: File;
    expiresIn: string;
    maxClicks: number;
    secretKey: string;
}
declare class Blink {
    private apiKey;
    private baseUrl;
    constructor({ apiKey, baseUrl }: BlinkOptions);
    createLink(options: CreateLinkOptions): Promise<{
        url: string;
    }>;
    /**
    * Encrypts the provided file with a user-supplied secret key (AES-GCM)
    * and uploads the ciphertext to BlinkShare's API.
    */
    createEncryptedLink(options: CreateEncryptedLinkOptions): Promise<{
        url: any;
        expiresIn: string;
        maxClicks: number;
        info: string;
    }>;
}

export { Blink, type BlinkOptions, type CreateEncryptedLinkOptions, type CreateLinkOptions };

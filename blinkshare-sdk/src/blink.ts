import { detectEnvironment } from "./utils/detectEnvironment";
import { encryptFile } from "./utils/encrypt";

export interface BlinkOptions {
    apiKey: string;
    baseUrl?: string;
}

export interface CreateLinkOptions {
    fileUrl: string;
    expiresIn: string;
    maxClicks: number;
}

export interface CreateEncryptedLinkOptions {
    file: File;
    expiresIn: string;
    maxClicks: number;
    secretKey: string;
}

export class Blink {
    private apiKey: string;
    private baseUrl: string;

    constructor({ apiKey, baseUrl }: BlinkOptions) {
        if (!apiKey?.startsWith("blink_public_")) {
            throw new Error("Invalid Blink public key");
        }
        this.apiKey = apiKey;
        this.baseUrl = baseUrl ?? "https://blinkshare.vercel.app/api";
    }

    /**
    * Directly uploads the user provided link with a random id
    * and this id is used to serve the file at that link
    */
    async createLink(options: CreateLinkOptions) {
        const { fileUrl, expiresIn = "10m", maxClicks = 1 } = options;
        const environment = detectEnvironment();

        const res = await fetch(`${this.baseUrl}/links/createLink`, {
            method: "POST",
            headers: {
                "x-blink-key": this.apiKey,
                "x-blink-env": environment,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ fileUrl, expiresIn, maxClicks })
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json() as Promise<{ url: string }>;
    }

    /**
    * Encrypts the provided file with a user-supplied secret key (AES-GCM)
    * and uploads the ciphertext to BlinkShare's API.
    */
    async createEncryptedLink(options: CreateEncryptedLinkOptions) {
        const { file, expiresIn = "10m", maxClicks = 1, secretKey } = options;
        const environment = detectEnvironment();

        // const maxSize = 50 * 1024 * 1024; // 50MB
        // console.log(maxSize);
        // if (file.size > maxSize) {
        //      throw new Error("Exceeds max file size of 50MB");
        //     return;
        // } // Need to handle either here or on the API

        const encryptedFile = await encryptFile(file, secretKey);

        const formData = new FormData();
        formData.append("file", encryptedFile, "encrypted.bin");
        formData.append("expiresIn", expiresIn);
        formData.append("maxClicks", maxClicks.toString());

        const res = await fetch(`${this.baseUrl}/links/createEncryptedLink`, {
            method: "POST",
            headers: {
                "x-blink-key": this.apiKey,
                "x-blink-env": environment
            },
            body: formData
        });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();

        return {
            url: data.url,
            expiresIn,
            maxClicks,
            info: "🔐 Remember: share your secret key securely with the recipient.",
        };
    }

    /**
    * Download the file at link provided with appropriate name
    */
    async downloadFile(res: Response) {
        const blob = await res.blob();

        // Extract filename from Content-Disposition
        const disposition = res.headers.get("Content-Disposition");
        let filename = "download";
        if (disposition && disposition.includes("filename=")) {
            filename = disposition.split("filename=")[1].replace(/"/g, "");
        }

        // Download file
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.href = url
        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href);
    }
}

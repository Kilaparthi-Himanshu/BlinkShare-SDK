import { useRef, useState } from 'react';
import { Blink } from '../../blinkshare-sdk/src';

function App() {
    const fileRef = useRef<HTMLInputElement>(null);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [url, setUrl] = useState("");
    const [encryptedUrl, setEncryptedUrl] = useState("");

    const blink = new Blink({
        apiKey: import.meta.env.VITE_BLINK_SECURE_LINKS_API,
        baseUrl: "http://localhost:3000/api"
    });

    async function getCreateLinkResult() {
        const result = await blink.createLink({
            // fileUrl: "https://ichef.bbci.co.uk/images/ic/1200xn/p07h3dgm.jpg",
            fileUrl: "http://localhost:5173/bullet_hole.png",
            expiresIn: "30m",
            maxClicks: 3
        });

        console.log(result);
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files[0]) {
            setUploadedFile(files[0]);
        }
    };

    async function getCreateEncryptedLinkResult() {
        if (!uploadedFile) return;

        const result = await blink.createEncryptedLink({
            file: uploadedFile,
            expiresIn: "30m",
            maxClicks: 10,
            secretKey: "51423",
        });

        console.log(result);
    }

    async function fetchUrl() {
        if (!url) return;
        const res = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!res.ok) {
            console.error(await res.json());
            return;
        }

        await blink.downloadFile(res);
        console.log("File downloaded!");
    }

    async function fetchEncryptedUrl() {
        if (!encryptedUrl) return;
        const res = await fetch(encryptedUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ secretKey: "51423" })
        });

        if (!res.ok) {
            console.error(await res.json());
            return;
        }

        await blink.downloadFile(res);
        console.log("File downloaded!");
    }

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            width: "max-content"
        }}>
            <button onClick={getCreateLinkResult}>Test SDK CreateLink</button>
            <input 
                type="text"
                onChange={(e) => setUrl(e.target.value)}
            />
            <button onClick={fetchUrl}>Fetch URL</button>
            <div>Upload File</div>
            <input 
                type="file" 
                ref={fileRef} 
                onChange={handleFileChange} 
            />
            <button onClick={getCreateEncryptedLinkResult}>Test SDK CreateEncryptedLink</button>
            <span>Enter URL:</span>
            <input 
                type="text"
                onChange={(e) => setEncryptedUrl(e.target.value)}
            />
            <button onClick={fetchEncryptedUrl}>Fetch URL</button>
        </div>
    );
}

export default App;

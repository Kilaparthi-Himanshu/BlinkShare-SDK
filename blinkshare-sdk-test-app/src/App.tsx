import { useRef, useState } from 'react';
import { Blink } from '../../blinkshare-sdk/src';

function App() {
    const fileRef = useRef<HTMLInputElement>(null);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);

    const blink = new Blink({
        apiKey: import.meta.env.VITE_BLINK_SECURE_LINKS_API,
        baseUrl: "http://localhost:3000/api"
    });

    async function getCreateLinkResult() {
        const result = await blink.createLink({
            fileUrl: "https://ichef.bbci.co.uk/images/ic/1200xn/p07h3dgm.jpg",
            expiresIn: "10s",
            maxClicks: 10
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
            expiresIn: "10m",
            maxClicks: 10,
            secretKey: "51423",
        });

        console.log(result);
    }

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            width: "max-content"
        }}>
            <button onClick={getCreateLinkResult}>Test SDK CreateLink</button>
            <button onClick={getCreateEncryptedLinkResult}>Test SDK CreateEncryptedLink</button>
            <div onClick={() => fileRef?.current?.click()}>Upload File</div>
            <input 
                type="file" 
                className="hidden" 
                ref={fileRef} 
                onChange={handleFileChange} 
            />
        </div>
    );
}

export default App;

import { Blink } from '../../blinkshare-sdk/dist';

function App() {
    const blink = new Blink({
        apiKey: import.meta.env.VITE_BLINK_SECURE_LINKS_API,
        baseUrl: "http://localhost:3000/api"
    });

    async function getResult() {
        const result = await blink.createLink({
            fileUrl: "https://ichef.bbci.co.uk/images/ic/1200xn/p07h3dgm.jpg",
            expiresIn: "10s",
            maxClicks: 10
        });

        console.log(result);
    }

    return (
        <div>
            <button onClick={getResult}>Test SDK CreateLink</button>
        </div>
    );
}

export default App;

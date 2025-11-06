import { Blink } from '../../blinkshare-sdk/src';

function App() {
    const blink = new Blink({
        apiKey: "blink_public_b6a06a18fd05b49408e15741836f272fada6df960aa0222d76bf71491ddf8c36",
        baseUrl: "http://localhost:3000/api"
    });

    async function getResult() {
        const result = await blink.createLink({
            fileUrl: "http://localhost:5173/text.txt",
            expiersIn: "10m",
            maxClicks: 2
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

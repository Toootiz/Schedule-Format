chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id, allFrames: true },
        func: interceptarFetch
    });
});

function interceptarFetch() {
    let originalFetch = window.fetch;
    window.fetch = function (...args) {
        return originalFetch.apply(this, args).then(response => {
            let url = args[0];
            if (url.includes("horario-de-cursos")) {
                response.clone().json().then(data => {
                    console.log("Horario capturado:", data);
                    descargarJSON(data, "horario.json");
                });
            }
            return response;
        });
    };

    function descargarJSON(data, filename) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
    }
}

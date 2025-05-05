document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("cambiar-mensaje").addEventListener("click", function () {
        console.log("Botón clickeado, extrayendo JSON...");

        chrome.scripting.executeScript({
            target: { allFrames: true },
            function: interceptarFetch
        });
    });
});

// Función para interceptar `fetch` y descargar el JSON
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

    // Función para descargar JSON como archivo
    function descargarJSON(data, filename) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

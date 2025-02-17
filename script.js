document.addEventListener("DOMContentLoaded", function () {
    const inputField = document.getElementById("user-input");
    const mediumField = document.getElementById("medium-input");
    const sendButton = document.getElementById("send-btn");
    const copyButton = document.getElementById("copy-btn");
    const chatContainer = document.getElementById("chat-container");
    const apiKey = "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";
    const dodInput = document.getElementById("dod-input");

    let botMessage = ""; // Variable to store bot response for copying

    async function loadMediums() {
        try {
            const response = await fetch('medium_list_js.json');
            const data = await response.json();
            const mediums = data.mediums.filter(medium => medium.trim() !== "" && !medium.startsWith("---") && !medium.startsWith("[") && !medium.startsWith("openai.api_key"));
            mediums.forEach(medium => {
                const option = document.createElement("option");
                option.value = medium;
                option.textContent = medium;
                mediumField.appendChild(option);
            });
        } catch (error) {
            console.error("Błąd podczas wczytywania listy mediów:", error);
        }
    }

    loadMediums();

    async function sendMessage() {
        const userMessage = inputField.value.trim();
        const mediumMessage = mediumField.value.trim();
        if (!userMessage) return;
        if (!mediumMessage) return;

        displayMessage("wysłano", "user");
        inputField.value = "";

        try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [
                        {
                            role: "user",
                            content: "1. Czat:\n" + userMessage + "\n\n2. Medium: " + mediumMessage + "\n\n3. Podstawowe zasady:\n- Na powyższy czat odpowiedz jako wymieniony wyżej medium w granicy 350-450 znaków.\n- Ważne aby odpowiedź nie brzmiała jak AI, a jak żywy człowiek\n - Pozwól osobie na to, aby odczuwała że to ona prowadzi rozmowę, a nie medium.\n- Zadaj jedno pytanie, maksymalnie dwa i nie powtarzaj tych wcześniej zadanych.\n- Nie używaj myślników, wykrzykników oraz nie zaczynaj wiadomości od 'hej', 'Cześć' ani nie używaj określeń 'rozumiem że'."
                        }
                    ]
                })
            });

            const data = await response.json();
            botMessage = data.choices[0].message.content;
            displayMessage(botMessage, "bot");
        } catch (error) {
            displayMessage("Błąd połączenia z API.", "bot");
            console.error("Error:", error);
        }
    }

    function displayMessage(message, sender) {
        const chatBox = document.getElementById("chat-box");
        const msgElement = document.createElement("p");
        msgElement.textContent = message;

        if (sender === "user") {
            msgElement.classList.add("user-message");
        } else if (sender === "bot") {
            msgElement.classList.add("bot-message");
        }

        chatBox.appendChild(msgElement);
        chatBox.scrollTop = chatBox.scrollHeight; // Automatyczne przewijanie na dół
    }

    // Funkcja do kopiowania treści
    function copyToClipboard() {
        if (botMessage) {
            navigator.clipboard.writeText(botMessage).then(() => {
                alert("Odpowiedź została skopiowana!");
            }).catch((error) => {
                console.error("Błąd podczas kopiowania:", error);
            });
        } else {
            alert("Brak odpowiedzi do skopiowania.");
        }
    }

    sendButton.addEventListener("click", sendMessage);
    inputField.addEventListener("keypress", function (event) {
        if (event.key === "Enter") sendMessage();
    });

    // Przycisk kopiowania
    copyButton.addEventListener("click", copyToClipboard);

    // Funkcje do przycisków dodających tekst
    document.getElementById("button1").addEventListener("click", function() {
        dodInput.value += "Odpowiedz agresywniej.";
    });

    document.getElementById("button2").addEventListener("click", function() {
        dodInput.value += "Popros o podanie 3 liczb od 1 do 25 dla kart Tarota.";
    });

    document.getElementById("button3").addEventListener("click", function() {
        dodInput.value += "Tekst 3 ";
    });
});
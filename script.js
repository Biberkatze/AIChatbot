// Elemente abrufen
const chatbox = document.getElementById('chatbox');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const resetBtn = document.getElementById('reset-btn');
const darkModeBtn = document.getElementById('dark-mode-btn');
const API_KEY = "sk-proj-9iIWDx5Wln2Kl6OIuPWrT3BlbkFJxmzkN5G17sZDVA5NF6hw"; // Deinen API-Schlüssel hier einfügen
const inputInitHeight = chatInput.scrollHeight;

// Funktion zum Erstellen eines Chat-Nachrichten-Elements
const createChatMessage = (message, type) => {
  const li = document.createElement('li');
  li.classList.add('chat', type);
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message');
  if (type === 'incoming') {
    messageDiv.innerHTML = '<span class="material-symbols-outlined">smart_toy</span>';
  }
  const p = document.createElement('p');
  p.textContent = message;
  messageDiv.appendChild(p);
  
  // Zeitstempel hinzufügen
  const timestamp = document.createElement('span');
  timestamp.classList.add('timestamp');
  const now = new Date();
  const hours = now.getHours() % 12 || 12;
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
  timestamp.textContent = hours + ':' + minutes + ' ' + ampm;
  messageDiv.appendChild(timestamp);
  
  li.appendChild(messageDiv);
  return li;
};

// Funktion, um eine Antwort von der API zu generieren
const generateResponse = (chatElement, userMessage) => {
  const API_URL = "https://api.openai.com/v1/chat/completions";
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [{ role: "user", content: userMessage }],
    })
  };
  fetch(API_URL, requestOptions)
    .then(response => response.json())
    .then(data => {
      const botMessage = data.choices[0].message.content.trim();
      chatElement.querySelector('p').textContent = botMessage;
    })
    .catch(() => {
      chatElement.querySelector('p').textContent = "Oops! Etwas ist schiefgelaufen. Bitte versuche es erneut.";
      chatElement.querySelector('p').classList.add("error");
    })
    .finally(() => {
      chatbox.scrollTop = chatbox.scrollHeight;
    });
};

// Nachricht senden und verarbeiten
const handleChat = () => {
  const userMessage = chatInput.value.trim();
  if (!userMessage) return;
  // Nutzernachricht hinzufügen
  const outgoingMsg = createChatMessage(userMessage, 'outgoing');
  chatbox.appendChild(outgoingMsg);
  chatbox.scrollTop = chatbox.scrollHeight;
  chatInput.value = "";
  chatInput.style.height = inputInitHeight + "px";
  // Bot-Nachricht "Thinking..." hinzufügen
  const incomingMsg = createChatMessage("Thinking...", 'incoming');
  chatbox.appendChild(incomingMsg);
  chatbox.scrollTop = chatbox.scrollHeight;
  // Bot-Antwort generieren
  generateResponse(incomingMsg, userMessage);
};

// Event Listener
sendBtn.addEventListener('click', handleChat);
chatInput.addEventListener('keydown', (e) => {
  if(e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleChat();
  }
  // Textarea-Höhe anpassen
  chatInput.style.height = inputInitHeight + "px";
  chatInput.style.height = chatInput.scrollHeight + "px";
});

// Chat zurücksetzen
resetBtn.addEventListener('click', () => {
  if(confirm("Möchtest du den Chat wirklich zurücksetzen?")) {
    chatbox.innerHTML = '';
    const initialMsg = createChatMessage("Hi there 👋\nWie kann ich dir heute helfen?", "incoming");
    chatbox.appendChild(initialMsg);
  }
});

// Dark Mode umschalten
darkModeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});

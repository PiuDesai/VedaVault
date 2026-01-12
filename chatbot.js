const chatBox = document.getElementById("chat-box");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");

// Function to format AI markdown text
function formatMarkdown(text) {
  text = text.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");  // bold
  text = text.replace(/\*(.*?)\*/g, "<i>$1</i>");      // italic
  text = text.replace(/\n/g, "<br>");                 // line breaks
  text = text.replace(/^\s*\*\s(.*)$/gm, "• $1<br>"); // lists
  return text;
}

// Add message to chat
function addMessage(sender, text, senderType = "user") {
  text = text.replace(/\\n/g, "\n").trim();

  const msg = document.createElement("div");
  msg.classList.add("message");
  msg.classList.add(senderType); // 'user' or 'ai'

  if (senderType === "ai") {
    msg.innerHTML = `<strong>${sender}:</strong> ${formatMarkdown(text)}`;
  } else {
    msg.innerHTML = `<strong>${sender}:</strong> ${text}`;
  }

  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Typing indicator
function showTyping() {
  const typing = document.createElement("div");
  typing.classList.add("message", "ai");
  typing.id = "typing";
  typing.textContent = "VedaVault is typing...";
  chatBox.appendChild(typing);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Remove typing indicator
function removeTyping() {
  const typing = document.getElementById("typing");
  if (typing) typing.remove();
}

// Form submit
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = chatInput.value.trim();
  if (!message) return;

  // Add user message
  addMessage("You", message, "user");
  chatInput.value = "";

  // Show typing
  showTyping();

  // Send to server
  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();
    removeTyping();

    // Add AI reply
    addMessage("VedaVault", data.reply, "ai");
  } catch (err) {
    removeTyping();
    addMessage("VedaVault", "Error connecting to server.", "ai");
    console.error(err);
  }
});


//minimize
const chatHeader = document.getElementById("chat-header");
const chatBody = document.getElementById("chat-body");

chatBody.style.display = "none"; // start minimized

chatHeader.addEventListener("click", () => {
  if (chatBody.style.display === "none") {
    chatBody.style.display = "flex";
  } else {
    chatBody.style.display = "none";
  }
});


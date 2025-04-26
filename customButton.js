// Content script to inject a smart reply button into Gmail's reply UI

// Set your OpenAI API key here
const OPENAI_API_KEY = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";

window.addEventListener("load", () => {
  const ensureCustomButton = () => {
    const container = document.querySelector(".bAK"); // Target the .bAK container

    if (container && !container.querySelector(".custom-attach-button")) {
      // Create a new button
      const newButton = document.createElement("div");
      newButton.className = "custom-attach-button wG J-Z-I"; // Match existing button classes
      newButton.setAttribute("role", "button");
      newButton.setAttribute("data-tooltip", "Suggest reply with GPT");
      newButton.setAttribute("aria-label", "Suggest with GPT");
      newButton.style.cursor = "pointer";
      newButton.style.userSelect = "none";
      newButton.style.position = "relative";

      // Add inner structure for the button
      const innerDiv1 = document.createElement("div");
      innerDiv1.className = "J-J5-Ji J-Z-I-Kv-H";

      const innerDiv2 = document.createElement("div");
      innerDiv2.className = "J-J5-Ji J-Z-I-J6-H";

      const iconDiv = document.createElement("div");
      iconDiv.className = "custom-icon a1 aaA aMZ";
      iconDiv.style.width = "20px";
      iconDiv.style.height = "20px";
      iconDiv.style.backgroundColor = "#4F8EF7"; // Custom icon style
      iconDiv.style.borderRadius = "50%";
      iconDiv.style.display = "flex";
      iconDiv.style.alignItems = "center";
      iconDiv.style.justifyContent = "center";
      iconDiv.style.color = "white";
      iconDiv.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20px" height="20px"><path d="M12 2a10 10 0 100 20 10 10 0 000-20z"/></svg>';

      // Assemble button structure
      innerDiv2.appendChild(iconDiv);
      innerDiv1.appendChild(innerDiv2);
      newButton.appendChild(innerDiv1);

      // Attach click event
      newButton.addEventListener("click", async () => {
        newButton.style.opacity = "0.6";
        newButton.style.pointerEvents = "none";
        // Extract conversation
        const conversation = getConversationTextForGmail();
        // Call ChatGPT
        const suggestion = await getChatGPTSuggestion(conversation);
        // Insert suggestion into reply area
        const compositionArea = document.querySelector(".Am");
        if (compositionArea) {
          compositionArea.innerText = suggestion;
        }
        newButton.style.opacity = "1";
        newButton.style.pointerEvents = "auto";
      });

      // Insert the button at the beginning of the container
      container.insertBefore(newButton, container.firstChild);
    }
  };

  // Use MutationObserver to handle dynamic changes in Gmail's DOM
  const observer = new MutationObserver(() => {
    ensureCustomButton();
  });

  // Start observing Gmail's DOM
  observer.observe(document.body, { childList: true, subtree: true });

  // Ensure the button is added initially
  ensureCustomButton();
});

function getConversationTextForGmail() {
  // Find the closest conversation container
  let conversationContainer = document.querySelector('div[role="main"]');
  if (!conversationContainer) {
    conversationContainer = document.body;
  }
  // Select all visible email message bodies in the conversation
  const messages = conversationContainer.querySelectorAll(
    'div[role="listitem"] .a3s'
  );
  let conversation = "";
  messages.forEach((msg) => {
    if (msg.offsetParent !== null && msg.innerText.trim().length > 0) {
      conversation += msg.innerText.trim() + "\n\n";
    }
  });
  if (!conversation.trim()) {
    return "No previous conversation found.";
  }
  return conversation.trim();
}

async function getChatGPTSuggestion(conversation) {
  // Use the hard-coded API key
  const apiKey = OPENAI_API_KEY;
  if (!apiKey) {
    return "No API key provided.";
  }

  const apiUrl = "https://api.openai.com/v1/chat/completions";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };
  const body = JSON.stringify({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "You are an email assistant. Suggest a professional reply based on the conversation, in serbian language.",
      },
      { role: "user", content: conversation },
    ],
    max_tokens: 200,
  });

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers,
      body,
    });
    if (!response.ok) {
      throw new Error("API error");
    }
    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (e) {
    console.error("Error fetching suggestion:", e);
    return "Failed to get suggestion from ChatGPT.";
  }
}

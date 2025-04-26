// Wait for Gmail's DOM to fully load
window.addEventListener("load", () => {
  const ensureCustomButton = () => {
    const container = document.querySelector(".bAK"); // Target the .bAK container

    if (container && !container.querySelector(".custom-attach-button")) {
      // Create a new button
      const newButton = document.createElement("div");
      newButton.className = "custom-attach-button wG J-Z-I"; // Match existing button classes
      newButton.setAttribute("role", "button");
      newButton.setAttribute("data-tooltip", "Click for a custom action");
      newButton.setAttribute("aria-label", "Custom Action");
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
      iconDiv.style.backgroundColor = "blue"; // Custom icon style
      iconDiv.style.borderRadius = "50%"; // Circle icon
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
      //   newButton.addEventListener("click", () => {
      //     alert("Custom button clicked!");
      //   });

      newButton.addEventListener("click", () => {
        const compositionArea = document.querySelector(".Am");

        if (compositionArea) {
          compositionArea.innerHTML =
            "Greetings to Sir William Milutinovic, my dear buddy";
          console.log("Text populated in the email composition area.");
        } else {
          console.error("Could not find the email composition area.");
        }
      });

      // Insert the button at the beginning of the container
      container.insertBefore(newButton, container.firstChild);

      console.log("Custom button added to .bAK container!");
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

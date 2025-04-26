// Wait for Gmail's DOM to fully load
window.addEventListener("load", () => {
  const ensureSidebarButton = () => {
    const sidebar = document.querySelector(".aeN"); // Gmail's left sidebar container

    if (sidebar && !sidebar.querySelector(".custom-sidebar-button")) {
      // Create a container for the button
      const container = document.createElement("div");
      container.className = "custom-sidebar-button";
      container.style.marginTop = "10px";
      container.style.padding = "10px";
      container.style.textAlign = "center";
      container.style.backgroundColor = "#f1f1f1";
      container.style.borderRadius = "5px";
      container.style.cursor = "pointer";

      // Add button text
      container.textContent = "Aleksa Menu Item";

      // Attach a click event to the container
      container.addEventListener("click", () => {
        alert("Sidebar button clicked!");
      });

      // Append the button to the sidebar
      sidebar.appendChild(container);

      console.log("Custom button added to the sidebar!");
    }
  };

  // Use MutationObserver to watch for Gmail's dynamic changes
  const observer = new MutationObserver(() => {
    ensureSidebarButton();
  });

  // Start observing Gmail's DOM for changes
  observer.observe(document.body, { childList: true, subtree: true });

  // Ensure the button is added initially
  ensureSidebarButton();
});

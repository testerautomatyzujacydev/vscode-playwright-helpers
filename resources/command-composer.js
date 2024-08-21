//@ts-check

// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
  // @ts-ignore
  const vscode = acquireVsCodeApi();

  const state = vscode.getState();
  const composerState = state?.composerState ? state.composerState : {};

  const checkboxes = document.querySelectorAll(".checkbox");
  for (const checkbox of checkboxes) {
    const attributeKey = checkbox.getAttribute("key");
    // const isChecked = composerState[attributeKey] ? composerState[attributeKey] : false;
    // @ts-ignore
    const isChecked = checkbox.checked;

    const parentKey = checkbox.getAttribute("parent");
    if (parentKey !== undefined) {
      updateChildElement(parentKey, isChecked);
    }

    checkbox.addEventListener("change", () => {
      const attributeKey = checkbox.getAttribute("key");
      // @ts-ignore
      const isChecked = checkbox.checked;

      const parentKey = checkbox.getAttribute("parent");
      if (parentKey !== undefined) {
        updateChildElement(parentKey, isChecked);
      }
    });
  }

  const executeCommandButton = document.querySelectorAll("#prepareCommandButton");
  for (const button of executeCommandButton) {
    button.addEventListener("click", () => {
      const params = {};

      const checkboxes = document.querySelectorAll(".checkbox");
      for (const checkbox of checkboxes) {
        const attributeKey = checkbox.getAttribute("key");
        const parentKey = checkbox.getAttribute("parent");
        const value = getChildElementValue(parentKey);
        const skipAsOption = checkbox.getAttribute("skipAsOption");
        const overwriteBaseCommand = checkbox.getAttribute("overwriteBaseCommand");
        // @ts-ignore
        if (checkbox.checked) {
          // eslint-disable-next-line eqeqeq
          if (skipAsOption === "false") {
            if (value !== "") {
              params[attributeKey] = `${attributeKey}=${value}`;
            } else {
              params[attributeKey] = `${attributeKey}`;
            }
          }
          if (overwriteBaseCommand === "true") {
            params["baseCommand"] = value;
            params[attributeKey] = "";
          }
        }
      }

      vscode.postMessage({
        type: "prepareCommand",
        params,
      });
    });
  }

  function getChildElementValue(parentKey) {
    const childElement = document.querySelector(`[child="${parentKey}"]`);
    if (childElement !== null) {
      // @ts-ignore
      return childElement.value;
    }
    return "";
  }

  function updateChildElement(parentKey, isChecked) {
    const childElement = document.querySelector(`[child="${parentKey}"]`);
    if (childElement !== null) {
      if (isChecked) {
        childElement.classList.remove("hidden");
        // @ts-ignore
        childElement.disabled = false;
      } else {
        childElement.classList.add("hidden");
        // @ts-ignore
        childElement.disabled = true;
      }
    }
  }
})();
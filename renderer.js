const urlInput = document.getElementById("urlInput");
const centerHub = document.getElementById("centerHub");
const closeButton = document.getElementById("closeButton");
const webViewElement = document.getElementById("webView");
const tabsContainer = document.getElementById("tabsContainer");

// startsite is saved in home/index.html
const currentDir = __dirname;
const START_SITE = `file://${currentDir}/home/index.html`;

// const START_SITE = "https://www.google.com";

const commands = {};

const tabs = [
  {
    url: START_SITE,
  },
];

let currentTab = 0;

const hideTabs = () => {
  tabsContainer.classList.add("hidden");
};

const showTabs = () => {
  tabsContainer.innerHTML = "";
  tabs.forEach((tab, index) => {
    const tabElement = document.createElement("div");
    tabElement.classList.add("tab");
    if (index === currentTab) tabElement.classList.add("active");
    const image = document.createElement("img");
    image.src = `https://www.google.com/s2/favicons?sz=256&domain_url=${tab.url}`;
    image.onerror = () => {
      image.src = "assets/file.svg";
    };
    tabElement.appendChild(image);
    const title = document.createElement("span");
    title.className = "tab-title";
    title.innerText = tab.title;
    tabElement.appendChild(title);
    tabElement.addEventListener("click", () => {
      currentTab = index;
      loadPage(tab.url);
      showTabs();
    });
    tabsContainer.appendChild(tabElement);
  });
  tabsContainer.classList.remove("hidden");
};

const switchTab = (index) => {
  currentTab = index;
  loadPage(tabs[currentTab].url);
  showTabs();
  window.focus();
};

const deleteTab = (index) => {
  tabs.splice(index, 1);
  if (tabs.length === 0) addTab(START_SITE);
  currentTab = Math.min(currentTab, tabs.length - 1);
  loadPage(tabs[currentTab].url);
};

const addTab = (url) => {
  tabs.push({ url, title: "New Tab" });
  currentTab = tabs.length - 1;
  loadPage(url);
};

const showHub = () => {
  hideTabs();

  urlInput.value = webViewElement.src;
  if (urlInput.value.includes("https://www.google.com/search?q=")) {
    urlInput.value = urlInput.value.replace(
      "https://www.google.com/search?q=",
      ""
    );
    urlInput.value = urlInput.value.split("%20").join(" ");
  }
  centerHub.classList.remove("hidden");
  urlInput.focus();
  urlInput.select();
};

const hideHub = () => {
  centerHub.classList.add("hidden");
  window.focus();
};

// keybinds
const keybinds = {
  "ctrl+k": () => {
    centerHub.classList.contains("hidden") ? showHub() : hideHub();
  },
  "ctrl+#": () => {
    centerHub.classList.contains("hidden") ? showHub() : hideHub();
    urlInput.value = "#";
  },
  escape: hideHub,
  "ctrl+tab": () => {
    switchTab((currentTab + 1) % tabs.length);
  },
  "ctrl+arrowright": () => {
    switchTab((currentTab + 1) % tabs.length);
  },
  "ctrl+arrowleft": () => {
    switchTab((currentTab - 1 + tabs.length) % tabs.length);
  },
  "ctrl+r": () => webViewElement.reload(),
  "ctrl+w": () => {
    deleteTab(currentTab);
    showTabs();
  },
  "ctrl+t": () => {
    addTab(START_SITE);
    switchTab(tabs.length - 1);
    showTabs();
  },
  "ctrl+z": () => webViewElement.goBack(),
  "ctrl+y": () => webViewElement.goForward(),
};

window.addEventListener("keydown", function (event) {
  const keybind = Object.keys(keybinds).find((key) => {
    const ctrl = event.ctrlKey ? "ctrl+" : "";
    const shift = event.shiftKey ? "shift+" : "";
    const alt = event.altKey ? "alt+" : "";
    return ctrl + shift + alt + event.key.toLowerCase() === key;
  });

  if (keybind) {
    keybinds[keybind]();
    event.preventDefault();
  }
});

window.addEventListener("keyup", (e) => {
  if (e.key === "Control") hideTabs();
});

webViewElement.addEventListener("click", () => {
  hideTabs();
  hideHub();
  window.focus();
});

// update url when navigating
webViewElement.addEventListener("did-navigate", function (event) {
  urlInput.value = event.url;
  hideHub();
  window.focus();
});

// url submit
urlInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") loadPage(urlInput.value);
});

// close button
closeButton.addEventListener("click", hideHub);

const loadPage = (url) => {
  if (!url || url.trim() === "") return;

  // hide hub
  centerHub.classList.add("hidden");
  if (url[0] === "#") {
    const commandKey = url.slice(1);
    if (commands[commandKey]) return commands[commandKey]();

    const currentUrl = webViewElement.src;
    return (commands[commandKey] = () => {
      loadPage(currentUrl);
    });
  }
  if (url[0] === ":") url = `http://localhost${url}`;
  else if (url[0] === "_") {
    addTab(url.slice(1));
    switchTab(tabs.length - 1);
    showTabs();
    return;
  } else if (
    (!url.includes(".") || url.includes(" ")) &&
    !url.includes("localhost") &&
    !url.includes("file://") &&
    !url.includes("https://") &&
    !url.includes("http://")
  )
    url = `https://www.google.com/search?q=${url}`;
  else if (!url.includes("://")) url = `https://${url}`;

  tabs[currentTab].url = url;
  webViewElement.src = url;
};

webViewElement.addEventListener("page-title-updated", function (event) {
  tabs[currentTab].title =
    event.title.length > 9 ? event.title.slice(0, 9) + "..." : event.title;
});

// always keep the webview focused
window.addEventListener("focusout", () => {
  window.focus();
});

document.body.addEventListener("focusout", () => {
  window.focus();
});

loadPage(tabs[currentTab].url);

setInterval(() => {
  window.focus();
}, 1000);

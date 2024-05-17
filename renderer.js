const urlInput = document.getElementById("urlInput");
const centerHub = document.getElementById("centerHub");
const closeButton = document.getElementById("closeButton");
const webViewElement = document.getElementById("webView");
const tabsContainer = document.getElementById("tabsContainer");

const START_SITE = "https://www.google.com";

const tabs = [
  {
    url: START_SITE,
    title: "Google",
  },
  {
    url: "https://www.youtube.com",
    title: "YouTube",
  },
  {
    url: "https://www.github.com",
    title: "Github",
  },
];

let currentTab = 0;

const switchTab = () => {
  currentTab = (currentTab + 1) % tabs.length;
  loadPage(tabs[currentTab].url);

  tabsContainer.innerHTML = tabs
    .map((tab, index) => {
      return `<div class="tab ${
        index === currentTab ? "active" : ""
      }" onclick="loadPage('${tab.url}');">${tab.title}</div>`;
    })
    .join("");

  window.focus();
};

const deleteTab = (index) => {
  tabs.splice(index, 1);
  if (tabs.length === 0) tabs.push(START_SITE);
  currentTab = Math.max(0, currentTab - 1);
  loadPage(tabs[currentTab].url);
};

const addTab = (url) => {
  tabs.push(url);
  currentTab = tabs.length - 1;
  loadPage(url);
};

const showHub = () => {
  if (urlInput.value.includes("https://www.google.com/search?q="))
    urlInput.value = urlInput.value.replace(
      "https://www.google.com/search?q=",
      ""
    );
  urlInput.value = urlInput.value.split("%20").join(" ");
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
  escape: hideHub,
  "ctrl+tab": switchTab,
  "ctrl+r": () => webViewElement.reload(),
  "ctrl+w": () => deleteTab(currentTab),
  "ctrl+t": () => addTab(START_SITE),
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

const mousebinds = {
  3: () => {
    window.history.forward();
    window.focus();
  },
  4: () => {
    window.history.back();
    window.focus();
  },
};

window.addEventListener("mousedown", function (event) {
  const action = mousebinds[event.button];
  if (action) action();
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
  if (url[0] === ":") url = `http://localhost${url}`;
  else if (!url.includes(".")) url = `https://www.google.com/search?q=${url}`;
  if (!url.includes("://")) url = `https://${url}`;

  webViewElement.src = url;
};

// always keep the webview focused
webViewElement.addEventListener("blur", function () {
  window.focus();
});

loadPage(tabs[currentTab].url);
 
setInterval(() => {
  window.focus();
}, 1000);

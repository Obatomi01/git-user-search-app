"use script";

// selecting elements
const gitSearch = document.querySelector(".search-container");
const gitUserInput = document.querySelector(".search-input");
const searchBtn = document.querySelector(".search-btn");
const resultsContainer = document.querySelector(".result-container");
const searchBtnContainer = document.querySelector(".error-container");
const darkModeContainer = document.querySelectorAll(".change-mode-container");
const modeBtn = document.querySelectorAll(".mode-btn");
const darkModeItems = document.querySelectorAll(
  "body, .account-details, .search-container, .result-container, header h1, .search-input, .user-name, .social-icon img, .bio, .account-title, .number, .social-icon p, .date"
);
const lightModeBtnContainer = document.querySelector(
  ".light-mode-btn-container"
);
const darkModeBtnContainer = document.querySelector(".dark-mode-btn-container");

let gitUsername, gitUserInfo, curMode;

const getCurMode = function () {
  curMode = resultsContainer.classList.contains("dark-mode");
};

// how to if current theme at the start is dark
if (
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
) {
  darkModeContainer.forEach((el) => {
    el.classList.toggle("hidden");
  });
  darkModeItems.forEach((el) => {
    el.classList.toggle("dark-mode");
  });
  lightModeBtnContainer.classList.add("hidden");
  darkModeBtnContainer.classList.remove("hidden");
  curMode = true;
}

// dark mode SECTION
modeBtn.forEach((el) =>
  el.addEventListener("click", function (e) {
    console.log("button clicked");
    darkModeContainer.forEach((el) => {
      el.classList.toggle("hidden");
    });
    darkModeItems.forEach((el) => {
      el.classList.toggle("dark-mode");
    });
    getCurMode();
    getUserDetails(gitUserInfo, curMode);
  })
);

// search button
searchBtn.addEventListener("click", function (e) {
  e.preventDefault();
  gitUsername = gitUserInput.value;
  searchBtnContainer.innerHTML = "";
  getCurMode();
  gitData(curMode);
});

const gitData = async function (curMode) {
  renderSpinner();
  try {
    if (!gitUsername) {
      console.log("None");
    }
    if (!gitUsername) {
      console.log("NO INPUT");
      throw new Error("Invalid Input");
    }
    const fetchPromise = await fetch(
      `https://api.github.com/users/${gitUsername}`
    );
    if (!fetchPromise.ok) {
      throw new Error("No results");
    }
    gitUserInfo = await fetchPromise.json(); // it is important to also await the resolved promise
    getUserDetails(gitUserInfo, curMode);
  } catch (err) {
    setTimeout(() => {
      renderError(err.message);
      resultsContainer.innerHTML = "";
    }, 2000);
  }
};

const getUserDetails = function (gitUser, curMode) {
  const dateString = Date(`${gitUser.created_at}`);
  const dateArr = dateString.split(" ");
  const day = dateArr[2];
  const month = dateArr[1];
  const year = dateArr[3];

  const html = `          
  <div class="image-container">
    <img
      class="user-image"
      src="${gitUser.avatar_url}"
      alt=""
    />
  </div>

  <div class="details-container">
    <div class="user-main-details">
      <h1 class="user-name ${curMode ? "dark-mode" : ""}">${
    gitUser.name ? gitUser.name : "Not available"
  }</h1>
      <p class="date ${
        curMode ? "dark-mode" : ""
      }">Joined ${day} ${month} ${year}</p>
    </div>

    <a class="git-link" href="${gitUser.html_url}">@${gitUser.login}</a>
    <p class="bio ${curMode ? "dark-mode" : ""}">${
    gitUser.bio === null ? "This profile has no bio" : gitUser.bio
  }</p>

    <div class="account-details ${curMode ? "dark-mode" : ""}">
      <div class="account-detail">
        <p class="account-title ${curMode ? "dark-mode" : ""}">Repos</p>
        <p class="number ${curMode ? "dark-mode" : ""}">${
    gitUser.public_repos
  }</p>
      </div>

      <div class="account-detail">
        <p class="account-title ${curMode ? "dark-mode" : ""}">Followers</p>
        <p class="number ${curMode ? "dark-mode" : ""}">${gitUser.followers}</p>
      </div>

      <div class="account-detail">
        <p class="account-title ${curMode ? "dark-mode" : ""}">Following</p>
        <p class="number ${curMode ? "dark-mode" : ""}">${gitUser.following}</p>
      </div>
    </div>

    
    <div class="social-icons">
      <div class="social-icon">
        <img class =  social-icon-img ${
          curMode ? "dark-mode" : ""
        } src="assets/icon-location.svg" alt="" />
        <p class=${curMode ? "dark-mode" : ""}>${
    gitUser.location === null ? "Location not specified" : gitUser.location
  }</p>
      </div>

      <div class="social-icon">
        <img class=  social-icon-img ${
          curMode ? "dark-mode" : ""
        } src="assets/icon-twitter.svg" alt="" />
        <p class=${curMode ? "dark-mode" : ""} >${
    gitUser.twitter_username === null
      ? "Not available"
      : `<a class="twitter-link" href="https://twitter.com/${gitUser.twitter_username}">${gitUser.twitter_username}</a>`
  }</p>
      </div>

      <div class="social-icon">
        <img  class= social-icon-img ${
          curMode ? "dark-mode" : ""
        } src="assets/icon-website.svg" alt="" />
        <p class=${curMode ? "dark-mode" : ""} >${
    gitUser.blog === ""
      ? "Not available"
      : `<a class= "twitter-link" href="${gitUser.blog}">${gitUser.blog}</a>`
  }</p>
      </div>

      <div class="social-icon">
        <img  class= social-icon-img ${
          curMode ? "dark-mode" : ""
        } src="assets/icon-company.svg" alt="" />
        <p class=${curMode ? "dark-mode" : ""} >${
    gitUser.company === null ? "Not available" : gitUser.company
  }</p>
      </div>
    </div>
  </div>
  `;
  resultsContainer.innerHTML = "";
  resultsContainer.insertAdjacentHTML("afterbegin", html);
};

//TODO set a loading icon
const renderSpinner = function () {
  const html = `
  <div class="spinner">
  <i class="fa fa-spinner fa-pulse fa-5x fa-fw"></i>
</div>
  `;
  resultsContainer.innerHTML = "";
  resultsContainer.insertAdjacentHTML("afterbegin", html);
};

const renderError = function (err) {
  const html = `<p class="error-message">${err}</p>`;
  searchBtnContainer.insertAdjacentHTML("afterbegin", html);
};

// listening to dark mode on the window

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", function (event) {
    if (event.matches) {
      lightModeBtnContainer.classList.add("hidden");
      darkModeBtnContainer.classList.remove("hidden");

      darkModeItems.forEach((el) => {
        el.classList.add("dark-mode");
      });
      getCurMode();
      console.log(curMode);
      console.log(resultsContainer);
      getUserDetails(gitUserInfo, curMode);
    }
  });

window
  .matchMedia("(prefers-color-scheme: light)")
  .addEventListener("change", function (event) {
    if (event.matches) {
      lightModeBtnContainer.classList.remove("hidden");
      darkModeBtnContainer.classList.add("hidden");

      darkModeItems.forEach((el) => {
        el.classList.remove("dark-mode");
      });
      getCurMode();

      getUserDetails(gitUserInfo, curMode);
    }
  });

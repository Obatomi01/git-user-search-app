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

let gitUsername;

searchBtn.addEventListener("click", function (e) {
  e.preventDefault();
  gitUsername = gitUserInput.value;
  searchBtnContainer.innerHTML = "";
  gitData();
});

const gitData = async function () {
  renderSpinner();
  try {
    const fetchPromise = await fetch(
      `https://api.github.com/users/${gitUsername}`
    );
    if (!fetchPromise.ok) {
      throw new Error("No results");
    }
    const gitUserInfo = await fetchPromise.json(); // it is important to also await the resolved promise
    console.log(gitUserInfo);
    getUserDetails(gitUserInfo);
  } catch (err) {
    setTimeout(() => {
      renderError(err.message);
      resultsContainer.innerHTML = "";
    }, 2000);
  }
};

const getUserDetails = function (gitUser) {
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
      <h1 class="user-name">${
        gitUser.name ? gitUser.name : "Not available"
      }</h1>
      <p class="date">Joined ${day} ${month} ${year}</p>
    </div>

    <a class="git-link" href="${gitUser.html_url}">@${gitUser.login}</a>
    <p class="bio">${
      gitUser.bio === null ? "This profile has no bio" : gitUser.bio
    }</p>

    <div class="account-details">
      <div class="account-detail">
        <p class="account-title">Repos</p>
        <p class="number">${gitUser.public_repos}</p>
      </div>

      <div class="account-detail">
        <p class="account-title">Followers</p>
        <p class="number">${gitUser.followers}</p>
      </div>

      <div class="account-detail">
        <p class="account-title">Following</p>
        <p class="number">${gitUser.following}</p>
      </div>
    </div>

    
    <div class="social-icons">
      <div class="social-icon">
        <img src="assets/icon-location.svg" alt="" />
        <p>${
          gitUser.location === null
            ? "Location not specified"
            : gitUser.location
        }</p>
      </div>

      <div class="social-icon">
        <img src="assets/icon-twitter.svg" alt="" />
        <p>${
          gitUser.twitter_username === null
            ? "Not available"
            : `<a class="git-link" href="https://twitter.com/${gitUser.twitter_username}">${gitUser.twitter_username}</a>`
        }</p>
      </div>

      <div class="social-icon">
        <img src="assets/icon-website.svg" alt="" />
        <p>${
          gitUser.blog === ""
            ? "Not available"
            : `<a href=${gitUser.blog}>${gitUser.blog}</a>`
        }</p>
      </div>

      <div class="social-icon">
        <img src="assets/icon-company.svg" alt="" />
        <p>${gitUser.company === null ? "Not available" : gitUser.company}</p>
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
  const html = `<p class="error-message"> No results </p>`;
  searchBtnContainer.insertAdjacentHTML("afterbegin", html);
};

// dark mode SECTION
modeBtn.forEach((el) =>
  el.addEventListener("click", function (e) {
    darkModeContainer.forEach((el) => el.classList.toggle("hidden"));
    darkModeItems.forEach((el) => el.classList.toggle("dark-mode"));
  })
);

// listening to dark mode on the window
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", function (event) {
    if (event.matches) {
      lightModeBtnContainer.classList.add("hidden");
      darkModeBtnContainer.classList.remove("hidden");
      darkModeItems.forEach((el) => el.classList.add("dark-mode"));
    }
  });

window
  .matchMedia("(prefers-color-scheme: light)")
  .addEventListener("change", function (event) {
    if (event.matches) {
      lightModeBtnContainer.classList.remove("hidden");
      darkModeBtnContainer.classList.add("hidden");
      darkModeItems.forEach((el) => el.classList.remove("dark-mode"));
    }
  });
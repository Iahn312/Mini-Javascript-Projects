const modal = document.getElementById("modal");
const modalShow = document.getElementById("show-modal");
const modalClose = document.getElementById("close-modal");
const bookmarkForm = document.getElementById("bookmark-form");
const websiteNameEl = document.getElementById("website-name");
const websiteUrlEl = document.getElementById("website-url");
const bookmarksContainer = document.getElementById("bookmarks-container");

const urlInputValid = document.getElementById("url-input-valid");
const nameInputValid = document.getElementById("name-input-valid");

let bookmarks = [];

// Show Modal, Focus on Input

const showModal = () => {
  modal.classList.add("show-modal");
  websiteNameEl.focus();
};

// Hide Modal
const hideModal = () => {
  modal.classList.remove("show-modal");
};

// Validate Form
const validate = (nameValue, urlValue) => {
  const expression =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
  const regex = new RegExp(expression);
  //   Name input Validate
  if (nameValue) {
    nameInputValid.hidden = true;
    websiteNameEl.classList.remove("input-valid");
  } else {
    nameInputValid.hidden = false;
    websiteNameEl.classList.add("input-valid");
  }
  //   URL input Validate
  if (urlValue.match(regex)) {
    urlInputValid.hidden = true;
    websiteUrlEl.classList.remove("input-valid");
  } else {
    urlInputValid.hidden = false;
    websiteUrlEl.classList.add("input-valid");
    return false;
  }
  // If Valid
  return true;
};

// Build Bookmarks DOM
const buildBookmarks = () => {
  // Remove all bookmark elements
  bookmarksContainer.textContent = "";
  // Build items
  bookmarks.forEach((bookmark, index) => {
    const { name, url } = bookmark;
    // Item
    const item = document.createElement("div");
    item.classList.add("item");
    // Close Icon
    const closeIcon = document.createElement("i");
    closeIcon.classList.add("fas", "fa-times");
    closeIcon.setAttribute("title", "Delete Bookmark");
    closeIcon.setAttribute("onclick", `deleteBookmark('${index}')`);
    // Favicon / Link Container (Contain favicon & link child)
    const linkInfo = document.createElement("div");
    linkInfo.classList.add("name");
    // Favicon
    const favicon = document.createElement("img");
    favicon.setAttribute(
      "src",
      `https://s2.googleusercontent.com/s2/favicons?domain=${url}`
    );
    favicon.setAttribute("alt", "Favicon");
    //Link
    const link = document.createElement("a");
    link.setAttribute("href", `${url}`);
    link.setAttribute("target", "_blank");
    link.textContent = name;
    // Append to bookmarks container
    linkInfo.append(favicon, link);
    item.append(closeIcon, linkInfo);
    bookmarksContainer.appendChild(item);
  });
};

// Fetch Bookmarks
const fetchBookmarks = () => {
  // Get bookmarks from localStorage if available
  if (localStorage.getItem("bookmarks")) {
    bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
  }
  buildBookmarks();
};

// Delete Bookmark
const deleteBookmark = (index) => {
  bookmarks.splice(index, 1);

  // Update  bookmarks array in localStorage, re-populate DOM
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  fetchBookmarks();
};

// Handle Data from Form
const storeBookmark = (e) => {
  e.preventDefault();
  const nameValue = websiteNameEl.value;
  let urlValue = websiteUrlEl.value;

  if (!urlValue.includes("https://") && !urlValue.includes("http://")) {
    urlValue = `https://${urlValue}`;
  }

  validate(nameValue, urlValue);
  //   Check if validate return true or fail
  if (!validate(nameValue, urlValue)) {
    return false;
  }

  const bookmark = {
    name: nameValue,
    url: urlValue,
  };

  bookmarks.push(bookmark);
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  fetchBookmarks();
  bookmarkForm.reset();
  hideModal();
};

//Modal Event Listeners
modalShow.addEventListener("click", showModal);
modalClose.addEventListener("click", hideModal);
window.addEventListener("click", (e) =>
  e.target === modal ? hideModal() : false
);

//Event Listener
bookmarkForm.addEventListener("submit", storeBookmark);

// On Load, Fetch Bookmarks
fetchBookmarks();

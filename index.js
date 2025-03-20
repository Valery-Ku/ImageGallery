let data = [];
let timerId;
let time = 100;
let selectedIndex = 0;
let loadingCount = 5;

function updateTimer() {
  time -= 0.2;
  if (time <= 0) {
    selectImage(selectedIndex + 1);
    time = 100;
  }
  document.querySelector(".bar").style.width = time + "%";
}

function toggleTimer(event) {
  if (event.target.textContent === "STOP") {
    event.target.textContent = "PLAY";
    stopTimer();
  } else {
    event.target.textContent = "STOP";
    startTimer();
  }
}

function stopTimer() {
  time = 100;
  document.querySelector(".bar").style.width = time + "%";
  clearInterval(timerId);
}

function startTimer() {
  timerId = setInterval(updateTimer, 10);
}

function selectImage(index) {
  selectedIndex = Math.max(0, Math.min(index, data.length - 1));
  if (selectedIndex === data.length) {
    loadImages();
  }
  document.querySelectorAll(".pictures div").forEach((item, i) => {
    item.classList.toggle("selected", i === selectedIndex);
  });
  const previewImage = document.querySelector(".preview img");
  previewImage.src = data[selectedIndex].download_url;
  previewImage.classList.add("loading");
  document.querySelector(".preview .author").textContent =
    data[selectedIndex].author;
}

function drawImages() {
  const images = document.querySelectorAll(".pictures img");
  data.forEach((item, i) => {
    images[i].classList.remove("loading");
    images[i].src = item.download_url;
    images[i].classList.add("loading");
  });
  selectImage(0);
}

function loadImages() {
  loadingCount = 5;
  stopTimer();
  const page = Math.floor(Math.random() * (800 / 4));
  const url = "https://picsum.photos/v2/list?page=" + page + "&limit=4";
  fetch(url)
    .then((res) => res.json())
    .then((json) => {
      data = json;
      drawImages();
    });
}

function onPictureClick(event) {
  if (event.target.tagName !== "IMG") return;
  stopTimer();
  document.querySelector(".play").textContent = "PLAY";
  const index = event.target.dataset.index;
  selectImage(index);
}

function removeLoading(event) {
  loadingCount -= 1;
  if (
    loadingCount === 0 &&
    document.querySelector(".play").textContent === "STOP"
  ) {
    startTimer();
  }
  event.target.classList.remove("loading");
}

function init() {
  loadImages();
  document.querySelector(".pictures").addEventListener("click", onPictureClick);
  document.querySelector(".new").addEventListener("click", loadImages);
  document.querySelectorAll("img").forEach((item) => {
    item.onload = removeLoading;
  });
  document.querySelector(".play").addEventListener("click", toggleTimer);
}

window.addEventListener("DOMContentLoaded", init);

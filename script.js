document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.querySelector(".start-reading");
  const bookCover = document.querySelector(".book-cover-front");
  const bookPages = document.querySelector(".book-pages");
  const controls = document.querySelector(".book-controls");
  const spreads = document.querySelectorAll(".book-spread");
  const progressFill = document.querySelector(".progress-fill");
  const currentPage = document.getElementById("current");
  const totalPage = document.getElementById("total");
  const nextBtn = document.querySelector(".next-page");
  const prevBtn = document.querySelector(".prev-page");

  let currentSpread = 0;
  totalPage.textContent = spreads.length;

  function showSpread(index) {
    spreads.forEach((spread, i) => {
      spread.style.display = i === index ? "flex" : "none";
    });
    currentPage.textContent = index + 1;
    progressFill.style.width = ((index + 1) / spreads.length) * 100 + "%";
  }

  startBtn.addEventListener("click", () => {
    bookCover.style.display = "none";
    bookPages.style.display = "block";
    controls.style.display = "flex";
    showSpread(currentSpread);
  });

  nextBtn.addEventListener("click", () => {
    if (currentSpread < spreads.length - 1) {
      currentSpread++;
      showSpread(currentSpread);
    }
  });

  prevBtn.addEventListener("click", () => {
    if (currentSpread > 0) {
      currentSpread--;
      showSpread(currentSpread);
    }
  });

  let touchStartX = 0;
  bookPages.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
  });
  bookPages.addEventListener("touchend", (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    if (touchStartX - touchEndX > 50) {
      if (currentSpread < spreads.length - 1) currentSpread++;
    } else if (touchEndX - touchStartX > 50) {
      if (currentSpread > 0) currentSpread--;
    }
    showSpread(currentSpread);
  });
});

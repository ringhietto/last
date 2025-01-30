document.addEventListener("DOMContentLoaded", () => {
  const pages = [
    "1-index.html",
    "2-onboarding.html",
    "2a-insert.html",
    "2b-age.html",
    "4-month.html",
    "5-day-28.html",
    "5-day-30.html",
    "5-day-31.html",
    "6-year.html",
    "6-year-january.html",
    "7-recap.html",
    "7a-etherea.html",
    "8-buy.html",
    "9-thanks.html",
    "10-end.html",
  ];

  document.addEventListener("keydown", (event) => {
    let currentPage = window.location.pathname;
    currentPage = currentPage
      .split("/")
      .filter((segment) => segment !== "")
      .pop();

    const currentIndex = pages.indexOf(currentPage);

    if (event.key === "ArrowRight" && currentIndex < pages.length - 1) {
      window.location.href = pages[currentIndex + 1];
    }

    if (event.key === "ArrowLeft" && currentIndex > 0) {
      window.location.href = pages[currentIndex - 1];
    }
  });
});

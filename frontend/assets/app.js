const setActiveNav = () => {
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("[data-nav]").forEach((item) => {
    if (item.getAttribute("href") === path) {
      item.classList.add("active");
    }
  });
};

const initWorkFilter = () => {
  const chips = document.querySelectorAll("[data-filter]");
  const cards = document.querySelectorAll("[data-work]");
  const search = document.querySelector("#searchWork");
  if (!chips.length || !cards.length) return;

  let active = "all";
  let keyword = "";

  const apply = () => {
    cards.forEach((card) => {
      const category = card.getAttribute("data-category");
      const text = card.textContent.toLowerCase();
      const passCategory = active === "all" || category === active;
      const passKeyword = !keyword || text.includes(keyword);
      card.style.display = passCategory && passKeyword ? "grid" : "none";
    });
  };

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      active = chip.getAttribute("data-filter");
      apply();
    });
  });

  if (search) {
    search.addEventListener("input", (e) => {
      keyword = e.target.value.trim().toLowerCase();
      apply();
    });
  }

  apply();
};

setActiveNav();
initWorkFilter();

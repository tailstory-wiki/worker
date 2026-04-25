(() => {
  const STORAGE_KEY = "theme";
  const root = document.documentElement;
  const switcher = document.querySelector(".theme-switcher");
  if (!switcher) return;

  const current = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : "system";
  };

  const apply = (choice) => {
    if (choice === "light" || choice === "dark") {
      root.setAttribute("data-theme", choice);
    } else {
      root.removeAttribute("data-theme");
    }
    root.setAttribute("data-theme-pref", choice);
    for (const btn of switcher.querySelectorAll("button[data-theme-choice]")) {
      btn.setAttribute(
        "aria-checked",
        btn.dataset.themeChoice === choice ? "true" : "false",
      );
    }
  };

  apply(current());

  switcher.addEventListener("click", (event) => {
    const btn = event.target.closest("button[data-theme-choice]");
    if (!btn) return;
    const choice = btn.dataset.themeChoice;
    if (choice === "system") {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, choice);
    }
    apply(choice);
    switcher.open = false;
  });

  document.addEventListener("click", (event) => {
    if (switcher.open && !switcher.contains(event.target)) {
      switcher.open = false;
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && switcher.open) {
      switcher.open = false;
    }
  });
})();

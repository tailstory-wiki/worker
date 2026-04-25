(() => {
  const STORAGE_KEY = "theme";
  const root = document.documentElement;

  const apply = (choice) => {
    if (choice === "light" || choice === "dark") {
      root.setAttribute("data-theme", choice);
    } else {
      root.removeAttribute("data-theme");
    }
  };

  const current = () => localStorage.getItem(STORAGE_KEY) ?? "system";

  const sync = (group) => {
    const active = current();
    for (const btn of group.querySelectorAll("button[data-theme-choice]")) {
      btn.setAttribute(
        "aria-pressed",
        btn.dataset.themeChoice === active ? "true" : "false",
      );
    }
  };

  const group = document.querySelector(".theme-switcher");
  if (!group) return;

  group.addEventListener("click", (event) => {
    const btn = event.target.closest("button[data-theme-choice]");
    if (!btn) return;
    const choice = btn.dataset.themeChoice;
    if (choice === "system") {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, choice);
    }
    apply(choice);
    sync(group);
  });

  sync(group);
})();

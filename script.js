/* =========================================
   Environmental Science Portfolio
   Navigation, scroll animations, active links
   ========================================= */

document.documentElement.classList.add("js-ready");

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".primary-nav");
  const navLinks = [
    ...document.querySelectorAll(".primary-nav a[href^='#']")
  ];
  const typingName = document.querySelector(".typing-name");
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (typingName && !reducedMotion) {
    const characters = document.createDocumentFragment();
    let characterIndex = 0;

    for (const character of typingName.textContent.trim()) {
      if (character === " ") {
        characters.append(" ");
        continue;
      }

      const characterElement = document.createElement("span");
      characterElement.textContent = character;
      characterElement.style.setProperty("--char-index", characterIndex);
      characters.append(characterElement);
      characterIndex += 1;
    }

    typingName.replaceChildren(characters);
    typingName.classList.add("is-typing");
  }

  /* MOBILE NAVIGATION */

  function closeMenu() {
    if (!menuToggle || !nav) return;

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    nav.classList.remove("is-open");
  }

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const isOpen =
        menuToggle.getAttribute("aria-expanded") === "true";

      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Open navigation" : "Close navigation"
      );

      nav.classList.toggle("is-open", !isOpen);
    });

    // Close the menu after selecting a section.
    navLinks.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    // Close with Escape.
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    // Close when clicking outside the navigation.
    document.addEventListener("click", (event) => {
      if (
        !nav.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });
  }

  /* AUTOMATIC COPYRIGHT YEAR */

  const year = document.getElementById("current-year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  /* SCROLL REVEAL ANIMATIONS */

  const revealTargets = document.querySelectorAll(
    [
      ".section-heading",
      ".about-copy",
      ".project-card",
      ".timeline-item",
      ".skill-item",
      ".research-topics span",
      ".contact-details"
    ].join(", ")
  );

  revealTargets.forEach((element) => {
    element.classList.add("reveal");
  });

  if ("IntersectionObserver" in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -30px 0px"
      }
    );

    revealTargets.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    // Keep all content visible if animations are unsupported.
    revealTargets.forEach((element) => {
      element.classList.add("is-visible");
    });
  }

  /* ACTIVE NAVIGATION LINK */

  const sections = [
    ...document.querySelectorAll("main section[id]")
  ];

  if (
    "IntersectionObserver" in window &&
    sections.length &&
    navLinks.length
  ) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          navLinks.forEach((link) => {
            const isActive =
              link.getAttribute("href") ===
              `#${entry.target.id}`;

            link.classList.toggle("active", isActive);

            if (isActive) {
              link.setAttribute("aria-current", "location");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        });
      },
      {
        rootMargin: "-35% 0px -55% 0px"
      }
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }
});

/* Stagger project card entrance */
document.querySelectorAll(".project-card").forEach((card, index) => {
  card.style.transitionDelay = `${index * 100}ms`;
});
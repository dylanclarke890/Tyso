class Translator {
  static translations = {
    EN: {
      title: "TYSO Survey",
      full_name: "Full Name:",
      company_name: "Company Name:",
      mats: "Available yoga mats in space:",
      goals: "What are the goal(s) of the Yoga class?",
      goals_options: [
        { value: "Balance", translation: "Body-mind Balance" },
        { value: "Force", translation: "Physical Strength" },
        { value: "Concentration", translation: "Enhanced Focus" },
        { value: "Conscience", translation: "Fostering Mindfulness" },
        { value: "TeamBuilding", translation: "Team building" },
        { value: "Leadership", translation: "Corporate Leadership Workshop" },
        { value: "YogaIntro", translation: "Introduction to Yoga" },
        { value: "MeditationIntro", translation: "Introduction to Meditation" },
      ],
      classes: "Series of classes:",
      classes_options: [
        { value: "One", translation: "One class" },
        { value: "Five", translation: "5 weeks" },
        { value: "Ten", translation: "10 weeks" },
        { value: "Twenty", translation: "20 weeks" },
      ],
      submit: "Submit",
    },
    FR: {
      title: "TYSO Sondage",
      full_name: "Nom complet:",
      company_name: "Nom de l'entreprise:",
      mats: "Tapis de yoga disponible dans l’espace:",
      goals: "Quel est l’objectif recherché dans la classe de yoga?",
      goals_options: [
        { value: "Balance", translation: "Balance esprit et corps" },
        { value: "Force", translation: "Force physique" },
        { value: "Concentration", translation: "Amélioration de la concentration" },
        { value: "Conscience", translation: "Travailler sur la pleine conscience" },
        { value: "TeamBuilding", translation: "Activités de 'team building'" },
        { value: "Leadership", translation: "Ateliers sur le leadership en entreprise" },
        { value: "YogaIntro", translation: "Introduction au yoga" },
        { value: "MeditationIntro", translation: "Introduction à la méditation" },
      ],
      classes: "Séries de classes:",
      classes_options: [
        { value: "One", translation: "Une classe" },
        { value: "Five", translation: "5 semaines" },
        { value: "Ten", translation: "10 semaines" },
        { value: "Twenty", translation: "20 semaines" },
      ],
      submit: "Soumettre",
    },
  };
  static saveLanguage(lang) {
    localStorage.setItem("preferredLanguage", lang);
  }

  static getLanguage() {
    const params = new URLSearchParams(window.location.search);
    return params.get("lang") ?? localStorage.getItem("preferredLanguage") ?? "EN";
  }

  static constructHTML(lang) {
    if (!Translator.translations[lang]) return;
    const {
      title,
      full_name,
      company_name,
      mats,
      goals,
      goals_options,
      classes,
      classes_options,
      submit,
    } = Translator.translations[lang];
    document.title = title;
    document.querySelector("#navbar h1").innerHTML = title;
    const html = `
      <form id="yoga-form" action="server/yoga-form.php" method="post">
        <div class="form-input">
          <label>${full_name}</label>
          <input type="text" name="full_name" />
        </div>
        <div class="form-input">
          <label>${company_name}</label>
          <input type="text" name="company_name" />
        </div>
        <div class="form-input">
          <label>${mats}</label>
          <input type="text" name="mats_required" autocomplete="off" />
        </div>
        <div class="center">
          <label>${goals}</label>
        </div>
        <div class="checkbox-list">
        ${goals_options
          .map(
            (g) =>
              `<div><input type="checkbox" name="goal_of_class" value="${g.value}" />${g.translation}</div>`
          )
          .join("")}
        </div>
        <div class="center">
          <label>${classes}</label>
        </div>
        <div class="checkbox-list">
          ${classes_options
            .map(
              (g) =>
                `<div><input type="checkbox" name="class_duration" value="${g.value}" />${g.translation}</div>`
            )
            .join("")}
        </div>
        <div class="submit-btn">
          <button type="submit">${submit}</button>
        </div>
      </form>
    `;

    document.querySelector(".content").innerHTML = html;

    UI.makeFormAJAX(document.getElementById("yoga-form"), (data) => {
      if (data.success) Message.success("Submitted successfully!");
      else Message.error(data.errors ? data.errors.join(" ") : data);
    });
  }
}

UI.onPageReady(() => {
  AddThisHelper.initGlobals();
  const langOptions = document.getElementsByClassName("lang-option");
  let language = Translator.getLanguage();

  UI.addEvent(document.getElementById("lang"), "click", () => {
    UI.forEach(langOptions, (lang) => {
      // there's only two translations so this is fine for now
      if (lang.classList.contains("active")) lang.classList.remove("active");
      else {
        lang.classList.add("active");
        language = lang.getAttribute("data-lang");
        Translator.constructHTML(language);
        Translator.saveLanguage(language);
      }
    });
  });

  UI.forEach(langOptions, (lang) => {
    if (lang.getAttribute("data-lang") === language) lang.classList.add("active");
    else lang.classList.remove("active");
  });

  Translator.constructHTML(language);
  Translator.saveLanguage(language);
});

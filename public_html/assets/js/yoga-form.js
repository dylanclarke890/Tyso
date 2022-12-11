class Translation {
  constructor(translations = {}) {
    this.translations = translations;
  }

  setLanguage(lang) {
    this.lang = lang;
  }

  translate = (lang = null) =>
    this.translations[this.lang] ?? this.translations[lang] ?? this.translations["EN"];
}

class Translator {
  static translations = {
    title: new Translation({ EN: "TYSO Survey", FR: "TYSO Sondage" }),
    full_name: new Translation({ EN: "Full Name:", FR: "Nom complet:" }),
    company_name: new Translation({ EN: "Company Name:", FR: "Nom de l'entreprise:" }),
    mats: new Translation({
      EN: "Available yoga mats in space:",
      FR: "Tapis de yoga disponible dans l’espace:",
    }),
    goals: new Translation({
      EN: "What are the goal(s) of the Yoga class?",
      FR: "Quel est l’objectif recherché dans la classe de yoga?",
    }),
    goals_options: [
      {
        value: "Balance",
        translation: new Translation({ EN: "Body-mind Balance", FR: "Balance esprit et corps" }),
      },
      {
        value: "Force",
        translation: new Translation({ EN: "Physical Strength", FR: "Force physique" }),
      },
      {
        value: "Concentration",
        translation: new Translation({
          EN: "Enhanced Focus",
          FR: "Amélioration de la concentration",
        }),
      },
      {
        value: "Conscience",
        translation: new Translation({
          EN: "Fostering Mindfulness",
          FR: "Travailler sur la pleine conscience",
        }),
      },
      {
        value: "TeamBuilding",
        translation: new Translation({ EN: "Team Building", FR: "Activités de 'team building'" }),
      },
      {
        value: "Leadership",
        translation: new Translation({
          EN: "Corporate Leadership Workshop",
          FR: "Ateliers sur le leadership en entreprise",
        }),
      },
      {
        value: "YogaIntro",
        translation: new Translation({ EN: "Introduction to Yoga", FR: "Introduction au yoga" }),
      },
      {
        value: "MeditationIntro",
        translation: new Translation({
          EN: "Introduction to Meditation",
          FR: "Introduction à la méditation",
        }),
      },
    ],
    classes: new Translation({ EN: "Series of classes:", FR: "Séries de classes:" }),
    classes_options: [
      { value: "One", translation: new Translation({ EN: "One class", FR: "Une classe" }) },
      { value: "Five", translation: new Translation({ EN: "5 weeks", FR: "5 semaines" }) },
      { value: "Ten", translation: new Translation({ EN: "10 weeks", FR: "10 semaines" }) },
      { value: "Twenty", translation: new Translation({ EN: "20 weeks", FR: "20 semaines" }) },
    ],
    submit: new Translation({ EN: "Submit", FR: "Soumettre" }),
  };

  static saveLanguage(lang) {
    localStorage.setItem("preferredLanguage", lang);
    for (let key in Translator.translations) {
      const firstLevel = Translator.translations[key];
      if (firstLevel instanceof Translation) firstLevel.setLanguage(lang);
      // must be an array of options otherwise
      else for (let option of firstLevel) option.translation.setLanguage(lang);
    }
  }

  static getLanguage() {
    const params = new URLSearchParams(window.location.search);
    return params.get("lang") ?? localStorage.getItem("preferredLanguage") ?? "EN";
  }

  static constructHTML(lang) {
    Translator.saveLanguage(lang);
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
    } = Translator.translations;

    document.title = title.translate();
    document.querySelector("#navbar h1").innerHTML = title.translate();
    const html = `
      <form id="yoga-form" action="server/yoga-form.php" method="post">
        <div class="form-input">
          <label>${full_name.translate()}</label>
          <input type="text" name="full_name" />
        </div>
        <div class="form-input">
          <label>${company_name.translate()}</label>
          <input type="text" name="company_name" />
        </div>
        <div class="form-input">
          <label>${mats.translate()}</label>
          <input type="text" name="mats_required" autocomplete="off" />
        </div>
        <div class="center">
          <label>${goals.translate()}</label>
        </div>
        <div class="checkbox-list">
        ${goals_options
          .map(
            (g) =>
              `<div><input type="checkbox" name="goal_of_class" value="${
                g.value
              }" />${g.translation.translate()}</div>`
          )
          .join("")}
        </div>
        <div class="center">
          <label>${classes.translate()}</label>
        </div>
        <div class="checkbox-list">
          ${classes_options
            .map(
              (g) =>
                `<div><input type="checkbox" name="class_duration" value="${
                  g.value
                }" />${g.translation.translate()}</div>`
            )
            .join("")}
        </div>
        <div class="submit-btn">
          <button type="submit">${submit.translate()}</button>
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
      }
    });
  });

  UI.forEach(langOptions, (lang) => {
    if (lang.getAttribute("data-lang") === language) lang.classList.add("active");
    else lang.classList.remove("active");
  });

  Translator.constructHTML(language);
});

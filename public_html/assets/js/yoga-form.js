document.addEventListener("DOMContentLoaded", addEvents);

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
        { value: "Team building", translation: "Team building" },
        { value: "Leadership", translation: "Corporate Leadership Workshop" },
        { value: "Intro to yoga", translation: "Introduction to Yoga" },
        { value: "Intro to meditation", translation: "Introduction to Meditation" },
      ],
      classes: "Series of classes:",
      classes_options: [
        { value: "Une classe", translation: "One class" },
        { value: "5 semaines", translation: "5 weeks" },
        { value: "10 semaines", translation: "10 weeks" },
        { value: "20 semaines", translation: "20 weeks" },
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
        { value: "Team building", translation: "Activités de 'team building'" },
        { value: "Leadership", translation: "Ateliers sur le leadership en entreprise" },
        { value: "Intro to yoga", translation: "Introduction au yoga" },
        { value: "Intro to meditation", translation: "Introduction à la méditation" },
      ],
      classes: "Séries de classes:",
      classes_options: [
        { value: "Une classe", translation: "Une classe" },
        { value: "5 semaines", translation: "5 semaines" },
        { value: "10 semaines", translation: "10 semaines" },
        { value: "20 semaines", translation: "20 semaines" },
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
      <form action="forms/process.php" method="post">
        <input type="hidden" name="form_tools_form_id" value="3" />
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
          <input type="text" name="mats" autocomplete="off" />
        </div>
        <div class="center">
          <label>${goals}</label>
        </div>
        <div class="checkbox-list">
        ${goals_options
          .map(
            (g) =>
              `<div><input type="checkbox" name="goal[]" value="${g.value}" />${g.translation}</div>`
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
                `<div><input type="checkbox" name="classes[]" value="${g.value}" />${g.translation}</div>`
            )
            .join("")}
        </div>
        <div class="submit-btn">
          <button type="submit">${submit}</button>
        </div>
      </form>
    `;

    document.querySelector(".content").innerHTML = html;
  }
}

function addEvents() {
  const langOptions = document.getElementsByClassName("lang-option");
  let language = Translator.getLanguage();

  document.getElementById("lang").addEventListener("click", function () {
    for (let lang of langOptions) {
      // there's only two translations so this is fine for now
      if (lang.classList.contains("active")) lang.classList.remove("active");
      else {
        lang.classList.add("active");
        language = lang.getAttribute("data-lang");
        Translator.constructHTML(language);
        Translator.saveLanguage(language);
      }
    }
  });

  for (let lang of langOptions) {
    if (lang.getAttribute("data-lang") === language) lang.classList.add("active");
    else lang.classList.remove("active");
  }
  Translator.constructHTML(language);
  Translator.saveLanguage(language);
}
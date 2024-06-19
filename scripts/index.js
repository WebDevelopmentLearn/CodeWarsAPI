import { langObj, HEADERS } from "../src/utils.js";

import {
  form,
  input,
  btn,
  img,
  langList,
  githubSourceBtn,
  githubLogo,
  githubSpan,
  profile,
  openSidebarBtn,
  sidebarContainer,
} from "../src/elements.js";

async function fetchData() {
  let data = null;
  try {
    const response = await fetch(`https://www.codewars.com/api/v1/users/${input.value}`, {
      headers: HEADERS,
    });
    data = await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
  return data;
}

function initCardElements() {
  const langName = document.createElement("h3");
  const rankTypePar = document.createElement("p");
  const rankPar = document.createElement("p");
  const scorePar = document.createElement("p");
  const colorPar = document.createElement("p");

  langName.textContent = "";
  rankTypePar.textContent = "Ранг: ";
  rankPar.textContent = "Очков ранга: ";
  scorePar.textContent = "Очков: ";
  colorPar.textContent = "Цвет: ";

  return {
    lang: langName,
    rankType: rankTypePar,
    rank: rankPar,
    score: scorePar,
    color: colorPar,
  };
}

let skillsObj = [];

function createLangCard(langName, data) {
  const langContainer = document.createElement("div");
  langContainer.classList.add("langCard");
  const elementsObj = initCardElements();

  const headerCard = document.createElement("div");
  headerCard.classList.add("headerCard");

  const infoCard = document.createElement("div");
  infoCard.classList.add("infoCard");

  let iconUrl = `./assets/langs/${langName}_icon.svg`;
  // console.log(`OldName: ${langName}`);
  if (langName in langObj) {
    langName = langObj[langName];
  }
  elementsObj.lang.textContent = langName;
  elementsObj.rankType.textContent += data.name;
  elementsObj.rank.textContent += data.rank;
  elementsObj.score.textContent += data.score;
  elementsObj.color.textContent += data.color;
  const langIcon = document.createElement("img");
  langIcon.classList.add("langIcon");
  langIcon.onerror = function () {
    langIcon.src = `./assets/production.png`; // Изменяем src непосредственно
  };
  langIcon.src = iconUrl;

  const newObj = {
    lang: langName,
    rankType: data.name,
    rank: data.rank,
    score: data.score,
    color: data.color,
  };

  skillsObj.push(newObj);
  headerCard.append(langIcon, elementsObj.lang);
  infoCard.append(elementsObj.rankType, elementsObj.score, elementsObj.color);
  langContainer.append(headerCard, infoCard);

  langContainer.style.border = `1px solid ${data.color}`;
  langContainer.style.boxShadow = `0px 0px 10px ${data.color}`;

  langContainer.addEventListener("pointerover", (event) => {
    langContainer.style.boxShadow = `0px 0px 30px ${data.color}`;
    langContainer.style.border = `2px solid ${data.color}`;
  });
  langContainer.addEventListener("pointerout", (event) => {
    langContainer.style.boxShadow = `0px 0px 10px ${data.color}`;
    langContainer.style.border = `1px solid ${data.color}`;
  });
  return langContainer;
}

async function fetchAdditionData() {
  let data = null;
  try {
    const response = await fetch(
      `https://www.codewars.com/api/v1/users/${input.value}/code-challenges/completed?page={page}`,
      {
        headers: HEADERS,
      }
    );
    data = await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
  return data;
}
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (input.value === "") return;
  try {
    const container = document.createElement("div");
    container.classList.add("container");
    for (let i = 0; i < 4; i++) {
      const bar = document.createElement("div");
      bar.classList.add("bar");
      container.append(bar);
    }
    langList.textContent = "";
    profile.textContent = "";
    profile.append(container);

    const data = await fetchData();
    const additionData = await fetchAdditionData();
    profile.textContent = "";
    // console.log(data);
    console.log(additionData);
    getCompleetedKataData(additionData);
    const badge = document.createElement("img");

    badge.setAttribute("src", `https://www.codewars.com/users/${data.username}/badges/large`);
    badge.classList.add("userBadge");

    profile.append(badge);
    // h2.textContent = defaulH2;
    // h2.textContent += data.username;
    const ranks = await data.ranks;
    langList.textContent = "";

    for (const language in ranks.languages) {
      if (ranks.languages.hasOwnProperty(language)) {
        const value = ranks.languages[language];
        // const lang = document.createElement("div");
        const container = createLangCard(language, value);
        // console.log(container);
        // container.addEventListener("mousemove", hoverRender);

        // lang.append(container);
        langList.append(container);
      }
    }
    // console.log(langList);
  } catch (error) {
    console.error("Error getting data:", error);
  }
});
const completedKataArray = [];
function getCompleetedKataData(additionData) {
  for (const key in additionData.data) {
    const value = additionData.data[key];

    // completedAt
    // :
    // "2024-06-18T13:47:45.135Z"
    // completedLanguages
    // :
    // ['javascript']
    // id
    // :
    // "57a0556c7cb1f31ab3000ad7"
    // name
    // :
    // "MakeUpperCase"
    // slug
    // :
    // "makeuppercase"

    console.log(key, value);
    const kataObj = {
      title: value.name,
      id: value.id,
      completedLanguages: value.completedLanguages,
      completedAt: value.completedAt,
    };
    completedKataArray.push(kataObj);
  }
  console.log(completedKataArray);
}

// sortBtn.addEventListener("click", () => {
//   if (skillsObj.length === 0) return;
//   let sortedArray = skillsObj.sort((firstEl, secondEl) => {
//     return firstEl.score - secondEl.score;
//   });
//   skillsObj = sortedArray;
//   console.log(skillsObj);
// });

function updateLangList(objArray) {}

githubSourceBtn.addEventListener("mouseover", (event) => {
  setStyles("mouseover");
});

githubSourceBtn.addEventListener("mouseout", (event) => {
  setStyles("mouseout");
});

// openSidebarBtn.addEventListener("click", () => {
//   sidebarContainer.classList.add("open");
// });

function setStyles(type) {
  type === "mouseover"
    ? (githubSourceBtn.style.backgroundColor = "#434343")
    : (githubSourceBtn.style.backgroundColor = "");
  type === "mouseover" ? (githubSpan.style.color = "#ffffff") : (githubSpan.style.color = "");
  githubLogo.setAttribute(
    "src",
    type === "mouseover" ? "./assets/github_logo_light.svg" : "./assets/github_logo_dark.svg"
  );
}

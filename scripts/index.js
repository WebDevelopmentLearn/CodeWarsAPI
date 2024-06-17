const form = document.querySelector("form");
const input = document.querySelector("#nickname");
const btn = document.querySelector(".superBtn");
const img = document.querySelector(".avatar");
const langList = document.querySelector(".langList");
const sortBtn = document.querySelector(".sortBtn");
// const defaulH2 = h2.textContent;
const githubSourceBtn = document.querySelector(".githubSourceBtn");
const githubSpan = document.querySelector("#githubSpan");
const githubLogo = document.querySelector(".githubLogo");
const profile = document.querySelector(".profile");

const HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST,PATCH,OPTIONS",
};

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
const langObj = {
  javascript: "JavaScript",
  python: "Python",
  java: "Java",
  csharp: "C#",
  swift: "Swift",
  sql: "SQL",
  prolog: "Prolog",
  kotlin: "Kotlin",
  c: "C",
  scala: "Scala",
  ruby: "Ruby",
  r: "R",
  go: "Golang",
  cpp: "C++",
};

function createLangCard(langName, data) {
  const langContainer = document.createElement("div");
  langContainer.classList.add("langCard");
  const elementsObj = initCardElements();

  const headerCard = document.createElement("div");
  headerCard.classList.add("headerCard");

  const infoCard = document.createElement("div");
  infoCard.classList.add("infoCard");

  // for (const langKey in langObj) {
  //   const element = langObj[langKey];
  //   // console.log(langKey, element);
  //   // console.log(langName, langKey);
  //   // if (langKey === langName) {
  //   //   elementsObj.lang.textContent = element;
  //   // } else {
  //   //   elementsObj.lang.textContent = langName;
  //   // }
  //   elementsObj.lang.textContent = langKey === langName ? element : langName;
  // }

  const iconUrl = `../assets/langs/${langName}_icon.svg`;
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
  langIcon.setAttribute("src", iconUrl);

  const newObj = {
    lang: langName,
    rankType: data.name,
    rank: data.rank,
    score: data.score,
    color: data.color,
  };

  skillsObj.push(newObj);
  headerCard.append(langIcon, elementsObj.lang);
  infoCard.append(elementsObj.rank, elementsObj.score, elementsObj.color);
  langContainer.append(headerCard, infoCard);

  langContainer.style.border = `1px solid ${data.color}`;
  langContainer.style.boxShadow = `0px 0px 10px ${data.color}`;

  langContainer.addEventListener("pointerover", (event) => {
    langContainer.style.boxShadow = `0px 0px 20px ${data.color}`;
  });

  langContainer.addEventListener("pointerout", (event) => {
    langContainer.style.boxShadow = `0px 0px 10px ${data.color}`;
  });
  console.log("test");
  return langContainer;
}

// function hoverRender(event) {
//     let x = event.offsetX;
//     let y = event.offsetY;
//     console.log(x, y);
// }

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
    const data = await fetchData();
    const additionData = await fetchAdditionData();
    console.log(data);
    console.log(additionData);
    const badge = document.createElement("img");
    profile.textContent = "";
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

sortBtn.addEventListener("click", () => {
  if (skillsObj.length === 0) return;
  let sortedArray = skillsObj.sort((firstEl, secondEl) => {
    return firstEl.score - secondEl.score;
  });
  skillsObj = sortedArray;
  console.log(skillsObj);
});

function updateLangList(objArray) {}

githubSourceBtn.addEventListener("mouseover", (event) => {
  setStyles("mouseover");
});

githubSourceBtn.addEventListener("mouseout", (event) => {
  setStyles("mouseout");
});

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

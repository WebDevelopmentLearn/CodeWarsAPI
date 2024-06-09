
const form = document.querySelector("form");
const input = document.querySelector("#nickname");
const btn = document.querySelector(".superBtn");
const h2 = document.querySelector("h2");
const img = document.querySelector(".avatar");
const langList = document.querySelector(".langList");
const sortBtn = document.querySelector(".sortBtn");
const defaulH2 = h2.textContent;

const HEADERS = {'Content-Type':'application/json',
    'Access-Control-Allow-Origin':'*',
    'Access-Control-Allow-Methods':'POST,PATCH,OPTIONS'}


async function fetchData() {
    let data = null;
    try {
        const response = await fetch(`https://www.codewars.com/api/v1/users/${input.value}`, {
            headers: HEADERS
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

    langName.textContent = "Название ЯП: ";
    rankTypePar.textContent = "Ранг: ";
    rankPar.textContent = "Очков ранга: ";
    scorePar.textContent = "Очков: ";
    colorPar.textContent = "Цвет: ";

    return {
        lang: langName,
        rankType: rankTypePar,
        rank: rankPar,
        score: scorePar,
        color: colorPar
    }
}

let skillsObj = [];


function createLangCard(langName, data) {
    const langContainer = document.createElement("div");
    langContainer.classList.add("langContainer");
    const elementsObj = initCardElements();

    elementsObj.lang.textContent += langName;
    elementsObj.rankType.textContent += data.name
    elementsObj.rank.textContent += data.rank;
    elementsObj.score.textContent += data.score;
    elementsObj.color.textContent += data.color;

    const newObj = {
        lang: langName,
        rankType: data.name,
        rank: data.rank,
        score: data.score,
        color: data.color
    }

    console.log(newObj);
    skillsObj.push(newObj);
    langContainer.append(elementsObj.lang,  elementsObj.rankType, elementsObj.rank, elementsObj.score, elementsObj.color);
    return langContainer;
}



form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (input.value === "") return;
    try {
        const data = await fetchData();
        console.log(data);
        h2.textContent = defaulH2;
        h2.textContent += data.username;
        const ranks = await data.ranks;
        // console.log(typeof ranks.languages);
        langList.textContent = "";
        // ranks.languages.forEach((el) => {
        //     console.log(el);
        // });

        for (const language in ranks.languages) {
            if (ranks.languages.hasOwnProperty(language)) {
                const value = ranks.languages[language];
                // skillsObj.push(value);
                const lang = document.createElement("li");
                const container = createLangCard(language, value);
               lang.append(container);
               langList.append(lang);
            }
        }


    } catch (error) {
        console.error("Error getting data:", error);
    }
})

sortBtn.addEventListener("click", () => {
    if (skillsObj.length === 0) return;
    let sortedArray = skillsObj.sort((firstEl, secondEl) => {
        return firstEl.score - secondEl.score;
    });
    skillsObj = sortedArray;
    console.log(skillsObj);
});

function updateLangList(objArray) {

}

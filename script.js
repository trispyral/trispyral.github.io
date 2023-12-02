"use strict"

async function initialize() {
    const response = await getDatabase();
    const database = JSON.parse(response);

    createProjectsItems(database)

    translateInterface(database['interfaceText'], "innerText");
    translateInterface(database['interface-values'], "value");
    translateInterface(database['interface-placeholders'], "placeholder");
}

function createProjectsItems(database) {
    let projectsList = document.querySelector(".projects-list");
    for(const project of database['content'].items) {
        if (project.isVisible) {
            projectsList.appendChild(createProjectItem(project));
        }
    }
}

function createProjectItem(databaseItem) {
    let newCard = document.importNode(document.querySelector("template#pageCard").content,true);
    newCard.querySelector(".pageCardImage").src = databaseItem.imgSrc;
    newCard.querySelector(".pageCardTitle").innerText = databaseItem.name;
    newCard.querySelector(".pageCardShortDescription").innerHTML = databaseItem.shortDescription;
    if (databaseItem.isLiveDemoEnabled) {
        newCard.querySelector(".pageCardPlayButton").href = databaseItem.linkLiveDemo;
        newCard.querySelector(".pageCardPlayButton").setAttribute('disabled',false);
    }
    return newCard;
}

async function getDatabase() {
    let language = navigator.language;
    if (language != 'en-US' && language != 'pt-BR') {
        language = 'en-US';
    }
    if (language == 'pt') {
        language = 'pt-BR';
    }
    const response = await fetch(`./database/${language}.json`);
    if (response.status == 200 || response.statusText == 'OK') {
        return await response.text();
    } else {
        return `[ERROR] Database not found. code ${response.status}: ${response.statusText}`;
    }
}

function translateInterface(strings, attribute) {
    Object.keys(strings).forEach( string => {
        document.querySelectorAll(`.${string}`).forEach(element => {
            element[attribute] = strings[string];
        });
    });
}

function sendEmail() {
    const emailSubject = document.querySelector("input[name='subject']").value;
    const emailBody = document.querySelector("textarea[name='body']").value;
    window.location.href = `mailto:anderson584bf@gmail.com?subject=${emailSubject}&body=${encodeURIComponent(emailBody)}`;
}

initialize();
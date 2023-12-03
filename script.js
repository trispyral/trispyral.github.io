"use strict"

let database;

async function initialize() {
    const response = await getDatabase();
    database = JSON.parse(response);

    createProjectsItems(database)

    translateInterface(database['interfaceText'], "innerText");
    translateInterface(database['interface-values'], "value");
    translateInterface(database['interface-placeholders'], "placeholder");

    document.querySelector('#projectDetails').style.display = 'None';
    document.querySelector('.windowBackground').addEventListener('click', (event) => {
        disableProjectDetails()
    });
}

function disableProjectDetails () {
    let projectDetailsDomStyle = document.querySelector('#projectDetails').style;
    projectDetailsDomStyle.display = 'none';
    document.querySelector('body').style.overflow = 'unset';
}

function createProjectsItems(database) {
    let projectsList = document.querySelector(".projects-list");
    let index = 0;
    for(const project of database['content'].items) {
        if (project.isVisible) {
            projectsList.appendChild(createProjectItem(project, index));
            index++;
        }
    }
}

function createProjectItem(databaseItem, index) {
    let newCard = document.importNode(document.querySelector("template#pageCard").content,true);
    newCard.firstElementChild.setAttribute('dataIndex', index);
    newCard.querySelector(".pageCardImage").src = databaseItem.imgSrc;
    newCard.querySelector(".pageCardTitle").innerText = databaseItem.name;
    newCard.querySelector(".pageCardShortDescription").innerHTML = databaseItem.shortDescription;
    if (databaseItem.isLiveDemoEnabled) {
        newCard.querySelector(".pageCardPlayButton").href = databaseItem.linkLiveDemo;
        newCard.querySelector(".pageCardPlayButton").setAttribute('disabled',false);
    }
    newCard.querySelector('.pageCardBody').addEventListener('click', (event) => {
        if (event.target.tagName != "A") {
            enableProjectDetails(event);
        }
        
    });
    return newCard;
}

function enableProjectDetails(event) {
    let projectDetailsDomStyle = document.querySelector('#projectDetails').style;
    projectDetailsDomStyle.display = 'unset';
    document.querySelector('body').style.overflow = 'hidden';
    let index =event.target.attributes.dataindex.nodeValue;
    let projectDate = database['content']['items'][index];
    let projectDom = document.querySelector('#projectDetails');
    projectDom.querySelector('img').src = projectDate.imgSrc;
    projectDom.querySelector('.projectDetailsTitle').innerText = projectDate.name;
    projectDom.querySelector('.projectDetailsCategory').innerText = projectDate.category;
    projectDom.querySelector('main').innerHTML = projectDate.description;
    projectDom.querySelector('a').href = projectDate.linkLiveDemo;
    projectDom.querySelector('a').innerText = database.interfaceText.pageCardPlayButton;
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
const positionElement = document.getElementById('position');
const companyElement = document.getElementById('company');
const dateElement = document.getElementById('date');
const appStatusElement = document.getElementById('status');
const appForm = document.getElementById('app-form');
const appUl = document.getElementById('app-ul');
const exportBtn = document.getElementById('export-btn');
const clearBtn = document.getElementById('clear-btn');

loadApplications();

appForm.addEventListener('submit', (event) =>{
    event.preventDefault();

    const formData = {
        position: positionElement.value,
        company: companyElement.value,
        date: dateElement.value,
        appStatus: appStatusElement.value
    }

    saveApplication(formData);
    addToPopup(formData);
});

function loadApplications() {
    chrome.storage.local.get({applications: []}, (result) => {
        result.applications.forEach(addToPopup);
    });
}   

function addToPopup(app) {
    const li = document.createElement('li');
    li.textContent = appToString(app);
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delete';
    li.appendChild(deleteBtn);
    appUl.appendChild(li);
    deleteBtn.addEventListener('click', deleteApplication);
}

function saveApplication(application) {
    chrome.storage.local.get({applications: []}, (result) => {
        const applications = result.applications;
        applications.push(application);
        chrome.storage.local.set({ applications });
    });
}

function deleteApplication(event) {
    const li = event.target.parentElement;
    const liText = li.firstChild.textContent;
    chrome.storage.local.get({applications: []}, (result) => {
        const updated = result.applications.filter(app => {
            const appText = appToString(app);
            return liText !== appText;
        });
        appUl.removeChild(li);
        chrome.storage.local.set({ applications: updated });
    });
}

function appToString(app) {
    return `${app.position} - ${app.company} - ${app.date} - ${app.appStatus}`;
}
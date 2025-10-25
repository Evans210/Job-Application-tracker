const positionElement = document.getElementById('position');
const companyElement = document.getElementById('company');
const dateElement = document.getElementById('date');
const appStatusElement = document.getElementById('status');
const appForm = document.getElementById('app-form');
const appUl = document.getElementById('app-ul');
const copyBtn = document.getElementById('copy-btn');
const clearBtn = document.getElementById('clear-btn');

loadApplications();
dateElement.value = new Date().toISOString().split('T')[0];
restoreDraft();

[positionElement, companyElement, dateElement, appStatusElement].forEach(el =>
    el.addEventListener('input', saveDraft)
);

appForm.addEventListener('submit', (event) =>{
    event.preventDefault();
    const formData = {
        position: positionElement.value,
        company: companyElement.value,
        date: dateElement.value,
        appStatus: appStatusElement.value
    };
    saveApplication(formData);
    addToPopup(formData);
    appForm.reset();
    dateElement.value = new Date().toISOString().split('T')[0];
    chrome.storage.local.remove('formDraft');
});

copyBtn.addEventListener('click', () => {
    copyApplications();
});

clearBtn.addEventListener('click', () => {
    clearApplications();
});

function restoreDraft() {
    chrome.storage.local.get({ formDraft: {} }, (result) => {
        const draft = result.formDraft;
        if (draft.position) positionElement.value = draft.position;
        if (draft.company) companyElement.value = draft.company;
        if (draft.date) dateElement.value = draft.date;
        if (draft.appStatus) appStatusElement.value = draft.appStatus;
    });
}

function saveDraft() {
    const draft = {
        position: positionElement.value,
        company: companyElement.value,
        date: dateElement.value,
        appStatus: appStatusElement.value
    };
    chrome.storage.local.set({ formDraft: draft });
}

function sortApplications(applications) {
    return applications.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function loadApplications() {
    chrome.storage.local.get({applications: []}, (result) => {
        const sortedApps = sortApplications(result.applications);
        sortedApps.forEach(addToPopup);
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

function formatDate(dateStr) {  
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`; // dd/mm/yyyy
}

function appToString(app) {
    return `${app.position} - ${app.company} - ${formatDate(app.date)} - ${app.appStatus}`;
}

function copyApplications(){
    chrome.storage.local.get({applications: []}, (result) => {
        const sortedApps = sortApplications(result.applications);
        let clipboardTxt = 'JOB APPLICATION REPORT:\n\n';

        sortedApps.forEach(app => {
            clipboardTxt += appToString(app) + "\n";
        });

        navigator.clipboard.writeText(clipboardTxt);
        alert("Copied to clipboard!");
    });
}

function clearApplications() {
    if (!confirm("Are you sure you want to clear all applications?")) {
        return;
    }
    chrome.storage.local.set({ applications: [] });
    while (appUl.firstChild) {
        appUl.removeChild(appUl.firstChild);
    }
}
const positionElement = document.getElementById('position');
const companyElement = document.getElementById('company');
const dateElement = document.getElementById('date');
const appStatusElement = document.getElementById('status');

const appForm = document.getElementById('app-form');
const appUl = document.getElementById('app-ul');

const exportBtn = document.getElementById('export-btn');
const clearBtn = document.getElementById('clear-btn');


appForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const appData = {
        position: positionElement.value,
        company: companyElement.value,
        date: dateElement.value,
        appStatus: appStatusElement.value
    }

    const li = document.createElement('li');
    li.textContent = `${appData.position} - 
                    ${appData.company} - 
                    ${appData.date} - 
                    ${appData.appStatus}`;
    
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delete';

    li.appendChild(deleteBtn);
    appUl.appendChild(li);

    deleteBtn.addEventListener('click', deleteApp);
});


function deleteApp(event) {
    const deleteClicked = event.target;
    const app = deleteClicked.parentElement;
    app.remove();
}
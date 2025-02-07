const elInputName = document.querySelector('.action__input-name');
const elInputVacancy = document.querySelector('.action__input-vacancy');
const elInputNumber = document.querySelector('.action__input-number');
const btnAdd = document.querySelector('.action__btn-add');
const btnClear = document.querySelector('.action__btn-clear');
const btnTitle = document.querySelectorAll('.list__column-el');
const listValue = document.querySelectorAll('.value');
import { PATTERN_ABC, PATTERN_NUM } from './constants.js';
let contacts = JSON.parse(localStorage.getItem('contacts')) || [];

function checkListValue() {
    btnTitle.forEach(el => { setValue(el); }); 
}

function saveToLS(key, data) {
    const jsonData = JSON.stringify(data);
    localStorage.setItem(key, jsonData);
}

function addItem(data) {
    contacts.push(data);
    saveToLS('contacts', contacts);
}

function deleteItem(id) {
    contacts = contacts.filter(item => item.id !== id);
    saveToLS('contacts', contacts);
}

function editItem(id, updatedItem) {
    contacts = contacts.map(item => item.id === id ? updatedItem : item);
    saveToLS('contacts', contacts);
}

function contactObjectCreate() {
    const contactObject = {};
    const elInputInfo = {
        Name: elInputName.value,
        Vacancy: elInputVacancy.value,
        Number: elInputNumber.value
    };

    const isValid = textValidate(elInputInfo);

    if(!isValid) return null;

    contactObject.id = Date.now();
    contactObject.Name = elInputName.value;
    contactObject.Vacancy = elInputVacancy.value;
    contactObject.Number = elInputNumber.value;

    elInputName.value = '';
    elInputVacancy.value = '';
    elInputNumber.value = '';

    console.log(contactObject);
    

    return contactObject;
}

function textValidate(elInputInfo) {
    let rightState = true;

    if (elInputInfo.Name === "" || !PATTERN_ABC.test(elInputInfo.Name)) {
        elInputName.classList.add('error');
        rightState = false;
    } else {
        elInputName.classList.remove('error');
    }

    if (elInputInfo.Vacancy === "" || !PATTERN_ABC.test(elInputInfo.Vacancy)) {
        elInputVacancy.classList.add('error');
        rightState = false;
    } else {
        elInputVacancy.classList.remove('error');
    }

    if (elInputInfo.Number === "" || !PATTERN_NUM.test(elInputInfo.Number) || elInputInfo.Number.length !== 12 || elInputInfo.Number[0] != "+") {
        elInputNumber.classList.add('error');
        rightState = false;
    } else {
        elInputNumber.classList.remove('error');
    }

    return rightState;
}

function elementDivCreate(data) {
    if (!data || !data.Name || !data.Vacancy || !data.Number) {
        console.error('Invalid data:', data);
        return null;
    }

    const newDiv = document.createElement('div');
    newDiv.classList.add('element__wrap', 'unvisible');

    const newElements = newDivElem(data)

    newDiv.append(newElements.name, newElements.vacancy, newElements.number, addActionButton('delete', "", data), addActionButton('edit', newElements, data));
    return newDiv;
}

function newDivElem(data) {
    const newElName = document.createElement('p');
    const newElVacancy = document.createElement('p');
    const newElNumber = document.createElement('p');

    newElName.textContent = `Name: ${data.Name}`;
    newElVacancy.textContent = `Vacancy: ${data.Vacancy}`;
    newElNumber.textContent = `Number: ${data.Number}`;

    const newElements= {
        name: newElName,
        vacancy: newElVacancy,
        number: newElNumber
    }

    return newElements;
}

function addActionButton(type, newElements, data) {

    if (!data || typeof data.id === 'undefined') {
        console.log('Invalid or missing data:', data);
        return null;
    }

    const button = document.createElement('button');
    const dataId = data.id;
    console.log('1:', data);
    
    if (type === 'edit') {
        button.classList.add('button');
        button.textContent = 'Edit';
    } else if (type === 'delete') {
        button.classList.add('button', 'btn__delete');
        button.textContent = 'Del';
    } else {
        console.error('Неизвестный тип кнопки');
        return null;
    }

    button.addEventListener('click', function () {
        if (type === 'edit') {
            const editWindow = document.createElement('div');
            editWindow.classList.add('element__edit');

            const editWindowTitle = document.createElement('p');
            editWindowTitle.textContent = 'Edit element';

            const editWindowName = document.createElement('input');
            editWindowName.value = newElements.name.textContent.replace('Name: ', '');
            editWindowName.classList.add('element__edit-input');

            const editWindowVacancy = document.createElement('input');
            editWindowVacancy.value = newElements.vacancy.textContent.replace('Vacancy: ', '');
            editWindowVacancy.classList.add('element__edit-input');

            const editWindowNum = document.createElement('input');
            editWindowNum.value = newElements.number.textContent.replace('Number: ', '');
            editWindowNum.classList.add('element__edit-input');

            const btnSave = document.createElement('button');
            btnSave.classList.add('button');
            btnSave.textContent = 'Save';

            editWindow.append(editWindowTitle, editWindowName, editWindowVacancy, editWindowNum, btnSave);
            document.body.appendChild(editWindow);

            btnSave.addEventListener('click', function () {

                const updatedData = {
                    id: dataId,
                    Name: editWindowName.value,
                    Vacancy: editWindowVacancy.value,
                    Number: editWindowNum.value
                };
            
                if (validateCopied(updatedData)) {
                    alert('This phone number already exists!');
                    return;
                }

                if (!textValidate(updatedData)) {
                    return alert('Invalid data!');
                }
            
                newElements.name.textContent = `Name: ${updatedData.Name}`;
                newElements.vacancy.textContent = `Vacancy: ${updatedData.Vacancy}`;
                newElements.number.textContent = `Number: ${updatedData.Number}`;
            
                document.body.removeChild(editWindow);
                console.log('Edit ID:', dataId);
                editItem(dataId, updatedData);
                location.reload();

            });
        } else if (type === 'delete') {
            button.parentElement.remove();
            checkListValue();
            console.log('Deleting item with ID:', data);
            deleteItem(dataId);
        }
    });

    return button;
}

function getListById(name) {
    let elIdDefault = name.charAt(0);
    let elId = elIdDefault.toLowerCase();
    return document.getElementById(elId);
}

function appendToList(list, el) {
    list.appendChild(el);
}

function removeToList() {
    const elements = document.querySelectorAll(".element__wrap");
    elements.forEach(el => { el.remove(); });
    checkListValue();
    localStorage.removeItem('contacts'); 
}

function setValue(el) {
    const value = el.querySelector('.value');
    if (el.children.length <= 1) {
        value.textContent = null;
    } else {
        value.textContent = el.children.length - 1;
    }
}

btnClear.addEventListener('click', function() {
    removeToList();
});

btnTitle.forEach(el => {
    let isVisible = false;

    el.firstChild.addEventListener('click', function () {
        const children = el.querySelectorAll(':scope > .element__wrap');
        children.forEach(child => {
            if (isVisible) {
                child.classList.add('unvisible');
            } else {
                child.classList.remove('unvisible'); 
            }
        });

        isVisible = !isVisible;

        setValue(el);
    });
});

btnAdd.addEventListener('click', function() {
    const elObj = contactObjectCreate();
    console.log(elObj);

    if (elObj && elObj.Name && elObj.Vacancy && elObj.Number) {
        if (validateCopied(elObj)) {
            return alert('Dublicate!');
        }
        const newDiv = elementDivCreate(elObj);
        const list = getListById(elObj.Name);
        appendToList(list, newDiv);
        checkListValue();
        addItem(elObj);
    }
});

function validateCopied(elObj) {
    const allEl = document.querySelectorAll(".element__wrap");

    for (const el of allEl) {
        // const name = el.querySelector('p:nth-child(1)').textContent.replace('Name: ', '').trim();
        // const vacancy = el.querySelector('p:nth-child(2)').textContent.replace('Vacancy: ', '').trim();
        const number = el.querySelector('p:nth-child(3)').textContent.replace('Number: ', '').trim();

        if (
            // name === elObj.Name ||
            // vacancy === elObj.Vacancy ||
            number === elObj.Number
        ) {
            return true;
        }
    }

    return false;
}

btnTitle.forEach(el => {
    let isVisible = false;

    el.firstChild.addEventListener('click', function () {
        const children = el.querySelectorAll(':scope > .element__wrap');
        children.forEach(child => {
            if (isVisible) {
                child.classList.add('unvisible');
            } else {
                child.classList.remove('unvisible'); 
            }
        });

        isVisible = !isVisible;

        setValue(el);
    });
});

document.addEventListener("DOMContentLoaded", () => {
    contacts.forEach(data => {
        const newDiv = elementDivCreate(data);
        if (newDiv) {
            const list = getListById(data.Name);
            appendToList(list, newDiv);
        }
    });
    checkListValue();
})
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
    const elInputInfo = getInputInfo()
    const isValid = textValidate(elInputInfo);
    if(!isValid) return null;

    const contactObject = setContactObjectInfo(elInputInfo);
    delInputValue()

    return contactObject;
}

function getInputInfo() {
    return {
        Name: elInputName.value,
        Vacancy: elInputVacancy.value,
        Number: elInputNumber.value
    }
}

function setContactObjectInfo(inputData) {
    return {
        id: Date.now(),
        Name: inputData.Name,
        Vacancy: inputData.Vacancy,
        Number: inputData.Number,
    }
}

function delInputValue() {
    elInputName.value = '';
    elInputVacancy.value = '';
    elInputNumber.value = '';
}

function textValidate(elInputInfo) {
    let rightState = true;
    
    rightState = validateEl(elInputName, elInputInfo.Name, PATTERN_ABC) && rightState;

    rightState = validateEl(elInputVacancy, elInputInfo.Vacancy, PATTERN_ABC) && rightState;

    rightState = validateEl(elInputNumber, elInputInfo.Number, PATTERN_NUM, 
        value => value.length === 12 && value[0] === "+") && rightState;

    return rightState;
}

function validateEl(elInput, value, pattern, rightState = null) {
    if (value === "" || !pattern.test(value) || (rightState && !rightState(value))) {
        elInput.classList.add('error');
        return false;
    } else {
        elInput.classList.remove('error');
        return true;
    }
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
        setChildVisible(el, isVisible = false)

        isVisible = !isVisible;

        setValue(el);
    });
});

function setChildVisible(el, isVisible) {
    const child = el.querySelectorAll(':scope > .element__wrap');
    child.forEach(child => {
        if (isVisible) {
            child.classList.add('unvisible');
        } else {
            child.classList.remove('unvisible'); 
        }
    });
}

btnAdd.addEventListener('click', function() {
    const elObj = contactObjectCreate();
    console.log(elObj);

    elObjAdd(elObj)
});

function elObjAdd(elObj) { 
    if (elObj && elObj.Name && elObj.Vacancy && elObj.Number) {
        if (validateCopied(elObj)) {
            alert('Duplicate contact!');
            return false;
        }

        const newDiv = elementDivCreate(elObj);
        const list = getListById(elObj.Name);
        appendToList(list, newDiv);
        checkListValue();
        addItem(elObj);
    }
}

function validateCopied(elObj) {
    const allEl = document.querySelectorAll(".element__wrap");

    for (const el of allEl) {
        const number = elTextContentReplace(el);

        if (
            number === elObj.Number
        ) {
            return true;
        }
    }

    return false;
}

function elTextContentReplace(el) {
    return el.querySelector('p:nth-child(3)').textContent.replace('Number: ', '').trim();
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
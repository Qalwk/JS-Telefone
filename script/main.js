
const ElInputName = document.querySelector('.action__input-name');
const ElInputVacancy = document.querySelector('.action__input-vacancy');
const ElInputNumber = document.querySelector('.action__input-number');
const BtnAdd = document.querySelector('.action__btn-add');
const BtnClear = document.querySelector('.action__btn-clear');
const BtnTitle = document.querySelectorAll('.list__column-el');
const ListValue = document.querySelectorAll('.value');
let ListState = 0

// добавляем обработчик события на кнопку

function CheckListValue() { 
    BtnTitle.forEach(el => { SetListValue(el); }); // Обновляем значение после удаления всех элементов
}

BtnAdd.addEventListener('click', function() {
    const ElObj = ElObjectCreate();
    const NewDiv = ElementDivCreate(ElObj)
    const List = getListById(ElObj.Name)
    console.log(ElObj.Name)
    appendToList(List, NewDiv)
    CheckListValue()
    SaveDataToLocalStorage(NewDiv)
});

function SaveDataToLocalStorage(data) {
    const storedData = JSON.parse(localStorage.getItem('data')) || []
    storedData.push(data)
    localStorage.setItem('data', JSON.stringify(storedData))
    console.log('Data saved to localStorage:', storedData);
}

function ElObjectCreate() {
    const ElObject = {};
    ElObject.Name = ElInputName.value;
    ElObject.Vacancy = ElInputVacancy.value;
    ElObject.Number = ElInputNumber.value;

    // Очистка полей после создания объекта
    ElInputName.value = '';
    ElInputVacancy.value = '';
    ElInputNumber.value = '';

    return ElObject
}

function ElementDivCreate(data) {

    const NewDiv = document.createElement('div');
    NewDiv.classList.add('element__wrap', 'unvisible');

    const NewElName = document.createElement('p');
    const NewElVacancy = document.createElement('p');
    const NewElNumber = document.createElement('p');

    NewElName.textContent = `Name: ${data.Name}`;
    NewElVacancy.textContent = `Vacancy: ${data.Vacancy}`;
    NewElNumber.textContent = `Number: ${data.Number}`;

    NewDiv.append(NewElName, NewElVacancy, NewElNumber);
    return NewDiv
}

function getListById(name) {
    let ElId = name.charAt(0)
    return document.getElementById(ElId);
}

function appendToList(list, el) {
    list.appendChild(el);
}

BtnClear.addEventListener('click', function() {
    removeToList()
});

function removeToList() {
    const elements = document.querySelectorAll(".element__wrap")
    elements.forEach(el => {el.remove()});
    CheckListValue()
}

function SetListValue(el) {
    const Value = el.querySelector('.value');
    if (el.children.length <= 1) {
        Value.textContent = null
    } else {
        Value.textContent = el.children.length - 1
    }
}

BtnTitle.forEach(el => {
    el.addEventListener('click', function() {
        // console.log('ListState before:', ListState);

        if (ListState === 0) {
            const children = el.querySelectorAll(':scope > .element__wrap');
            children.forEach(child => {
                // console.log('Removing class "unvisible" from:', child);
                child.classList.remove('unvisible');
            });
            ListState = 1;
            SetListValue(el)
        } else {
            const children = el.querySelectorAll(':scope > .element__wrap');
            children.forEach(child => {
                // console.log('Adding class "unvisible" to:', child);
                child.classList.add('unvisible');
            });
            ListState = 0;
            SetListValue(el)
        }
        console.log('ListState after:', ListState);
    });
});
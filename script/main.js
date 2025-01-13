
document.addEventListener('DOMContentLoaded', function() {
// получаем все нужные элементы

const ElInputName = document.querySelector('.action__input-name');
const ElInputVacancy = document.querySelector('.action__input-vacancy');
const ElInputNumber = document.querySelector('.action__input-number');
const BtnAdd = document.querySelector('.action__btn-add');
const BtnClear = document.querySelector('.action__btn-clear');
const BtnTitle = document.querySelectorAll('.list__column-el');
let ListState = 0

// добавляем обработчик события на кнопку

BtnAdd.addEventListener('click', function() {
    const ElObj = ElObjectCreate();
    const NewDiv = ElementDivCreate(ElObj)
    const List = getListById(ElObj.Name)
    appendToList(List, NewDiv)
});

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
    NewDiv.className = 'element__wrap';

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
}

for (const el of BtnTitle) {
    el.addEventListener('click', function() {
        // BtnActive(ElementDivCreate)
        console.log(ListState)

        // if(ListState == 0) {
        //     // Добавляем класс active к элементу
        //     el.firstElementChild.classList.add('active');
        //     ListState = 1; // Переключаем состояние
        //     console.log(ListState)
        // } else {
        //     el.child.classList.remove('active');
        //     ListState = 0;
        // }
    });
}

// function BtnActive(data) {
//     let ListState = 0
//     if(!ListState) {
//         data.classList.add('active');
//     } else {
//         data.classList.remove('active');
//     }
// }

});
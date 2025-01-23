const ElInputName = document.querySelector('.action__input-name');
const ElInputVacancy = document.querySelector('.action__input-vacancy');
const ElInputNumber = document.querySelector('.action__input-number');
const BtnAdd = document.querySelector('.action__btn-add');
const BtnClear = document.querySelector('.action__btn-clear');
const BtnTitle = document.querySelectorAll('.list__column-el');
const ListValue = document.querySelectorAll('.value');
let ListState = 0;

// добавляем обработчик события на кнопку

function CheckListValue() {
    BtnTitle.forEach(el => { SetListValue(el); }); // Обновляем значение после удаления всех элементов
}

BtnAdd.addEventListener('click', function() {
    const ElObj = ElObjectCreate();
    const NewDiv = ElementDivCreate(ElObj);
    const List = getListById(ElObj.Name);
    console.log(ElObj.Name);
    appendToList(List, NewDiv);
    CheckListValue();
    SaveDataToLocalStorage(ElObj);
});

function SaveDataToLocalStorage(data) {
    const storedData = JSON.parse(localStorage.getItem('data')) || [];
    storedData.push(data);
    localStorage.setItem('data', JSON.stringify(storedData));
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

    return ElObject;
}

function ElementDivCreate(data) {
    
    if (!data || !data.Name || !data.Vacancy || !data.Number) {
        console.error('Invalid data:', data);
        return null;
    }

    const NewDiv = document.createElement('div');
    NewDiv.classList.add('element__wrap', 'unvisible');

    const NewElName = document.createElement('p');
    const NewElVacancy = document.createElement('p');
    const NewElNumber = document.createElement('p');

    const BtnEdit = document.createElement('button');
    BtnEdit.classList.add('button');
    BtnEdit.textContent = 'Edit';

    NewElName.textContent = `Name: ${data.Name}`;
    NewElVacancy.textContent = `Vacancy: ${data.Vacancy}`;
    NewElNumber.textContent = `Number: ${data.Number}`;

    NewDiv.append(NewElName, NewElVacancy, NewElNumber, addBtnDel(), BtnEdit);
    return NewDiv;
}

function addBtnDel() {
    const BtnDel = document.createElement('button');
    BtnDel.classList.add('button', 'btn__delete');
    BtnDel.textContent = 'Del';

    BtnDel.addEventListener('click', function() {
        BtnDel.parentElement.remove();
        CheckListValue();
    });

    return BtnDel;
}

function getListById(name) {
    let ElId = name.charAt(0);
    return document.getElementById(ElId);
}

function appendToList(list, el) {
    list.appendChild(el);
}

BtnClear.addEventListener('click', function() {
    removeToList();
});

function removeToList() {
    const elements = document.querySelectorAll(".element__wrap");
    elements.forEach(el => { el.remove(); });
    CheckListValue();
    localStorage.removeItem('data'); // Очистка данных в localStorage
}

function SetListValue(el) {
    const Value = el.querySelector('.value');
    if (el.children.length <= 1) {
        Value.textContent = null;
    } else {
        Value.textContent = el.children.length - 1;
    }
}

BtnTitle.forEach(el => {
    el.firstChild.addEventListener('click', function() {
        console.log(el.parentElement);

        if (ListState === 0) {
            const children = el.querySelectorAll(':scope > .element__wrap');
            children.forEach(child => {
                child.classList.remove('unvisible');
            });
            ListState = 1;
            SetListValue(el);
        } else {
            const children = el.querySelectorAll(':scope > .element__wrap');
            children.forEach(child => {
                child.classList.add('unvisible');
            });
            ListState = 0;
            SetListValue(el);
        }
        console.log('ListState after:', ListState);
    });
});

window.addEventListener('load', function() {
    const storedData = JSON.parse(localStorage.getItem('data')) || [];
    storedData.forEach(data => {
        const NewDiv = ElementDivCreate(data);
        if (NewDiv) {
            const List = getListById(data.Name);
            appendToList(List, NewDiv);
        }
    });
    CheckListValue();
    console.log('Data loaded from localStorage:', storedData);
});

const ElInputName = document.querySelector('.action__input-name');
const ElInputVacancy = document.querySelector('.action__input-vacancy');
const ElInputNumber = document.querySelector('.action__input-number');
const BtnAdd = document.querySelector('.action__btn-add');
const BtnClear = document.querySelector('.action__btn-clear');
const BtnTitle = document.querySelectorAll('.list__column-el');
const ListValue = document.querySelectorAll('.value');
let ListState = 0;
let myData = JSON.parse(localStorage.getItem('data')) || [];

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
    SaveToLocalStorage(ElObj);
});

function saveToLS(key, data) {
    const jsonData = JSON.stringify(data);
    localStorage.setItem(key, jsonData);
}

function SaveToLocalStorage(data) {
    myData.push(data);
    saveToLS('myData', myData);
}

function deleteItem(id) {
    myData = myData.filter(item => item.id !== id);
    saveToLS('data', myData);
}

function editItem(id, updatedItem) {
    myData = myData.map(item => item.id === id ? updatedItem : item);
    saveToLS('data', myData);
}

// function SaveToLocalStorage(data) {
//     const storedData = JSON.parse(localStorage.getItem('data')) || [];
//     storedData.push(data);
//     localStorage.setItem('data', JSON.stringify(storedData));
//     console.log('Data saved to localStorage:', storedData);
// }

function ElObjectCreate() {
    const ElObject = {};

    const isValid = TextValidate(ElInputName.value, ElInputVacancy.value, ElInputNumber.value);

    if (isValid) {
        ElObject.Name = ElInputName.value;
        ElObject.Vacancy = ElInputVacancy.value;
        ElObject.Number = ElInputNumber.value;

        // Очистка полей после создания объекта
        ElInputName.value = '';
        ElInputVacancy.value = '';
        ElInputNumber.value = '';
    } else {
        // Обработка случая, когда данные не прошли валидацию
        alert('Данные не прошли валидацию');
    }

    return ElObject;
}

function TextValidate(Name, Vacancy, Number) {
    let RightState = true;

    const patternABC = /^[a-zA-Z]+$/; // Проверка на содержание только букв
    const patternNUM = /^[+]?[0-9]+$/; // Проверка на содержание только цифр с возможным плюсом в начале

    // Проверка имени
    if (Name === "" || !patternABC.test(Name)) {
        ElInputName.classList.add('error');
        RightState = false;
    } else {
        ElInputName.classList.remove('error');
    }

    // Проверка вакансии
    if (Vacancy === "" || !patternABC.test(Vacancy)) {
        ElInputVacancy.classList.add('error');
        RightState = false;
    } else {
        ElInputVacancy.classList.remove('error');
    }

    // Проверка номера
    if (Number === "" || !patternNUM.test(Number)) {
        ElInputNumber.classList.add('error');
        RightState = false;
    } else {
        ElInputNumber.classList.remove('error');
    }

    return RightState;
}

function ElementDivCreate(data) {

    // if (!data || !data.Name || !data.Vacancy || !data.Number) {
    //     console.error('Invalid data:', data);
    //     return null;
    // }

    const NewDiv = document.createElement('div');
    NewDiv.classList.add('element__wrap', 'unvisible');

    const NewElName = document.createElement('p');
    const NewElVacancy = document.createElement('p');
    const NewElNumber = document.createElement('p');

    // console.log(data)
    NewElName.textContent = `Name: ${data.Name}`;
    NewElVacancy.textContent = `Vacancy: ${data.Vacancy}`;
    NewElNumber.textContent = `Number: ${data.Number}`;

    NewDiv.append(NewElName, NewElVacancy, NewElNumber, addBtnDel(NewDiv), addBtnEdit(NewElName, NewElVacancy, NewElNumber));
    return NewDiv;
}

function addBtnDel(data) {
    const BtnDel = document.createElement('button');
    BtnDel.classList.add('button', 'btn__delete');
    BtnDel.textContent = 'Del';

    BtnDel.addEventListener('click', function() {
        BtnDel.parentElement.remove();
        CheckListValue();
        console.log(data);
        
        SaveToLocalStorage(data);
    });

    return BtnDel;
}

// function RemoveDataFromLocalStorage(data) {
//     const storedData = JSON.parse(localStorage.getItem('data')) || [];
//     const updatedData = storedData.filter(item => item.Name !== data.Name || item.Vacancy !== data.Vacancy || item.Number !== data.Number);
//     localStorage.setItem('data', JSON.stringify(updatedData));
//     console.log('Data removed from localStorage:', data);
// }

function addBtnEdit(NewElName, NewElVacancy, NewElNumber) {
    const BtnEdit = document.createElement('button');
    BtnEdit.classList.add('button');
    BtnEdit.textContent = 'Edit';

    BtnEdit.addEventListener('click', function() {
        console.log('BtnEdit clicked')
        const EditWindow = document.createElement('div');
        EditWindow.classList.add('element__edit');
        
        const EditWindowTitle = document.createElement('p');
        const EditWindowName = document.createElement('input');
        const EditWindowVacancy = document.createElement('input');
        const EditWindowNum = document.createElement('input');
        const BtnSave = document.createElement('button');

        EditWindowTitle.textContent = 'Edit element';
        EditWindowName.value = NewElName.textContent.replace('Name: ', '');
        EditWindowVacancy.value = NewElVacancy.textContent.replace('Vacancy: ', '');
        EditWindowNum.value = NewElNumber.textContent.replace('Number: ', '');

        EditWindowName.classList.add('element__edit-input');
        EditWindowVacancy.classList.add('element__edit-input');
        EditWindowNum.classList.add('element__edit-input');

        BtnSave.classList.add('button');
        BtnSave.textContent = 'Save';

        EditWindow.append(EditWindowTitle, EditWindowName, EditWindowVacancy, EditWindowNum, BtnSave);

        document.body.appendChild(EditWindow);

        BtnSave.addEventListener('click', function() {
            // Обновление текста элементов
            NewElName.textContent = `Name: ${EditWindowName.value}`;
            NewElVacancy.textContent = `Vacancy: ${EditWindowVacancy.value}`;
            NewElNumber.textContent = `Number: ${EditWindowNum.value}`;
            EditWindow.classList.remove('element__edit');

            // Обновление данных в localStorage
            // const updatedData = {
            //     Name: EditWindowName.value,
            //     Vacancy: EditWindowVacancy.value,
            //     Number: EditWindowNum.value
            // };
            // UpdateDataInLocalStorage(updatedData);

            // Удаление окна редактирования
            document.body.removeChild(EditWindow);
        });
    });

    return BtnEdit;
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
    myData.forEach(data => {
        const NewDiv = ElementDivCreate(data);
        // console.log(NewDiv);
        if (NewDiv) {
            console.log(myData);
            const List = getListById(data.Name);
            appendToList(List, NewDiv);
        }
    });
    CheckListValue();
    console.log('Data loaded from localStorage:', myData);
});

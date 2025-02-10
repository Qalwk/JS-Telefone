let contacts = JSON.parse(localStorage.getItem('contacts')) || [];

function saveToLS(key, data) {
    const jsonData = JSON.stringify(data);
    localStorage.setItem(key, jsonData);
}

export function addItem(data) {
    contacts.push(data);
    saveToLS('contacts', contacts);
}

export function deleteItem(id) {
    contacts = contacts.filter(item => item.id !== id);
    saveToLS('contacts', contacts);
}

export function editItem(id, updatedItem) {
    contacts = contacts.map(item => item.id === id ? updatedItem : item);
    saveToLS('contacts', contacts);
}
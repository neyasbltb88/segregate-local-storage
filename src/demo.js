import './demo.css';
import SegregateLocalStorage from './index';
window.SegregateLocalStorage = SegregateLocalStorage;

const codeStorage = document.querySelector('.code.storage');
const btnLastUpdate = document.querySelector('.btn.lastUpdate');
const btnNewProp = document.querySelector('.btn.newProp');
const btnRemoveNewProp = document.querySelector('.btn.removeNewProp');
const btnClearStorage = document.querySelector('.btn.clearStorage');

const dateToString = (date) => {
    let result = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

    return result;
};

const initialState = {
    moduleName: 'TestStorageModule',
    lastUpdate: '06.01.2022 00:44:45'
};
window.initialState = initialState;

let sls = new SegregateLocalStorage('TestStorageModule', initialState);
window.sls = sls;

const updateCodeStorage = () => {
    let storageData = sls.getAll();
    let content = JSON.stringify(storageData, ' ', 4);
    codeStorage.textContent = content;
};
updateCodeStorage();

btnLastUpdate.addEventListener('click', () => {
    sls.set('lastUpdate', dateToString(new Date()));
    updateCodeStorage();
});
btnNewProp.addEventListener('click', () => {
    sls.set('newProp', true);
    updateCodeStorage();
});
btnRemoveNewProp.addEventListener('click', () => {
    sls.remove('newProp');
    updateCodeStorage();
});
btnClearStorage.addEventListener('click', () => {
    sls.clear();
    updateCodeStorage();
});

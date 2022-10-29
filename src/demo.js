import './demo.css';
import SegregateLocalStorage from './index';
window.SegregateLocalStorage = SegregateLocalStorage;
import jsonStringify from './utils/jsonStringify';

const codeStorage = document.querySelector('.code.storage');
const eventSection = document.querySelector('.section.event .sectionBody');
const btnLastUpdate = document.querySelector('.btn.lastUpdate');
const btnNewProp = document.querySelector('.btn.newProp');
const btnRemoveNewProp = document.querySelector('.btn.removeNewProp');
const btnClearStorage = document.querySelector('.btn.clearStorage');

const eventRecords = [];

const updateEventRecords = () => {
    const elems = eventRecords.map((eventRecord) => {
        let { type, arg } = eventRecord;

        const $eventRow = document.createElement('div');
        $eventRow.className = 'eventRow';
        $eventRow.tabIndex = 0;

        const $label = document.createElement('div');
        $label.className = 'label';
        $label.textContent = type;

        const $eventCode = document.createElement('pre');
        $eventCode.className = 'eventCode';
        if (typeof arg === 'object' && arg !== null) {
            arg = jsonStringify(arg, ' ', 4).replaceAll('"undefined"', 'undefined');
        }
        $eventCode.textContent = arg;

        $eventRow.appendChild($label);
        $eventRow.appendChild($eventCode);

        return $eventRow;
    });

    eventSection.textContent = '';
    elems.forEach((elem) => eventSection.appendChild(elem));

    const lastElem = elems[elems.length - 1];
    lastElem.focus();
};

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

sls.onAll((type, arg) => {
    if (type === 'getAll') return;

    eventRecords.push({ type, arg });
    updateEventRecords();
});

const uri = "api/todoitems";
let tasks = [];

function getItems()
{
    fetch(uri)
        .then(response => response.json())
        .then(data => _displayItems(data))
        .catch(error => console.error('Unable to get items.', error));
}

function addItem()
{
    const txt_name = document.querySelector('#add-name');

    const item = {
        isComplete: false,
        name: txt_name.value
    };

    fetch(uri, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
    .then(response => response.json())
    .then(() => {
        getItems();
        txt_name.value = '';
    })
    .catch(error => console.error('Unable to add item.', error));
}

function deleteItem(id)
{
    fetch(`${uri}/${id}`, {
        method: 'DELETE'
    })
    .then(() => getItems())
    .catch(error => console.error('Unable to delete item.', error));
}

function displayEditForm(id)
{
    const item = tasks.find(item => item.id === id);

    document.querySelector('#edit-name').value = item.name;
    document.querySelector('#edit-id').value = item.id;
    document.querySelector('#edit-isComplete').value = item.isComplete;
    document.querySelector('#editForm').style.display = 'block';
}

function updateItem()
{
    const itemId = document.querySelector('#edit-id').value;
    const item = {
        id: parseInt(itemId, 10),
        isComplete: document.querySelector('#edit-isComplete').checked,
        name: document.querySelector('#edit-name').value
    };

    fetch(`${uri}/${itemId}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
    .then(() => getItems())
    .catch(error => console.log('Unable to update item.', error));

    closeInput();

    return false;
}

function closeInput()
{
    document.querySelector('#editForm').style.display = 'none';
}

function _displayCount(itemCount)
{
    const name = (itemCount === 1) ? 'task' : 'tasks';

    document.querySelector('#counter').innerHTML = `${itemCount} ${name}`;
}

function _displayItems(data)
{
    const tBody = document.querySelector('#tasks');
    tBody.innerHTML = '';

    _displayCount(data.length);

    const button = document.createElement('button');

    data.forEach(item => {
        let isCompleteChk = document.createElement('input');
        isCompleteChk.type = 'checkbox';
        isCompleteChk.disabled = true;
        isCompleteChk.checked = item.isComplete;

        let editButton = button.cloneNode(false);
        editButton.innerText = 'Edit';
        editButton.setAttribute('onclick', `displayEditForm(${item.id})`);
        editButton.setAttribute('class', 'btn btn-secondary');

        let deleteButton = button.cloneNode(false);
        deleteButton.innerText = 'Delete';
        deleteButton.setAttribute('onclick', `deleteItem(${item.id})`);
        deleteButton.setAttribute('class', 'btn btn-danger');

        let tr = tBody.insertRow();

        let td1 = tr.insertCell(0);
        td1.appendChild(isCompleteChk);

        let td2 = tr.insertCell(1);
        let txtNode = document.createTextNode(item.name);
        td2.appendChild(txtNode);

        let td3 = tr.insertCell(2);
        td3.appendChild(editButton);

        let td4 = tr.insertCell(3);
        td4.appendChild(deleteButton);
    });

    tasks = data;
}
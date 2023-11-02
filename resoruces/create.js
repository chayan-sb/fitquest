document.getElementById('addUserBtn').addEventListener('click', () => {
    const newUserInput = document.getElementById('newUser');
    const usersList = document.getElementById('users');

    if (newUserInput.value !== '') {
        const newUserItem = document.createElement('li');
        newUserItem.textContent = newUserInput.value;
        usersList.appendChild(newUserItem);
        newUserInput.value = '';
    }
});

document.getElementById('createBtn').addEventListener('click', () => {
    const communityName = document.getElementById('communityName').value;
    const communityType = document.querySelector('input[name="communityType"]:checked').value;
    
    console.log(`Community Name: ${communityName}`);
    console.log(`Community Type: ${communityType}`);
    
    const usersList = document.getElementById('users');
    const users = Array.from(usersList.getElementsByTagName('li')).map(li => li.textContent);
    console.log(`Users: ${users.join(', ')}`);
});

/* add your code here */

/* add your code here */
// Wait for the DOM content to load
// All logic is within this event listener to ensure assets are loaded
document.addEventListener('DOMContentLoaded', () => {
    // Parse JSON data into JavaScript objects
    const stocksData = JSON.parse(stockContent);
    const userData = JSON.parse(userContent);

    // Select necessary DOM elements
    const deleteButton = document.querySelector('#deleteUser');
    const saveButton = document.querySelector('#saveUser');
    generateUserList(userData, stocksData);
    // Function to generate the user list
    function generateUserList(users, stocks) {
        const userList = document.querySelector('.user-list');
        userList.innerHTML = ''; // Clear the existing list

        users.forEach(({ user, id }) => {
            const listItem = document.createElement('li');
            listItem.innerText = `${user.lastname}, ${user.firstname}`;
            listItem.setAttribute('id', id);
            userList.appendChild(listItem);
        });

        // Register event listener for user clicks
        userList.addEventListener('click', (event) => handleUserListClick(event, users, stocks));
    }

    // Function to handle user list clicks
    function handleUserListClick(event, users, stocks) {
        const userId = event.target.id; // Get user ID from the clicked list item
        const user = users.find(user => user.id == userId); // Find the user object
        
        if (user) {
            populateForm(user); // Populate the form with user data
            renderPortfolio(user, stocks); // Render the portfolio for the user
        }
    }

    // Function to populate the form with user data
    function populateForm(data) {
        const { user, id } = data;
        document.querySelector('#userID').value = id;
        document.querySelector('#firstname').value = user.firstname;
        document.querySelector('#lastname').value = user.lastname;
        document.querySelector('#address').value = user.address;
        document.querySelector('#city').value = user.city;
        document.querySelector('#email').value = user.email;
    }

    // Function to render the portfolio for the user
    function renderPortfolio(user, stocks) {
        const { portfolio } = user;
        const portfolioDetails = document.querySelector('.portfolio-list');
        portfolioDetails.innerHTML = ''; // Clear previous portfolio render

        portfolio.forEach(({ symbol, owned }) => {
            const symbolEl = document.createElement('p');
            const sharesEl = document.createElement('p');
            const actionEl = document.createElement('button');

            symbolEl.innerText = symbol;
            sharesEl.innerText = owned;
            actionEl.innerText = 'View';
            actionEl.setAttribute('id', symbol);
            portfolioDetails.appendChild(symbolEl);
            portfolioDetails.appendChild(sharesEl);
            portfolioDetails.appendChild(actionEl);
        });

        // Register event listener for viewing stock details
        portfolioDetails.addEventListener('click', (event) => {
            if (event.target.tagName === 'BUTTON') {
                viewStock(event.target.id, stocks);
            }
        });
    }

    // Function to view stock details
    function viewStock(symbol, stocks) {
        const stockArea = document.querySelector('.stock-form');
        const stock = stocks.find(s => s.symbol === symbol);

        if (stock) {
            document.querySelector('#stockName').textContent = stock.name;
            document.querySelector('#stockSector').textContent = stock.sector;
            document.querySelector('#stockIndustry').textContent = stock.subIndustry;
            document.querySelector('#stockAddress').textContent = stock.address;
            document.querySelector('#logo').src = `logos/${symbol}.svg`;
        }
    }

    // Event listener for the delete button
    deleteButton.addEventListener('click', (event) => {
        event.preventDefault();

        const userId = document.querySelector('#userID').value;
        const userIndex = userData.findIndex(user => user.id == userId);

        if (userIndex !== -1) {
            userData.splice(userIndex, 1); // Remove user from array
            generateUserList(userData, stocksData); // Re-render the user list
        }
    });

    // Event listener for the save button
    saveButton.addEventListener('click', (event) => {
        event.preventDefault();

        const userId = document.querySelector('#userID').value;

        for (let i = 0; i < userData.length; i++) {
            if (userData[i].id == userId) {
                userData[i].user.firstname = document.querySelector('#firstname').value;
                userData[i].user.lastname = document.querySelector('#lastname').value;
                userData[i].user.address = document.querySelector('#address').value;
                userData[i].user.city = document.querySelector('#city').value;
                userData[i].user.email = document.querySelector('#email').value;

                generateUserList(userData, stocksData); // Re-render the user list
                break;
            }
        }
    });

    // Initial rendering of the user list
    generateUserList(userData, stocksData);
});


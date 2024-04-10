const currentDateElement = document.getElementById('currentDate');
let currentDate = new Date();
let goalsData = {};
let goalsList = [];

let numgoal =0;


function loadFromLocalStorage() {
    const storedGoalsData = localStorage.getItem('goalsData');
    const storedGoalsList = localStorage.getItem('goalsList');
    const storedNumGoal = localStorage.getItem('numgoal');

    if (storedGoalsData) goalsData = JSON.parse(storedGoalsData);
    if (storedGoalsList) goalsList = JSON.parse(storedGoalsList);
    if (storedNumGoal) numgoal = JSON.parse(storedNumGoal);
}

loadFromLocalStorage();  


//aa
function saveToLocalStorage() {
    localStorage.setItem('goalsData', JSON.stringify(goalsData));
    localStorage.setItem('goalsList', JSON.stringify(goalsList));
    localStorage.setItem('numgoal', JSON.stringify(numgoal));
}




function updateDateHeader() {
    currentDateElement.textContent = currentDate.toLocaleDateString('en-US', {
        day: 'numeric', month: 'long', year: 'numeric'
    });
}

function getDateString(date) {
    let month = (date.getMonth() + 1).toString().padStart(2, '0');   // +1 beacuase months starts from 0.
    let day = date.getDate().toString().padStart(2, '0');
    let year = date.getFullYear();
    return `${year}-${month}-${day}`;
}

function addGoal() {
    
    
    const newGoalInput = document.getElementById('newGoalInput');   // in the html "newGoalInput " getelementbyid gets the text from there 
    const goalName = newGoalInput.value.trim().toUpperCase();

    if (goalName && !goalsList.includes(goalName)) {
        numgoal++;
        goalsList.push(goalName);
        displayGoals();
        newGoalInput.value = '';
        updateChart();                                //so when new goals is added it updates the height of hte exixsting bars 
    } else if (goalsList.includes(goalName)) {
        alert("Goal already exists!");
    }

    saveToLocalStorage()
}

function displayGoals() {
    const goalsContainer = document.getElementById('goals');
    goalsContainer.innerHTML = '';
    goalsList.forEach(goal => {  
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = goal;
        label.appendChild(checkbox);
        label.append(` ${goal}`);
        goalsContainer.appendChild(label);
    });
}





function updateGoalsData(goal, isChecked) {
    const dateString = getDateString(currentDate);
    goalsData[dateString] = goalsData[dateString] || [];
    const currentGoals = goalsData[dateString];
    if (isChecked && !currentGoals.includes(goal)) {
        currentGoals.push(goal);
    } else if (!isChecked && currentGoals.includes(goal)) {
        goalsData[dateString] = currentGoals.filter(g => g !== goal);
    }
}

function saveGoalsData() {
    const dateString = getDateString(currentDate);
    goalsData[dateString] = []; // yessss here we reset the goals so it does not read old checkboxex 
    

    goalsList.forEach(goal => {
        const goalCheckbox = document.getElementById(goal);
        if (goalCheckbox && goalCheckbox.checked) {
            
            goalsData[dateString].push(goal);
        }
    });

    
    updateChart();

    saveToLocalStorage()
}







function showGoalsForDay(dateString) {
    const goalsListElement = document.getElementById('goalsList');
    goalsListElement.innerHTML = '';
    // Use goalsList to maintain order
    goalsList.forEach(goal => {
        if (goalsData[dateString]?.includes(goal)) {
            const listItem = document.createElement('li');
            listItem.textContent = goal;
            goalsListElement.appendChild(listItem);
        }
    });
}




function updateChart() {
    const chartContainer = document.getElementById('chart');
    chartContainer.innerHTML = '';
    const totalDays = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const todayString = getDateString(new Date());
    const currentDateString = getDateString(currentDate);

    const maxBarHeight = 300; // This is the maximum height in pixels for the tallest bar
    const scaleFactor = maxBarHeight / numgoal;

    for (let day = 1; day <= totalDays; day++) {
        const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const dateString = getDateString(dayDate);
        const goalsAchieved = goalsData[dateString] ? goalsData[dateString].length : 0;

        const bar = document.createElement('div');
        bar.className = 'chart-bar';

        bar.style.height = `${goalsAchieved * scaleFactor}px`;   // arbitratry height will be edited accordign to goal numaber 
        


 
        bar.onclick = () => {                 //when a bar is clicked these functions will be called
            currentDate = new Date(dayDate);
            updateDateHeader();
            showGoalsForDay(dateString);
            updateChart();
        };

        const barContainer = document.createElement('div');
        barContainer.className = 'bar-container';
        if (dateString === currentDateString) {
            bar.classList.add('highlighted-day');
        }
        if (dateString === todayString) {
            bar.classList.add('today');
        }

        const label = document.createElement('div');
        label.textContent = day;
        label.className = 'chart-label';

        barContainer.appendChild(bar);
        barContainer.appendChild(label);
        chartContainer.appendChild(barContainer);
    }
    showGoalsForDay(currentDateString);
}



function changeDay(amount) {
    currentDate.setDate(currentDate.getDate() + amount);
    updateDateHeader();
    clearCheckboxes();
    updateChart();   // here only suppose to change the day dont  touch the bars 
}





function clearCheckboxes() {
    const checkboxes = document.querySelectorAll('#goals input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
}

document.getElementById('addGoalButton').addEventListener('click', addGoal);
document.getElementById('updateButton').addEventListener('click', saveGoalsData);
document.getElementById('prevDay').addEventListener('click', () => changeDay(-1));
document.getElementById('nextDay').addEventListener('click', () => changeDay(1));
document.getElementById('prevMonth').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1, 1);
    updateDateHeader();
    updateChart();
    
});
document.getElementById('nextMonth').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1, 1);
    updateDateHeader();
    updateChart();
    
});

document.getElementById('resetLocalStorageButton').addEventListener('click', function() {
    if (confirm('Are you sure you want to reset all your data? This action cannot be undone.')) {
        localStorage.clear();
        alert('Local storage has been reset.');
        location.reload();
        
    }
});




loadFromLocalStorage();  
updateDateHeader();
updateChart();
displayGoals();



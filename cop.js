const currentDateElement = document.getElementById('currentDate');
let currentDate = new Date();
let goalsData = {};
let goalsList = [];

let numgoal =0;

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
    numgoal++;
    
    const newGoalInput = document.getElementById('newGoalInput');   // in the html "newGoalInput " getelementbyid gets the text from there 
    const goalName = newGoalInput.value.trim().toUpperCase();

    if (goalName && !goalsList.includes(goalName)) {
        goalsList.push(goalName);
        displayGoals();
        newGoalInput.value = '';
        updateChart();                                //so when new goals is added it updates the height of hte exixsting bars 
    } else if (goalsList.includes(goalName)) {
        alert("Goal already exists!");
    }
}

function displayGoals() {
    const goalsContainer = document.getElementById('goals');   // in the html "goal ",,, getelementbyid gets the text from there 

    goalsContainer.innerHTML = '';
    goalsList.forEach(goal => {  
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = goal;
        checkbox.checked = goalsData[getDateString(currentDate)]?.includes(goal);
        checkbox.addEventListener('change', () => updateGoalsData(goal, checkbox.checked));
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
    goalsList.forEach(goal => {
        const goalCheckbox = document.getElementById(goal);
        if (goalCheckbox) {
            updateGoalsData(goal, goalCheckbox.checked);
        }
    });
    updateChart();
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
    updateChart();
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

updateDateHeader();
updateChart();

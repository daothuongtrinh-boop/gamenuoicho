// Quiz Questions
const quizQuestions = [
    // Math Questions
    {
        question: '2 + 3 = ?',
        options: ['4', '5', '6', '7'],
        correct: 1,
        reward: 10,
        type: 'math'
    },
    {
        question: '10 - 4 = ?',
        options: ['5', '6', '7', '8'],
        correct: 1,
        reward: 10,
        type: 'math'
    },
    {
        question: '5 × 3 = ?',
        options: ['12', '15', '18', '20'],
        correct: 1,
        reward: 15,
        type: 'math'
    },
    {
        question: '20 ÷ 4 = ?',
        options: ['4', '5', '6', '7'],
        correct: 1,
        reward: 15,
        type: 'math'
    },
    {
        question: '15 + 25 = ?',
        options: ['35', '40', '45', '50'],
        correct: 1,
        reward: 15,
        type: 'math'
    },
    {
        question: '100 - 30 = ?',
        options: ['60', '65', '70', '75'],
        correct: 0,
        reward: 15,
        type: 'math'
    },
    {
        question: '9 × 8 = ?',
        options: ['70', '71', '72', '73'],
        correct: 2,
        reward: 20,
        type: 'math'
    },
    {
        question: '144 ÷ 12 = ?',
        options: ['10', '11', '12', '13'],
        correct: 2,
        reward: 20,
        type: 'math'
    },
    // English Questions
    {
        question: 'What is the opposite of \"hot\"?',
        options: ['warm', 'cold', 'cool', 'icy'],
        correct: 1,
        reward: 10,
        type: 'english'
    },
    {
        question: 'Which is the color of the sky on a clear day?',
        options: ['red', 'blue', 'green', 'yellow'],
        correct: 1,
        reward: 10,
        type: 'english'
    },
    {
        question: 'How many days are in a week?',
        options: ['5', '6', '7', '8'],
        correct: 2,
        reward: 10,
        type: 'english'
    },
    {
        question: 'What do you call a young dog?',
        options: ['calf', 'puppy', 'kitten', 'chick'],
        correct: 1,
        reward: 15,
        type: 'english'
    },
    {
        question: 'Which animal says \"meow\"?',
        options: ['dog', 'cat', 'cow', 'duck'],
        correct: 1,
        reward: 10,
        type: 'english'
    },
    {
        question: 'What is the capital of France?',
        options: ['London', 'Berlin', 'Paris', 'Madrid'],
        correct: 2,
        reward: 15,
        type: 'english'
    },
    {
        question: 'How many legs does a dog have?',
        options: ['2', '3', '4', '5'],
        correct: 2,
        reward: 15,
        type: 'english'
    },
    {
        question: 'What color is a banana?',
        options: ['red', 'green', 'yellow', 'brown'],
        correct: 2,
        reward: 10,
        type: 'english'
    }
];

let currentQuestionIndex = 0;
let answeredQuestions = new Set();

// Game State
let gameState = {
    dogName: 'Chó Của Tôi',
    happiness: 100,
    hunger: 0,
    energy: 100,
    health: 100,
    coins: 0,
    food: 0,
    water: 0,
    medicine: 0,
    lastAction: null
};

// Initialize game
function initGame() {
    updateDisplay();
    setInterval(updateGameState, 2000); // Update every 2 seconds
    
    // Event listeners
    document.getElementById('feedBtn').addEventListener('click', feedDog);
    document.getElementById('waterBtn').addEventListener('click', waterDog);
    document.getElementById('playBtn').addEventListener('click', playDog);
    document.getElementById('sleepBtn').addEventListener('click', sleepDog);
    document.getElementById('petBtn').addEventListener('click', petDog);
    document.getElementById('medicineBtn').addEventListener('click', giveMedicine);
    
    document.getElementById('resetBtn').addEventListener('click', resetGame);
    document.getElementById('saveBtn').addEventListener('click', saveGame);
    document.getElementById('loadBtn').addEventListener('click', loadGame);
    
    document.getElementById('dogEmoji').addEventListener('click', playDog);
    
    // Initialize quiz
    displayQuestion();
    
    // Load game if exists
    loadGame();
}

// Update display
function updateDisplay() {
    // Clamp values between 0 and 100
    gameState.happiness = Math.max(0, Math.min(100, gameState.happiness));
    gameState.hunger = Math.max(0, Math.min(100, gameState.hunger));
    gameState.energy = Math.max(0, Math.min(100, gameState.energy));
    gameState.health = Math.max(0, Math.min(100, gameState.health));
    
    // Update bars
    document.getElementById('happinessFill').style.width = gameState.happiness + '%';
    document.getElementById('happinessValue').textContent = Math.round(gameState.happiness);
    
    document.getElementById('hungerFill').style.width = gameState.hunger + '%';
    document.getElementById('hungerValue').textContent = Math.round(gameState.hunger);
    
    document.getElementById('energyFill').style.width = gameState.energy + '%';
    document.getElementById('energyValue').textContent = Math.round(gameState.energy);
    
    document.getElementById('healthFill').style.width = gameState.health + '%';
    document.getElementById('healthValue').textContent = Math.round(gameState.health);
    
    // Update inventory
    document.getElementById('foodCount').textContent = gameState.food;
    document.getElementById('waterCount').textContent = gameState.water;
    document.getElementById('medicineCount').textContent = gameState.medicine;
    document.getElementById('coinCount').textContent = Math.round(gameState.coins);
    
    // Update dog emoji based on state
    const dogEmoji = document.getElementById('dogEmoji');
    if (gameState.health <= 20) {
        dogEmoji.textContent = '🤢';
    } else if (gameState.happiness > 70 && gameState.hunger < 30) {
        dogEmoji.textContent = '😍';
    } else if (gameState.happiness < 30) {
        dogEmoji.textContent = '😢';
    } else if (gameState.hunger > 70) {
        dogEmoji.textContent = '🤤';
    } else if (gameState.energy < 30) {
        dogEmoji.textContent = '😴';
    } else {
        dogEmoji.textContent = '🐕';
    }
    
    // Update status message
    updateStatusMessage();
    
    // Update button states
    updateButtonStates();
}

function updateStatusMessage() {
    const messages = [];
    const msg = document.getElementById('statusMessage');
    
    if (gameState.health <= 20) {
        msg.textContent = '⚠️ Chó của bạn bị ốm! Hãy cho nó uống thuốc!';
        msg.style.color = '#f5576c';
        return;
    }
    
    if (gameState.hunger > 70) {
        msg.textContent = '🍖 Chó của bạn đang rất đói!';
        msg.style.color = '#ffa500';
        return;
    }
    
    if (gameState.energy < 20) {
        msg.textContent = '😴 Chó của bạn rất mệt, nó cần ngủ!';
        msg.style.color = '#667eea';
        return;
    }
    
    if (gameState.happiness > 80) {
        msg.textContent = '😄 Chó của bạn rất vui vẻ!';
        msg.style.color = '#4CAF50';
        return;
    }
    
    if (gameState.happiness < 30) {
        msg.textContent = '😢 Chó của bạn cảm thấy buồn. Hãy chơi với nó!';
        msg.style.color = '#f5576c';
        return;
    }
    
    msg.textContent = '😊 Chó của bạn đang khỏe mạnh!';
    msg.style.color = '#333';
}

function updateButtonStates() {
    const feedBtn = document.getElementById('feedBtn');
    const waterBtn = document.getElementById('waterBtn');
    const playBtn = document.getElementById('playBtn');
    const sleepBtn = document.getElementById('sleepBtn');
    const medicineBtn = document.getElementById('medicineBtn');
    
    feedBtn.disabled = gameState.food === 0;
    waterBtn.disabled = gameState.water === 0;
    playBtn.disabled = gameState.energy < 20;
    sleepBtn.disabled = gameState.energy > 95;
    medicineBtn.disabled = gameState.medicine === 0 || gameState.health > 80;
}

// Actions
function feedDog() {
    if (gameState.food <= 0) {
        showMessage('❌ Không có thức ăn!', '#f5576c');
        return;
    }
    
    gameState.food--;
    gameState.hunger = Math.max(0, gameState.hunger - 25);
    gameState.happiness += 5;
    gameState.health = Math.min(100, gameState.health + 3);
    gameState.lastAction = 'ăn';
    
    playAnimation('happy');
    showMessage('🍖 Chó ăn ngon lắm! Nom nom!', '#4CAF50');
    updateDisplay();
}

function waterDog() {
    if (gameState.water <= 0) {
        showMessage('❌ Không có nước!', '#f5576c');
        return;
    }
    
    gameState.water--;
    gameState.hunger = Math.max(0, gameState.hunger - 10);
    gameState.health = Math.min(100, gameState.health + 2);
    gameState.lastAction = 'uống nước';
    
    playAnimation('happy');
    showMessage('💧 Chó uống nước ngon lành!', '#4facfe');
    updateDisplay();
}

function playDog() {
    if (gameState.energy < 20) {
        showMessage('😴 Chó quá mệt để chơi!', '#667eea');
        return;
    }
    
    gameState.happiness = Math.min(100, gameState.happiness + 20);
    gameState.energy = Math.max(0, gameState.energy - 15);
    gameState.hunger += 10;
    gameState.lastAction = 'chơi';
    
    playAnimation('happy');
    showMessage('🎾 Chó rất vui vẻ khi chơi!', '#43e97b');
    updateDisplay();
}

function sleepDog() {
    if (gameState.energy > 95) {
        showMessage('⚠️ Chó không cần ngủ bây giờ!', '#ffa500');
        return;
    }
    
    gameState.energy = Math.min(100, gameState.energy + 40);
    gameState.happiness += 5;
    gameState.lastAction = 'ngủ';
    
    playAnimation('sad');
    showMessage('😴 Chó đang ngủ ngon...', '#667eea');
    
    setTimeout(() => {
        gameState.energy = Math.min(100, gameState.energy + 20);
        showMessage('😴 Chó thức dậy khoẻ khoắn!', '#4CAF50');
        updateDisplay();
    }, 1000);
    
    updateDisplay();
}

function petDog() {
    gameState.happiness = Math.min(100, gameState.happiness + 10);
    gameState.lastAction = 'vuốt ve';
    
    playAnimation('happy');
    showMessage('✋ Chó cảm thấy yêu thương!', '#fa709a');
    updateDisplay();
}

function giveMedicine() {
    if (gameState.medicine <= 0) {
        showMessage('❌ Không có thuốc!', '#f5576c');
        return;
    }
    
    if (gameState.health > 80) {
        showMessage('⚠️ Chó khỏe mạnh, không cần uống thuốc!', '#ffa500');
        return;
    }
    
    gameState.medicine--;
    gameState.health = Math.min(100, gameState.health + 30);
    gameState.coins += 5; // Bonus coins for taking care of dog
    gameState.lastAction = 'uống thuốc';
    
    playAnimation('happy');
    showMessage('💊 Chó uống thuốc và khỏe lại!', '#30cfd0');
    updateDisplay();
}

function playAnimation(type) {
    const dogEmoji = document.getElementById('dogEmoji');
    dogEmoji.classList.remove('happy', 'sad');
    
    if (type === 'happy') {
        dogEmoji.classList.add('happy');
    } else if (type === 'sad') {
        dogEmoji.classList.add('sad');
    }
    
    setTimeout(() => {
        dogEmoji.classList.remove('happy', 'sad');
    }, 500);
}

function showMessage(text, color) {
    const msg = document.getElementById('statusMessage');
    const oldText = msg.textContent;
    msg.textContent = text;
    msg.style.color = color;
    
    setTimeout(() => {
        msg.textContent = oldText;
        msg.style.color = '#333';
    }, 2000);
}

// Automatic game state updates
function updateGameState() {
    if (gameState.energy > 0) {
        gameState.hunger += 0.5;
        gameState.energy -= 0.3;
    }
    
    // Health decreases if hungry or sad
    if (gameState.hunger > 80) {
        gameState.health -= 0.5;
    }
    
    if (gameState.happiness < 30) {
        gameState.health -= 0.2;
    }
    
    // Happiness decreases over time
    gameState.happiness = Math.max(0, gameState.happiness - 0.5);
    
    // Health regeneration
    if (gameState.health < 100 && gameState.hunger < 50) {
        gameState.health += 0.2;
    }
    
    // Earn coins
    if (gameState.happiness > 50 && gameState.hunger < 50 && gameState.energy > 30) {
        gameState.coins += 0.1;
    }
    
    updateDisplay();
}

// Shop functions
function buyFood() {
    if (gameState.coins < 5) {
        alert('❌ Không đủ coin! (Cần 5 coin, bạn có ' + Math.round(gameState.coins) + ')');
        return;
    }
    gameState.coins -= 5;
    gameState.food += 5;
    showMessage('🍖 Mua thức ăn thành công!', '#4CAF50');
    updateDisplay();
}

function buyWater() {
    if (gameState.coins < 3) {
        alert('❌ Không đủ coin! (Cần 3 coin, bạn có ' + Math.round(gameState.coins) + ')');
        return;
    }
    gameState.coins -= 3;
    gameState.water += 5;
    showMessage('💧 Mua nước thành công!', '#4facfe');
    updateDisplay();
}

function buyMedicine() {
    if (gameState.coins < 10) {
        alert('❌ Không đủ coin! (Cần 10 coin, bạn có ' + Math.round(gameState.coins) + ')');
        return;
    }
    gameState.coins -= 10;
    gameState.medicine += 3;
    showMessage('💊 Mua thuốc thành công!', '#30cfd0');
    updateDisplay();
}

// Save/Load
function saveGame() {
    localStorage.setItem('dogGameState', JSON.stringify(gameState));
    alert('✅ Game đã được lưu!');
}

function loadGame() {
    const saved = localStorage.getItem('dogGameState');
    if (saved) {
        gameState = JSON.parse(saved);
        updateDisplay();
        alert('✅ Game đã được tải!');
    }
}

function resetGame() {
    if (confirm('Bạn chắc chắn muốn chơi lại? Sẽ mất tất cả dữ liệu!')) {
        gameState = {
            dogName: 'Chó Của Tôi',
            happiness: 100,
            hunger: 0,
            energy: 100,
            health: 100,
            coins: 0,
            food: 0,
            water: 0,
            medicine: 0,
            lastAction: null
        };
        answeredQuestions = new Set();
        currentQuestionIndex = 0;
        localStorage.removeItem('dogGameState');
        updateDisplay();
        displayQuestion();
        alert('✅ Game đã được đặt lại!');
    }
}

// Start game when page loads
window.addEventListener('DOMContentLoaded', initGame);

// Quiz Functions
function displayQuestion() {
    // Show quiz content
    document.getElementById('quizContent').style.display = 'block';
    
    // Find next unanswered question
    while (answeredQuestions.has(currentQuestionIndex) && currentQuestionIndex < quizQuestions.length) {
        currentQuestionIndex++;
    }
    
    // Reset to beginning if all answered
    if (currentQuestionIndex >= quizQuestions.length) {
        currentQuestionIndex = 0;
        answeredQuestions.clear();
    }
    
    const question = quizQuestions[currentQuestionIndex];
    const questionEl = document.getElementById('quizQuestion');
    const optionsEl = document.getElementById('quizOptions');
    
    questionEl.textContent = question.question;
    optionsEl.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const optionBtn = document.createElement('div');
        optionBtn.className = 'quiz-option';
        optionBtn.textContent = option;
        optionBtn.onclick = () => selectAnswer(index, question);
        optionsEl.appendChild(optionBtn);
    });
    
    document.getElementById('quizFeedback').classList.remove('show', 'correct', 'incorrect');
    document.getElementById('nextQuizBtn').style.display = 'none';
}

function selectAnswer(selectedIndex, question) {
    const feedbackEl = document.getElementById('quizFeedback');
    const optionsEl = document.querySelectorAll('.quiz-option');
    const nextBtn = document.getElementById('nextQuizBtn');
    
    // Disable all options
    optionsEl.forEach(opt => opt.style.pointerEvents = 'none');
    
    // Show answer
    optionsEl[question.correct].classList.add('correct');
    
    answeredQuestions.add(currentQuestionIndex);
    
    if (selectedIndex === question.correct) {
        optionsEl[selectedIndex].classList.add('correct');
        feedbackEl.textContent = `✅ Đúng rồi! +${question.reward} coin`;
        feedbackEl.className = 'quiz-feedback show correct';
        gameState.coins += question.reward;
        console.log('Coin cập nhật:', gameState.coins, 'Thêm:', question.reward);
        updateDisplay();
        
        // Auto advance to next question after 2 seconds
        setTimeout(() => {
            nextQuestion();
        }, 2000);
    } else {
        optionsEl[selectedIndex].classList.add('incorrect');
        feedbackEl.textContent = `❌ Sai rồi! Đáp án đúng: ${question.options[question.correct]}`;
        feedbackEl.className = 'quiz-feedback show incorrect';
        
        // Show next button for incorrect answers
        nextBtn.style.display = 'block';
    }
}

function nextQuestion() {
    currentQuestionIndex++;
    displayQuestion();
    
    // Re-enable options
    document.querySelectorAll('.quiz-option').forEach(opt => {
        opt.style.pointerEvents = 'auto';
        opt.classList.remove('correct', 'incorrect', 'selected');
    });
}

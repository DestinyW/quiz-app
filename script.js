const questionEl = document.querySelector('#question');
const choicesEls = document.querySelectorAll('input');
const progressEl = document.querySelector('#progress-text');
const submitBtn = document.querySelector('#submitBtn');
let quizData = [];
let questionCounter = 0;
let score = 0;

fetch(
    'https://opentdb.com/api.php?amount=10&category=26&difficulty=easy&type=multiple'
)
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        // array holding all of the questions for the quiz
        quizData = data.results.map((triviaData) => {
            const randomIndex = Math.floor(Math.random() * 4);
            const answerChoices = triviaData.incorrect_answers;
            answerChoices.splice(randomIndex, 0, triviaData.correct_answer);
            // format each individual question in object form
            return {
                question: triviaData.question,
                answer_choices: answerChoices,
                correct_answer: triviaData.correct_answer,
            };
        });
        loadQuiz();
    })
    .catch((e) => {
        console.error(e);
    });

// load data to HTML
function loadQuiz() {
    deselectAnswers();
    progressEl.innerText = `Question ${questionCounter + 1} of ${
        quizData.length
    }`;
    let currentQuestion = quizData[questionCounter];
    questionEl.innerHTML = currentQuestion.question;
    choicesEls.forEach((choice, index) => {
        const label = choice.nextElementSibling;
        label.innerHTML = currentQuestion.answer_choices[index];
    });
}

// get user's answer to question
function getSelection() {
    let choiceSelected = undefined;
    choicesEls.forEach((choice) => {
        if (choice.checked) {
            const label = choice.nextElementSibling;
            choiceSelected = label.innerText;
        }
    });
    return choiceSelected;
}

// uncheck previous selections
function deselectAnswers() {
    choicesEls.forEach((choice) => {
        choice.checked = false;
    });
}

// handle user interaction
submitBtn.addEventListener('click', () => {
    let userSelection = getSelection();

    // if we get a valid selection, update score and load next question
    if (userSelection) {
        if (userSelection === quizData[questionCounter].correct_answer) {
            score++;
        }

        questionCounter++;
        if (questionCounter < quizData.length) {
            loadQuiz();
        } else {
            quiz_content.innerHTML = `
                <h2>Quiz Score: ${(score / quizData.length) * 100}%</h2> 
                <p>You answered ${score}/${quizData.length} correctly</p>
            `;
            submitBtn.innerText = 'Reset Quiz';
            submitBtn.onclick = () => {
                location.reload();
            };
        }
    }
});

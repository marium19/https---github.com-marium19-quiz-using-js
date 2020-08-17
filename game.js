const question= document.getElementById("question");
const choices=Array.from(document.getElementsByClassName("choice-text"));
const questionCounterText=document.getElementById("progressText");
const scoreText=document.getElementById("score");
const progressBarFull=document.getElementById("progressBarFull");

let currentQuestion={};
let acceptingAnswers=false;
let score=0;
let questionCounter=0;
let availableQuestions=[];

// let questions = [
//     {
//         question: 'Inside which HTML element do we put the JavaScript??',
//         choice1: '<script>',
//         choice2: '<javascript>',
//         choice3: '<js>',
//         choice4: '<scripting>',
//         answer: 1,
//     },
//     {
//         question:
//             "What is the correct syntax for referring to an external script called 'xxx.js'?",
//         choice1: "<script href='xxx.js'>",
//         choice2: "<script name='xxx.js'>",
//         choice3: "<script src='xxx.js'>",
//         choice4: "<script file='xxx.js'>",
//         answer: 3,
//     },
//     {
//         question: " How do you write 'Hello World' in an alert box?",
//         choice1: "msgBox('Hello World');",
//         choice2: "alertBox('Hello World');",
//         choice3: "msg('Hello World');",
//         choice4: "alert('Hello World');",
//         answer: 4,
//     },
// ];

//get questions from fetch using built json

// let questions=[];
// fetch('questions.json')
//     .then(res =>{
//         return res.json();
//     })
//     .then( loadedQues => {
//         questions=loadedQues;
//         startGame();
//     })
//     .catch((err) => {
//         console.error(err);
//     });

//get questions using an api using fetch

let questions=[];
fetch('https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple')
    .then(res =>{
        return res.json();
    })
    .then(loadedQuestions =>{
        //console.log(loadedQuestions.results);
        questions=loadedQuestions.results.map(eachQuestion => {
            const formattedQuestion ={
                question: eachQuestion.question,
            };
        
        const answerChoices = [...eachQuestion.incorrect_answers];  //saves all the incorrect answers first 
        formattedQuestion.answer=Math.floor(Math.random()*3)+1;     //picks the index of the answer
        answerChoices.splice(formattedQuestion.answer-1,0,eachQuestion.correct_answer);     //saves the answer at the random position picked above

        answerChoices.forEach( (choice,index) =>{
            formattedQuestion["choice"+(index+1)]=choice;
        });
        return formattedQuestion;
    });
        startGame();
    })
    .catch((err) => {
        console.error(err);
    });

//constants
const CORRECT_BONUS=10;
const MAX_QUES=4;

startGame = () =>{
    questionCounter=0;
    score=0;
    availableQuestions=[...questions]  //copies the questions into this variable as an array
    //console.log(availableQuestions);
    getNewQuestions();
};

getNewQuestions = () =>{
    if(availableQuestions.length === 0 || questionCounter >= MAX_QUES){
        //save the score
        localStorage.setItem("mostRecentScore",score);
        //go to the end page
       return window.location.assign('/end.html');
    }
    questionCounter++;
    questionCounterText.innerText= `Question ${questionCounter}/${MAX_QUES}`;
    //update the progresss bar
    progressBarFull.style.width= `${(questionCounter/MAX_QUES)*100}%`;
    const questionIndex=Math.floor(Math.random()*availableQuestions.length); //selects random from available questions
    currentQuestion=availableQuestions[questionIndex];
    question.innerText=currentQuestion.question;

    choices.forEach(choice => {
        const number=choice.dataset['number'];
        choice.innerText=currentQuestion['choice'+number];
    });

    //remove the question currently displayed
    availableQuestions.splice(questionIndex,1);
    //console.log(availableQuestions);
    acceptingAnswers=true;
};

choices.forEach((choice) =>{
    choice.addEventListener('click', (e) => {
        //console.log(e.target);
        if(!acceptingAnswers)
            return;
        acceptingAnswers=false;
        const selectedChoice=e.target;
        const selectedAnswer=choice.dataset['number'];

        let classToApply='incorrect';
            if(selectedAnswer == currentQuestion.answer){  //check if the answer choice is the correct one 
                classToApply='correct';
            }
        if(classToApply==='correct'){
            incrementScore(CORRECT_BONUS);
        }
        //console.log(classToApply);
        selectedChoice.parentElement.classList.add(classToApply);
        setTimeout(()=>{        //after specified seconds removed the colour and moves to next question
            selectedChoice.parentElement.classList.remove(classToApply); 
            getNewQuestions();
        },200);
        
    });
});

incrementScore = num=>{
    score+=num;
    scoreText.innerText = score;
}



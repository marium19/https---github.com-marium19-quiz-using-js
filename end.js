const username= document.getElementById('username');
const saveScoreBtn= document.getElementById('saveScoreBtn');
const finalScore = document.getElementById('finalScore');
const mostRecentScore= localStorage.getItem('mostRecentScore');
const MAX_HIGHSCORES=5;
finalScore.innerText= mostRecentScore;

//storing highscore to local storage
const highscores=JSON.parse(localStorage.getItem("highscores")) || [];
console.log(highscores);

username.addEventListener("keyup", () => {
    saveScoreBtn.disabled = !username.value;
});

saveHighScore = (e) =>{
    //console.log("clicked the button");
    e.preventDefault();

    const score = {
        score: mostRecentScore,
        name: username.value
    };
   // console.log(score);
   highscores.push(score);
   highscores.sort((a,b) => b.score-a.score);
   highscores.splice(5);
   //console.log(highscores);
   localStorage.setItem("highscores",JSON.stringify(highscores));
   window.location.assign("/");
};

  

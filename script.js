// Select Element 
let CountSpan = document.querySelector('.count span');
let quizArea = document.querySelector('.quiz-area');
let answerArea = document.querySelector('.answers-area');
let bullestspan = document.querySelector('.bullets')
let sumbitBtn = document.querySelector('.submit-button');
let result = document.querySelector('.results');
let currentIndex = 0;
let rightAnswers = 0;
let wrongAnswers = 0;
let countDownInrevel;
let countdownElement = document.querySelector('.count_down');
// Main Function
function getQuestions(){
    let myRequest = new XMLHttpRequest();


    myRequest.onreadystatechange = function(){
        if(this.readyState === 4 && this.status === 200){
            let questionObject = JSON.parse(myRequest.responseText);
            let questionCount = questionObject.length;
            // Create Bullest And Set Question Count
            createBullets(questionCount);
            // Add question Data
            addQuestionData(questionObject[currentIndex], questionCount);
             // Countdown Function
             setCountDown( 10, questionCount);
            // Click On Submit
            sumbitBtn.onclick = () => {
                // Get Right Answer
                let rightAnswer = questionObject[currentIndex].right_answer;

                // Increase Index 
                currentIndex++;

                // Check The Answer
                checkAnswer(rightAnswer , questionCount);

                // Remove Previos Question
                quizArea.innerHTML = '';
                answerArea.innerHTML = ''
                // Add The Next Queation
                addQuestionData(questionObject[currentIndex], questionCount);
                // Handle Bullets
                handleBullets();
                // Show Results
                showResults(questionCount);
                // Countdown Function
                clearInterval(countDownInrevel)
                setCountDown( 10 , questionCount);
            }
           
        }
    }


    myRequest.open('GEt' , 'https://raw.githubusercontent.com/Ahmed-Ibrahiem/Quiz-App/refs/heads/main/HTML_questions.json' , true);
    myRequest.send();
}
getQuestions()

// Create Bullets And Set Question Count
function createBullets(num){
    CountSpan.innerHTML = num;
    // create Bullets
    for(let i = 0 ; i < num ; i++){
        let span = document.createElement('span');
        // set The Active Bullets
        i === 0 ? span.classList.add('on'): span;
        document.querySelector('.bullets .spans').appendChild(span)
    }
}

// Add question Data 
function addQuestionData(obj , count){
   if(currentIndex < count){
         // Create H2 Question Tittles
    let questionTittle = document.createElement('h2');
    // Create Question Text
    let questionText = document.createTextNode(obj.title);
    // Append Text To H2
    questionTittle.appendChild(questionText);
    // Append H2 To quiz-area
    quizArea.appendChild(questionTittle);
    
    // Create The Answers 
    for(let i = 1 ; i <= 4 ; i++){

        // Create Main Answer Div
        let mainDiv = document.createElement('div');
        // Add Class For Main Div
        mainDiv.className = 'answer';
        // Create Radio Inputs
        let radioInput = document.createElement('input');
        // Add Type + Name + Id + Data-Attribute
        radioInput.name = 'question';
        radioInput.type = 'radio';
        radioInput.id = `answer_${i}`;
        radioInput.dataset.answer = obj[`answer_${i}`];

        // Make First Option Selected
        if(i === 1){
            radioInput.checked = true
        }

        // Create Label
        let theLabel = document.createElement('label');
        theLabel.htmlFor = `answer_${i}`;
        // Create Label Text 
        let theLabelText = document.createTextNode(obj[`answer_${i}`]);
        // Add The Text To Label
        theLabel.appendChild(theLabelText);


        // Add Radio Input And Label To Main Answer
        mainDiv.appendChild(radioInput);
        mainDiv.appendChild(theLabel);
        // Add The Main Div To Answer Area
        answerArea.appendChild(mainDiv);

    } 
   }
}

// Check The Right Answer
function checkAnswer(rAnswer , qCount){
    let answers = document.getElementsByName('question');
    let theChoosenAnswer ;

    for(let i = 0 ; i < answers.length ; i++){
        if(answers[i].checked){
            theChoosenAnswer = answers[i].dataset.answer
        }
    }

    if(rAnswer === theChoosenAnswer ){
        rightAnswers++;
    }else{
        wrongAnswers++;
    }

}
//  Handle Bullets Class
function handleBullets(){
    let bulletsSpans = document.querySelectorAll('.bullets .spans span');
    let arrayOfSpans = Array.from(bulletsSpans);
    arrayOfSpans.forEach((span , index)=>{
        if(currentIndex === index){
            span.className = 'on';
        }
    })
}

// Show Results 
function showResults(count){
    let theResults;
    if(currentIndex === count){
        answerArea.remove();
        quizArea.remove();
        sumbitBtn.remove();
        bullestspan.remove();


        if(rightAnswers > (count/2) && rightAnswers < count){
            theResults = `<span class="good">Good</span> , ${rightAnswers} From ${count} Is Good`;
        }else if(rightAnswers === count){
            theResults = `<span class="perfect">Perfect</span> , ${rightAnswers} From ${count} Is Awsome`;
        }else{
            theResults = `<span class="bad">Bad</span> , ${rightAnswers} From ${count} Is Bad`;
        }
        result.innerHTML = theResults;
        result.style.background = 'white';
        result.style.padding = '10px';
        result.style.marginTop = '10px';
    }
    
}

// Set Count Down 
function setCountDown(duration , count){
    if(currentIndex < count){
        let minutes , seconds;
        countDownInrevel = setInterval(() => {
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;

            countdownElement.innerHTML = `${minutes} : ${seconds}`

            if(--duration < 0){
                clearInterval(countDownInrevel);
                sumbitBtn.click();
            }

        }, 1000);
    }
}

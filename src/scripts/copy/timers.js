var counter;
var controls;
var switchs;
var inputs;
var webtimerBlock;

var cardTitle;
var cardTitleInput;

var addBtn = document.getElementById('add');

var a = [];

var large = '<div class="webtimer__card card"><div><p class="card__title">Название</p><input class="card__input hidden" type="text"><p class="card__timer-type">Тип таймера</p></div><div class="switch switch--horizontal"><input class="radio1" type="radio" name="switch" value="timer" /><label>Таймер</label><input class="radio2" type="radio" name="switch" value="countdown" /><label>Обратный отсчет</label><span class="toggle-outside"><span class="toggle-inside"></span></span></div><div class="webtimer__timer"><div class="timer"><span class="hours">00:</span><span class="mins">00:</span><span class="seconds">00</span></div><div class="countdown__inputs hidden"><input class="countdown__hours" type="number" min="1" max="99" placeholder="Часы"><input class="countdown__mins" type="number" min="1" max="59" placeholder="Минуты"><input class="countdown__sec" type="number" min="1" max="59" placeholder="Секунды"></div><div class="controls"><button type="button" class="start-btn">Старт</button><button type="button" class="stop-btn">Стоп</button></div></div></div>';


addBtn.onclick = () => {
    $('#main').append(large);
    counter = document.querySelectorAll('.timer');
    controls = document.querySelectorAll('.controls');
    switchs = document.querySelectorAll('.switch');
    inputs = document.getElementsByClassName('countdown__inputs');
    webtimerBlock = document.getElementsByClassName('webtimer__card');

    cardTitle = document.querySelectorAll('.card__title');
    cardTitleInput = document.querySelectorAll('.card__input');
    
    
    a.push(new Timer(0,0,0,a.length));
}


class Timer {

    constructor(seconds,mins,hours,item) {
        this.seconds = seconds;
        this.mins = mins;
        this.hours = hours;
        this.timer = null;
        this.item = item;
        this.check = switchs[this.item].children[0].checked = true;

        let startBtn = controls[this.item].children[0];
        let stopBtn = controls[this.item].children[1];

        this.inputH = inputs[this.item].children[0];
        this.inputM = inputs[this.item].children[1];
        this.inputS = inputs[this.item].children[2];

        this.valueH;
        this.valueM;
        this.valueS;

        let mainBlock = webtimerBlock[this.item];


       mainBlock.onmousedown = (event) => {

            let shiftX = event.clientX - mainBlock.getBoundingClientRect().left;
            let shiftY = event.clientY - mainBlock.getBoundingClientRect().top;

            mainBlock.style.position = 'absolute';
            mainBlock.style.zIndex = 1000;
          
            moveAt(event.pageX, event.pageY);

            function moveAt(pageX, pageY) {
                mainBlock.style.left = pageX - (shiftX+10) + 'px';
                mainBlock.style.top = pageY - (shiftY+10) + 'px';
            }
          
            function onMouseMove(event) {
                moveAt(event.pageX, event.pageY);
            }
            
            document.addEventListener('mousemove', onMouseMove);
            mainBlock.onmouseup = function() {
                document.removeEventListener('mousemove', onMouseMove);
                mainBlock.onmouseup = null;
            };

            $(document).keyup(function(e) {
                if (e.key === "Escape") {
                    document.removeEventListener('mousemove', onMouseMove);
                    mainBlock.onmouseup = null;
            }
           });
          
          };

          mainBlock.ondragstart = function() {
            return false;
          };


        cardTitle[this.item].onclick = (e) => {
            e.target.classList.add('hidden');
            cardTitleInput[this.item].classList.remove('hidden');
        }

        cardTitleInput[this.item].onchange = (e) => {
            cardTitle[this.item].innerText = e.target.value;
            e.target.classList.add('hidden');
            cardTitle[this.item].classList.remove('hidden');
        }

        
        
        switchs[this.item].children[0].onclick = () => {
            inputs[this.item].classList.add('hidden');
            this.check = true;
            this.resetTimer();
        }
        switchs[this.item].children[2].onclick = () => {
            inputs[this.item].classList.remove('hidden');
            this.check = false;
            this.resetTimer();
        }

        this.inputH.oninput = () => {
            this.hours = validInputs(this.inputH,99);
            this.printTimer();
        };
        this.inputM.oninput = () => {
            this.mins = validInputs(this.inputM,59);
            this.printTimer();
        };
        this.inputS.oninput = () => {
            this.seconds = validInputs(this.inputS,59);
            this.printTimer();
        };

        function validInputs(inputName,num) {
            inputName.value = inputName.value.replace(/^0+/, '');
            if(inputName.value > num) {
                inputName.value = num;
            } else if(inputName.value == '') {
                inputName.value = 0;
            }
            return inputName.value;
        }


        startBtn.onclick = () => {
            let start = () => {
                this.startTimer();   
            }

            if(!this.check) {
                if(this.hours == 0 && this.mins == 0 && this.seconds == 0) {
                    alert('Заполните минимум 1 поле!');
                } else {
                    this.inputH.disabled = this.inputM.disabled = this.inputS.disabled = true;
                    start();
                }
            } else {
                start();
            }

        }
        
        stopBtn.onclick = () => {
            this.stopTimer();
            
        }

    }

    printTimer(){
        if(this.hours < 10) {
            counter[this.item].children[0].innerText = '0'+this.hours+':';
        } else counter[this.item].children[0].innerText = this.hours+':';

        if(this.mins < 10) {                
            counter[this.item].children[1].innerText = '0'+this.mins+':';
        } else counter[this.item].children[1].innerText = this.mins+':';

        if(this.seconds < 10) {
            counter[this.item].children[2].innerText = '0'+this.seconds;
        } else {
            counter[this.item].children[2].innerText = this.seconds;
        }
    }
    
    counterTimer() {
        this.seconds++;
        if(this.seconds > 59) {
            this.seconds = 0;
            this.mins++;
            if(this.mins > 59) {
                this.mins = 0;
                this.hours++;
            }
        }

        this.printTimer();
    }

    counterCountdown() {
        this.seconds--;
        if(this.seconds == -1) {
            this.mins--;
            this.seconds = 59;
            if(this.mins == -1) {
                this.hours--;
                this.mins = 59;
            }
        }

        this.printTimer();
        if (this.seconds == 0 && this.mins == 0 && this.hours == 0) {
            counter[this.item].children[0].style.color = counter[this.item].children[1].style.color = counter[this.item].children[2].style.color = "red";
            clearInterval(this.timer);
            this.stopTimer();
        }
    }

    startTimer() {
        counter[this.item].children[0].style.color = counter[this.item].children[1].style.color = counter[this.item].children[2].style.color = "";
        controls[this.item].children[0].style.display = 'none';
        controls[this.item].children[1].style.display = 'block';
        if ( this.timer === null ) {
            this.timer = setInterval(() => {
                if(this.check) {
                    this.counterTimer();
                } else {
                    this.counterCountdown();
                }
            },1000);
        }
        
    }

    stopTimer() {
        this.clearInputs();
        controls[this.item].children[0].style.display = 'block';
        controls[this.item].children[1].style.display = 'none';
        clearInterval(this.timer);
        this.timer = null;
    }

    resetTimer() {
        this.seconds = 0;
        this.mins = 0;
        this.hours = 0;
        this.clearInputs();
        this.printTimer();
        this.stopTimer();
    }

    clearInputs() {
        this.inputH.disabled = this.inputM.disabled = this.inputS.disabled = false;
        this.inputH.value = this.inputM.value = this.inputS.value = '';
    }

}
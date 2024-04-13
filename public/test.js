let quenavigator=document.querySelector(".quenavigator");
for(i=0;i<data.length;i++){
  let btn=document.createElement("button");
  btn.setAttribute("class",`btn${i+1} btn`);
  btn.innerHTML=i+1;
  quenavigator.appendChild(btn);
}

let currentque = 0;
  let score = 0;

let h3 = document.querySelector("h3");
let nextbtn = document.querySelector(".next");
let opt1 = document.querySelector("label[for='opt1']");
let opt2 = document.querySelector("label[for='opt2']");
let opt3 = document.querySelector("label[for='opt3']");
let opt4 = document.querySelector("label[for='opt4']");
let radiobtns = [ document.querySelector("#opt1"),
                  document.querySelector("#opt2"),
                  document.querySelector("#opt3"),
                  document.querySelector("#opt4") ];
let submitbtn = document.querySelector(".submitbtn");
let hidInput = document.querySelector(".hidden");
hidInput.setAttribute("name","score");
let btns=document.querySelectorAll(".btn");
let homelink=document.querySelector(".homelink");


function loadquiz() {
h3.innerHTML = data[currentque].question ;
opt1.innerHTML = data[currentque].A ;
opt2.innerHTML = data[currentque].B ;
opt3.innerHTML = data[currentque].C ;
opt4.innerHTML = data[currentque].D ;
btns[currentque].style.backgroundColor='#c2185b'
  btns.forEach(otherBtn => {
    if (otherBtn !== btns[currentque]) {
        otherBtn.style.backgroundColor = 'black'; 
    }
  });
}
function result(){
for(i=0;i<data.length;i++){
  if(data[i].answer==data[i].selected){
  score++;
  console.log(score);
  hidInput.setAttribute("value",score);
  }
}
};

function selectopt(){
console.log('selectopt called');
radiobtns.forEach(radiobtn => {
  radiobtn.addEventListener('change', function() {
  if (this.id === 'opt1') {
      data[currentque].selected="A";
  } else if (this.id === 'opt2') {
      data[currentque].selected="B";
  } else if (this.id === 'opt3') {
      data[currentque].selected="C";
  } else if (this.id === 'opt4') {
      data[currentque].selected="D";
  }
  });
});
}

loadquiz();
selectopt();


nextbtn.addEventListener("click", (event) => {
if (currentque < data.length) {
  currentque++;
  if(currentque==data.length){
  currentque=0;
  }
  loadquiz();
} else {
  currentque = 1;
} 
radiobtns.forEach((radiobtn)=>{
  radiobtn.checked=false;
});

event.preventDefault();
seechoice();
});

function seechoice(){
  if(data[currentque].selected=='A'){
  radiobtns[0].checked=true;
  } else if(data[currentque].selected=='B'){
  radiobtns[1].checked=true;
  } else if(data[currentque].selected=='C'){
  radiobtns[2].checked=true;
  } else if(data[currentque].selected=='D'){
  radiobtns[3].checked=true;
  }
}

let previousbtn=document.querySelector(".previous");

previousbtn.addEventListener("click", (event) => {
  
  if(currentque===0){
  currentque=9;
  loadquiz();
  }
  else if (currentque < data.length) {
  currentque--;
  loadquiz();
  }
  radiobtns.forEach((radiobtn)=>{
  radiobtn.checked=false;
  });
  event.preventDefault();
  seechoice();
});



for (let i = 0; i < data.length; i++) {
btns[i].addEventListener('click',(event)=>{
currentque=i;
loadquiz();
radiobtns.forEach(radiobtn => {
  radiobtn.checked = false; 
});
seechoice();

})
}

submitbtn.addEventListener("click",()=>{
result();
})


homelink.addEventListener("click",()=>{
  alert("you won't be able to resume test ");
})

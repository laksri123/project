const ratingVal = document.getElementById("rating-val");

function ratingChangeHandler(val) {
  console.log("In Handler");
  console.log(val);
  ratingVal.innerHTML = val;
  if (val == 5) {
    ratingVal.style.color = "limegreen";
  } else if (val == 1) {
    ratingVal.style.color = "red";
  } else {
    ratingVal.style.color = "black";
  }
}

function alertCancelHandler() {
  console.log("Cancel Button Clicked");
  const alert = document.getElementsByClassName("alert")[0];
  alert.classList.add("removeAlert");
}

let filter = document.querySelectorAll(".filter");
function rightClickHandler() {
  console.log("Right button clicked");
  for (let i = 0; i < filter.length; i++) {
    filter[i].classList.add("transNegative");
  }
  document.querySelector(".fa-circle-chevron-right").style.visibility =
    "hidden";
  document.querySelector(".fa-circle-chevron-left").style.visibility =
    "visible";
}

function leftClickHandler() {
  console.log("Left button clicked");

  for (let i = 0; i < filter.length; i++) {
    filter[i].classList.remove("transNegative");
  }
  document.querySelector(".fa-circle-chevron-right").style.visibility =
    "visible";
  document.querySelector(".fa-circle-chevron-left").style.visibility = "hidden";
}

const gstData = document.querySelectorAll(".gstData");
const btn = document.querySelector(".post-nav-btn-back");

function displayTaxClickHandler() {
  btn.classList.toggle("postNavBtnTran");

  if (gstData[0].style.display === "none" || !gstData[0].style.display) {
    for (let i = 0; i < gstData.length; i++) {
      gstData[i].style.display = "inline";
    }
  } else {
    for (let i = 0; i < gstData.length; i++) {
      gstData[i].style.display = "none";
    }
  }
}

const input = document.getElementById("image");
const preview = document.getElementById("file-preview");
if (preview.getAttribute("src") === "#") {
  preview.style.display = "none";
}
const previewPhoto = () => {
  const file = input.files;
  if (file) {
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      preview.setAttribute("src", event.target.result);
      preview.style.display = "block";
    };
    fileReader.readAsDataURL(file[0]);
  }
};

let options = document.getElementsByTagName("option");
function selectedOption() {
  for (let i = 0; i < options.length; i++) {
    if (options[i].value === category) {
      options[i].selected='selected';
    }
  }
}

window.addEventListener("load", (event) => {
  selectedOption();
});

function userClickHandler(){
  let userDetails = document.getElementsByClassName('userDetails')[0];
  if(userDetails.style.display=='flex'){
    userDetails.style.display='none';
  }
  else{
    userDetails.style.display='flex';
  }
}

function signUpPassClickHandler(event){
  let sigupPass= document.getElementById("sigup-pass");
  if(event.target.getAttribute("class")=="fa-solid fa-eye"){
    sigupPass.setAttribute("type","text");
    event.target.setAttribute("class","fa-solid fa-eye-slash");
  }
  else{
    sigupPass.setAttribute("type","password");
    event.target.setAttribute("class","fa-solid fa-eye");
  }
}


function loginPassClickHandler(event){
  let loginPass= document.getElementById("login-pass");
  if(event.target.getAttribute("class")=="fa-solid fa-eye"){
    loginPass.setAttribute("type","text");
    event.target.setAttribute("class","fa-solid fa-eye-slash");
  }
  else{
    loginPass.setAttribute("type","password");
    event.target.setAttribute("class","fa-solid fa-eye");
  }
}

function userPassClickHandler(event){
  let userPass= document.getElementById("userPass");
  if(event.target.getAttribute("class")=="fa-solid fa-eye"){
    userPass.setAttribute("type","text");
    event.target.setAttribute("class","fa-solid fa-eye-slash");
  }
  else{
    userPass.setAttribute("type","password");
    event.target.setAttribute("class","fa-solid fa-eye");
  }
}

function userNewPassClickHandler(event){
  let userNewPass= document.getElementById("userNewPass");
  if(event.target.getAttribute("class")=="fa-solid fa-eye"){
    userNewPass.setAttribute("type","text");
    event.target.setAttribute("class","fa-solid fa-eye-slash");
  }
  else{
    userNewPass.setAttribute("type","password");
    event.target.setAttribute("class","fa-solid fa-eye");
  }
}

function changePasswordBoxClickHandler(){
  console.log("Handle");
  let passwordBox = document.querySelector('.userDetails-pass');
  console.log(passwordBox);
  if(passwordBox.style.display=="none"){
    passwordBox.style.display="flex";
  }
  else{
    passwordBox.style.display="none";
  }
}

function editUsername(){
    let editUserBox=document.getElementById('editUserBox');
    if(editUserBox.style.display=="none"){
      editUserBox.style.display="flex";
    }
    else{
      editUserBox.style.display="none"
    }
}

function usernameChangeHandler(event){
  let username= document.getElementById('edit-username');
  username.innerHTML=event.target.value;
}



function previewProfilePhoto(){
  const profilephoto = document.querySelector(".profilephoto");
  const editPhoto = document.getElementById("editPhoto");
  console.log("In");
  const file = editPhoto.files;
  if (file) {
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      profilephoto.setAttribute("src", event.target.result);
    };
    fileReader.readAsDataURL(file[0]);
  }
};
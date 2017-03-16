/*Import our Firebase app*/
var config = {
    apiKey: "AIzaSyCcIuaDuAx9NFJKzBj4FkuR3e320eGuS_g",
    authDomain: "nbadex-ff8cf.firebaseapp.com",
    databaseURL: "https://nbadex-ff8cf.firebaseio.com",
    storageBucket: "nbadex-ff8cf.appspot.com",
    messagingSenderId: "172457613001"
};

firebase.initializeApp(config);
const auth = firebase.auth();
var provider = new firebase.auth.GoogleAuthProvider();
var firstTimeSignup = false;

/*If user is signing in, check for errors*/
$('.form-signin').on('submit', function(event){
    event.preventDefault();
    const email = document.getElementById("LogInEmail").value;
    const pass = document.getElementById("LogInPassword").value;
    const promise = auth.signInWithEmailAndPassword(email,pass);
    promise.catch(function(e) {
        var errorCode = e.code;
        var errorMessage = e.message;

        /*Display Error Messages*/
        if (errorCode == 'auth/wrong-password') {
            $('#err-msg').html("Invalid password!");
        }
        else if(errorCode == 'auth/invalid-email'){
            $('#err-msg').html("Invalid email");
        }
        else if(errorCode == 'auth/user-not-found'){
             $('#err-msg').html("User not found!");
        }
        else {
            $('#err-msg').html(errorMessage);
        }

        $("#login-error").css("visibility","visible");
    });
});

/*If user is signing up then check for errors*/
$('.form-signup').on('submit', function(event) {
    event.preventDefault();
    firstTimeSignup = true;
    const email = document.getElementById("SignUpEmail").value;
    const pass = document.getElementById("SignUpPassword").value;
    const promise = auth.createUserWithEmailAndPassword(email,pass);
    promise.catch(function(e) {
        var errorCode = e.code;
        var errorMessage = e.message;

        /*Display Sign Up error messages*/
        if (errorCode == 'auth/email-already-in-use') {
            $('#err-msg').html("Email already in use");
        }
        else if(errorCode == 'auth/invalid-email'){
            $('#err-msg').html("Invalid email");
        }
        else if(errorCode == 'auth/weak-password'){
            $('#err-msg').html("Password too weak!");
        }
        else {
            $('#err-msg').html(errorMessage);
        }
        $("#login-error").css("visibility","visible");
    });
});

/*If signing in with Google*/
$('#googlebtn').click(function() {
    firebase.auth().signInWithPopup(provider);
});

/*When the user has successfully sign up or logged in*/
firebase.auth().onAuthStateChanged( function(user){
    if(user){
        /*If signing up for the first time, update the user's team name*/
        if(firstTimeSignup){
            currentU = firebase.auth().currentUser;
            currentU.updateProfile({
                displayName: document.getElementById("SignUpName").value
            }).then(function(){
                window.location = 'views/myTeam.html'
            });
        }else{
            window.location = 'views/myTeam.html'
        }
    }
});

/*Misc jQuery for error messages*/
$('.alert .close').on('click', function(e) {
     $(this).parent().hide();
});

$("#close-btn").click(function(){
    $("#login-error").css("visibility","hidden");
});

$(".hide-alert").focusin(function(){
    $("#login-error").css("visibility","hidden");
});
        
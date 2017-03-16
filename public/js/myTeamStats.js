/*Initialize Firebase*/
var config = {
apiKey: "AIzaSyCcIuaDuAx9NFJKzBj4FkuR3e320eGuS_g",
authDomain: "nbadex-ff8cf.firebaseapp.com",
databaseURL: "https://nbadex-ff8cf.firebaseio.com",
storageBucket: "nbadex-ff8cf.appspot.com",
messagingSenderId: "172457613001"
};

firebase.initializeApp(config);
const auth = firebase.auth();

/*Log out functionality*/
$(document).ready(function(){   
    $('#LogOut').click(function() {
        event.preventDefault();
        firebase.auth().signOut();
    });
});

/*Give Vue.js the data for all of the User''s players*/
firebase.auth().onAuthStateChanged(function(user) {
    if(user){
        var uid = user.uid;
        var teamName = "Team " + user.displayName;
        document.getElementById("teamName").innerHTML = teamName;
        var playersRef = firebase.database().ref('users/'+uid);
        var app = new Vue ({
            el: '#app',
            firebase: {
                players: playersRef
            }
        })
    }else{
        /*If logging out send them back to index*/
        window.location = '../index.html';
    }
});
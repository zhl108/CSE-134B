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

/*jQuery for logging out function*/
$(document).ready(function(){
	$('#LogOut').click(function() {
		event.preventDefault();
		firebase.auth().signOut();
	});
});

/*Once we have verified the user logs out, send them back to log in page*/
firebase.auth().onAuthStateChanged(function(user) {
	if(user){
    }
    else{
    	window.location = '../index.html';
    }
});

var playersRef = firebase.database().ref('players');

var app = new Vue({
    el: '#app',
    firebase: {
        players: playersRef
    },
    methods: {
        /*Method of adding the player's img to Firebase storage and adding player's stats to database*/
        addNewPlayer: function() {
            if (event) event.preventDefault();
            var img = $("input:file");
            var imgNames = img[0].value.split('\\');
            const imgName = imgNames[imgNames.length-1];
            var imgFile = document.getElementById("imgFile").files[0];
            const names = document.getElementById("name").value;

            const firstName = names.split(" ")[0];
            const lastName = names.split(" ")[1];
            const playerPath = "Players/" + firstName + lastName;

            var playerRef = firebase.storage().ref(playerPath);

            name = firstName+lastName
            lowername = name.toLowerCase();
            var imgRef = playerRef.child(lowername);
            imgRef.put(imgFile).then(function() {
                console.log("picture upload complete");
            });

            var database = firebase.database();
            database.ref('players/'+firstName+lastName).set({
                name: names,
                position: document.getElementById("position").value,
                pointsPerGame: document.getElementById("PPG").value,
                fieldGoalPercentage: document.getElementById("FG").value,
                assistsPerGame: document.getElementById("APG").value,
                reboundsPerGame: document.getElementById("RPG").value,
                stealsPerGame: document.getElementById("SPG").value,
                blocksPerGame: document.getElementById("BPG").value,
                playerEfficiencyRating: document.getElementById("PER").value,
            });

            resetFields();
        },
        /*Method to populate the table with the player's from database*/
        populate: function(player) {
            names = player.name;
            const firstName = names.split(" ")[0];
            const lastName = names.split(" ")[1];
            name = firstName+lastName;
            lowername = name.toLowerCase();

            firebase.storage().ref('Players/'+name).child(lowername).getDownloadURL().then(function(url) {
                var img = document.getElementById("editImg");
                img.src = url;
            });

            document.getElementById("editName").value = player.name;
            document.getElementById("editPosition").value = player.position;
            document.getElementById("editPPG").value = player.pointsPerGame;
            document.getElementById("editFG").value = player.fieldGoalPercentage;
            document.getElementById("editAPG").value = player.assistsPerGame;
            document.getElementById("editRPG").value = player.reboundsPerGame;
            document.getElementById("editSPG").value = player.stealsPerGame;
            document.getElementById("editBPG").value = player.blocksPerGame;
            document.getElementById("editPER").value = player.playerEfficiencyRating;
        },
        /*Method to edit a player's img or stats*/
        editPlayer: function() {
            if (event) event.preventDefault();
            names = document.getElementById("editName").value;
            const firstName = names.split(" ")[0];
            const lastName = names.split(" ")[1];

            var database = firebase.database();
            database.ref('players/'+firstName+lastName).update({
                position: document.getElementById("editPosition").value,
                pointsPerGame: document.getElementById("editPPG").value,
                fieldGoalPercentage: document.getElementById("editFG").value,
                assistsPerGame: document.getElementById("editAPG").value,
                reboundsPerGame: document.getElementById("editRPG").value,
                stealsPerGame: document.getElementById("editSPG").value,
                blocksPerGame: document.getElementById("editBPG").value,
                playerEfficiencyRating: document.getElementById("editPER").value,
            });

			var imgFile = document.getElementById("imgFileEdit").files[0];
            if(imgFile){
                const playerPath = "Players/" + firstName + lastName;
                var playerRef = firebase.storage().ref(playerPath);
                name = firstName+lastName
                lowername = name.toLowerCase();
                var imgRef = playerRef.child(lowername);
                imgRef.put(imgFile).then(function() {
                    console.log("picture upload complete");
                });                
            }
        },
        /*Method to remove the img and stats from storage and database*/
        deletePlayer: function(player) {
            playersRef.child(player['.key']).remove();
            names = player.name;
            const firstName = names.split(" ")[0];
            const lastName = names.split(" ")[1];
            name = firstName+lastName;
            lowername = name.toLowerCase();
            firebase.storage().ref('Players/'+name).child(lowername).delete();
            console.log("deleted " + player.name);
        },
        /*Method to add each player to the User's team*/
        addToTeam: function(playerS) {
            user = firebase.auth().currentUser;
            name = playerS.name.split(" ")[0] + playerS.name.split(" ")[1];
            lowername = name.toLowerCase();
            firebase.storage().ref('Players/' + name).child(lowername).getDownloadURL().then(function(url){
                firebase.database().ref('users/'+user.uid).once('value').then(function(snapshot){
                    //check if the player is in the team already
                    var exist = snapshot.forEach(function(childSnapshot) {
                        var exist = (childSnapshot.child('playerName').val() == playerS.name);

                        if(exist){
                	        $("#player-full").css("visibility","hidden");       
                            setTimeout(function(){
                                $('#player-full').addClass('alert-danger').removeClass('alert-success');
                                $('#err-msg').html('Player exists in your team');
                	            $("#player-full").css("visibility","visible");
                                
                            }, 50);
                            return true;
                        }
                    }); 

                    if(exist)
                        return;  //do Not add player if already exists in team*/
                    
                    //add the player if there is still space on the team
                    var i = 1;
                    while(i<=10){
                        var player = snapshot.child('player'+i).val();
                        if(player.playerName=='Choose Player'){
                            updateUserTeam(user.uid, 'player'+i, url, playerS.name, playerS.position, playerS.pointsPerGame, playerS.fieldGoalPercentage, playerS.reboundsPerGame, playerS.assistsPerGame, playerS.blocksPerGame, playerS.stealsPerGame, playerS.playerEfficiencyRating);

                	        $("#player-full").css("visibility","hidden");       
                            setTimeout(function(){
                                $('#player-full').addClass('alert-success').removeClass('alert-danger');
                                $('#err-msg').html('player added successfully');
                	            $("#player-full").css("visibility","visible");
                            }, 50);
                            return;
                        }
                        i++;
                    }
                    //There rare no players left in hte team*/
                	$("#player-full").css("visibility","hidden");       
                    setTimeout(function(){
                        $('#player-full').addClass('alert-danger').removeClass('alert-success');
                        $('#err-msg').html('Team is full, cannot add more players');
                	    $("#player-full").css("visibility","visible");       
                    }, 50);

                });
            });
        }
    }
    });
    /*Method that will update a certain player slot in the User's team with a  specified player*/
    function updateUserTeam(uid, playerKey, imgUrl, name, pos, ppg, fgp, rpg, apg, bpg, spg, per) {
        firebase.database().ref('users/' + uid + '/' + playerKey).update({
        img: imgUrl,
        playerName: name,
        position: pos,
        pointsPerGame: ppg,
        reboundsPerGame: rpg,
        assistsPerGame: apg,
        stealsPerGame: spg,
        blocksPerGame: bpg,
        fieldGoalPercentage: fgp,
        playerEfficiencyRating: per
        }).then(function(){
           return true;
       });
   };
   // Method to reset fields after adding a player
   function resetFields() {
        document.getElementById("name").value = "";
        document.getElementById("PPG").value = "";
        document.getElementById("RPG").value = "";
        document.getElementById("APG").value = "";
        document.getElementById("BPG").value = "";
        document.getElementById("SPG").value = "";
        document.getElementById("FG").value = "";
        document.getElementById("PER").value = "";
        document.getElementById("position").value = "PG";
        document.getElementById("imgFile").value = "";
   }
    
    $("#close-btn").click(function(){
		 $("#player-full").css("visibility","hidden");
    });
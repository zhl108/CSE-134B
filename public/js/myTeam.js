        /*Import Firebase app*/
        var config = {
            apiKey: "AIzaSyCcIuaDuAx9NFJKzBj4FkuR3e320eGuS_g",
            authDomain: "nbadex-ff8cf.firebaseapp.com",
            databaseURL: "https://nbadex-ff8cf.firebaseio.com",
            storageBucket: "nbadex-ff8cf.appspot.com",
            messagingSenderId: "172457613001"
        };

        firebase.initializeApp(config);
        const auth = firebase.auth();
        var playerToDelete;

        /*Sign out functionality*/
        $(document).ready(function(){   
           $('#LogOut').click(function() {
               event.preventDefault();
               firebase.auth().signOut();
           });
       });

        /*Checks if user exists*/
        firebase.auth().onAuthStateChanged(function(user){
            if(user){
                var teamName = "Team " + user.displayName;
                document.getElementById("teamName").innerHTML = teamName;

                var uid;
                uid = user.uid; 

                var usersRef = firebase.database().ref('users');

                        //check if user/ has a child node with the name of uid
                        usersRef.once('value').then(function(snapshot) {
                            var hasID = snapshot.child(String(uid)).exists();

                            if (hasID) {
                            	/*Populate the user's team from Firebase*/                       
                                populateTeam(uid);
                            }else {
                            	/*Add blank players to the user's team*/
                                var tempJson = {};
                                var tempPic = '../img/avatar.jpg';                      				                            				
                                tempJson[uid] = {
                                    player1: {  
                                            'playerName': 'Choose Player',
                                            'img': tempPic,
                                            'position': 'Position'},
                                    player2: {
                                            'playerName': 'Choose Player',
                                            'img': tempPic,
                                            'position': 'Position'},
                                    player3: {  
                                            'playerName': 'Choose Player',
                                            'img': tempPic,
                                            'position': 'Position'},
                                    player4: {
                                            'playerName': 'Choose Player',
                                            'img': tempPic,
                                            'position': 'Position'},
                                    player5: {  
                                            'playerName': 'Choose Player',
                                            'img': tempPic,
                                            'position': 'Position'},
                                    player6: {
                                            'playerName': 'Choose Player',
                                            'img': tempPic,
                                            'position': 'Position'},
                                    player7: {  
                                            'playerName': 'Choose Player',
                                            'img': tempPic,
                                            'position': 'Position'},
                                    player8: {
                                            'playerName': 'Choose Player',
                                            'img': tempPic,
                                            'position': 'Position'},
                                    player9: {  
                                            'playerName': 'Choose Player',
                                            'img': tempPic,
                                            'position': 'Position'},
                                    player10: {
                                            'playerName': 'Choose Player',
                                            'img': tempPic,
                                            'position': 'Position'}
                                };
                                var database = firebase.database();
                                database.ref('users').update(tempJson);
                            }
                        });
                    }
                    else{
                    	/*If logging out, then there is no user. So send back to index*/
                    	window.location = '../index.html';
                    }
                });	

        /*Populates the view for the user's team from the database*/
        function populateTeam(uid){
            firebase.database().ref('users/'+uid).once('value').then(function(snapshot){
             snapshot.forEach(function(childSnapshot){
              if((childSnapshot.key).includes('player')){
                var player = document.getElementById(childSnapshot.key);
                player.children[0].innerHTML = childSnapshot.val().position;
                player.children[1].src = childSnapshot.val().img;
                if(childSnapshot.val().position == 'Position')
                   player.children[1].setAttribute("data-toggle", "none");
               else{
                   player.children[1].setAttribute("data-toggle", "modal");
               }
               player.children[2].innerHTML = childSnapshot.val().playerName;
           }
       });
         });
        }        
        /*Removed the player from the team and update the view*/
        function removePlayer() {
            var user = firebase.auth().currentUser;
            var uid = user.uid;

            var blankPlayer = {
                'playerName': 'Choose Player',
                'img': '../img/avatar.jpg',
                'position': 'Position'
            }
            firebase.database().ref('users/'+uid+'/'+playerToDelete).update(blankPlayer);
            var player = document.getElementById(playerToDelete);
            player.children[0].innerHTML = 'Position';
            player.children[1].src = '../img/avatar.jpg';
            player.children[1].setAttribute('data-toggle','none');
            player.children[2].innerHTML = 'Choose Player';
        }

        /*Need to remember which player to delete when clicking modal*/
        $(document).on("click", ".img-responsive", function(){
         playerToDelete = $(this).parent().attr('id');
     });
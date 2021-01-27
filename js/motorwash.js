$(document).ready(function () {
  var firebaseConfig = {
    apiKey: "AIzaSyCT5Ecw3QINV0SU7mH2zJ8j2FC_-n_pV8s",
    authDomain: "motorwash-8e684.firebaseapp.com",
    projectId: "motorwash-8e684",
    storageBucket: "motorwash-8e684.appspot.com",
    messagingSenderId: "408982107627",
    appId: "1:408982107627:web:8e463163cc988d970fd5ae",
    measurementId: "G-X9LC6PLBT9"
  };

  firebase.initializeApp(firebaseConfig);

  var Auth = firebase.auth();
  var dbRef = firebase.database();
  var bookingsRef = dbRef.ref("bookings");
  var usersRef = dbRef.ref("users");
  var auth = null;

  // $(document).ready(function () {
  //initialize the firebase app
  // var firebaseConfig = {
  //   apiKey: "AIzaSyC4CmK8J8yyXXAoL7InPgf0jhs4Fm0edmM",
  //   authDomain: "carwash-61e2e.firebaseapp.com",
  //   projectId: "carwash-61e2e",
  //   storageBucket: "carwash-61e2e.appspot.com",
  //   messagingSenderId: "663108418728",
  //   appId: "1:663108418728:web:d1509745a8a133198f169d",
  //   measurementId: "G-8V2EMZQNQ2"
  // };
  // Initialize Firebase
  // firebase.initializeApp(firebaseConfig);
  // firebase.analytics();

  // $(document).ready(function () {
  //initialize the firebase app
  // var config = {
  //   apiKey: "AIzaSyCKNcULQZxFMYioXei32XNWQVoeutz4XDA",
  //   authDomain: "contact-book-new.firebaseapp.com",
  //   databaseURL: "https://contact-book-new.firebaseio.com",
  //   projectId: "contact-book-new",
  //   storageBucket: "contact-book-new.appspot.com",
  //   messagingSenderId: "473268388365"
  // };

  // var config = {
  //   apiKey: "AIzaSyBG0GwvjzamTPpxYjrJVF3827Tyq232JLo",
  //   authDomain: "rajdemo-422ad.firebaseapp.com",
  //   projectId: "rajdemo-422ad",
  //   storageBucket: "rajdemo-422ad.appspot.com",
  //   messagingSenderId: "191311794966",
  //   appId: "1:191311794966:web:f48d83e07e100debad7637",
  //   measurementId: "G-CKK38CNBF0"
  // };
  // firebase.initializeApp(config);

  // //create firebase references
  // var Auth = firebase.auth();
  // var dbRef = firebase.database();
  // var bookingsRef = dbRef.ref("bookings");
  // var usersRef = dbRef.ref("users");
  // var auth = null;

  //Register
  $("#registerForm").on("submit", function (e) {
    e.preventDefault();
    $("#registerModal").modal("hide");
    $("#messageModalLabel").html(
      spanText('<i class="fa fa-cog fa-spin"></i>', ["center", "info"])
    );
    $("#messageModal").modal("show");
    var data = {
      email: $("#registerEmail").val(), //get the email from Form
      firstName: $("#registerFirstName").val(), // get firstName
      lastName: $("#registerLastName").val() // get lastName
    };
    var passwords = {
      password: $("#registerPassword").val(), //get the pass from Form
      cPassword: $("#registerConfirmPassword").val() //get the confirmPass from Form
    };
    if (
      data.email != "" &&
      passwords.password != "" &&
      passwords.cPassword != ""
    ) {
      if (passwords.password == passwords.cPassword) {
        //create the user

        firebase
          .auth()
          .createUserWithEmailAndPassword(data.email, passwords.password)
          ///        .then(success => {
          ///          var user = firebase.auth().currentUser;
          ///          console.log("reg", user);
          ///          var uid;
          ///          if (user != null) {
          ///            uid = user.uid;

          .then(function (user) {
            var user = firebase.auth().currentUser;
            return user.updateProfile({
              displayName: data.firstName + " " + data.lastName
              // photoURL: "https://example.com/jane-q-user/profile.jpg"
            });
          })

          .then(function (user) {
            //now user is needed to be logged in to save data
            var user = firebase.auth().currentUser;
            auth = user;
            //now saving the profile data
            usersRef
              .child(user.uid)
              .set(data)
              .then(function () {
                console.log("User Information Saved:", user.uid);
              });
            $("#messageModalLabel").html(
              spanText(
                "Success! " + "Thank you for registering " + user.displayName,
                ["center", "success"]
              )
            );

            // $("#messageModal").modal("hide");
          })
          .catch(function (error) {
            console.log("Error creating user:", error);
            $("#messageModalLabel").html(
              spanText("ERROR: " + error.code, ["danger"])
            );
          });
      } else {
        //password and confirm password didn't match
        $("#messageModalLabel").html(
          spanText("ERROR: Passwords didn't match", ["danger"])
        );
      }
    }
  });

  //           var firebaseRef = firebase.database().ref();
  //           var userData = {
  //             userFirstName: data.firstName,
  //             userLastName: data.lastName,
  //             userEmail: data.email,
  //             userPassword: passwords.password,
  //             displayName: data.firstName + " " + data.lastName

  //           };
  //           firebaseRef.child(uid).set(userData);
  //           console.log("ud", userData);
  //           $("#messageModalLabel").html(
  //             spanText("Account Created!", ["center", "success"])
  //           );
  //           console
  //             .log(
  //               "Your Account Created"
  //               // "Your account was created successfully, you can log in now."
  //             )
  //             .then(value => {
  //               setTimeout(function () {
  //                 window.location.replace("../index.html");
  //               }, 1000);
  //             });
  //         })
  //         .catch(error => {
  //           // Handle Errors here.
  //           var errorCode = error.code;
  //           var errorMessage = error.message;
  //           console.log({
  //             type: errorCode,
  //             // title: "Error2",
  //             text: errorMessage
  //           });
  //         });
  //     } else {
  //       //password and confirm password didn't match
  //       $("#messageModalLabel").html(
  //         spanText("ERROR: Passwords didn't match", ["danger"])
  //       );
  //     }
  //   }
  // });

  // //Register
  // $("#registerForm").on("submit", function (e) {
  //   e.preventDefault();
  //   $("#registerModal").modal("hide");
  //   $("#messageModalLabel").html(
  //     spanText('<i class="fa fa-cog fa-spin"></i>', ["center", "info"])
  //   );
  //   $("#messageModal").modal("show");
  //   var data = {
  //     email: $("#registerEmail").val(), //get the email from Form
  //     firstName: $("#registerFirstName").val(), // get firstName
  //     lastName: $("#registerLastName").val() // get lastName
  //   };
  //   var passwords = {
  //     password: $("#registerPassword").val(), //get the pass from Form
  //     cPassword: $("#registerConfirmPassword").val() //get the confirmPass from Form
  //   };
  //   if (
  //     data.email != "" &&
  //     passwords.password != "" &&
  //     passwords.cPassword != ""
  //   ) {
  //     if (passwords.password == passwords.cPassword) {
  //       //create the user

  //       firebase
  //         .auth()
  //         .createUserWithEmailAndPassword(data.email, passwords.password)
  //         .then(function (user) {
  //           return user.updateProfile({
  //             displayName: data.firstName + " " + data.lastName
  //           });
  //         })
  //         .then(function (user) {
  //           //now user is needed to be logged in to save data
  //           auth = user;
  //           //now saving the profile data
  //           usersRef
  //             .child(user.uid)
  //             .set(data)
  //             .then(function () {
  //               console.log("User Information Saved:", user.uid);
  //             });
  //           $("#messageModalLabel").html(
  //             spanText("Success!", ["center", "success"])
  //           );

  //           $("#messageModal").modal("hide");
  //         })
  //         .catch(function (error) {
  //           console.log("Error creating user:", error);
  //           $("#messageModalLabel").html(
  //             spanText("ERROR: " + error.code, ["danger"])
  //           );
  //         });
  //     } else {
  //       //password and confirm password didn't match
  //       $("#messageModalLabel").html(
  //         spanText("ERROR: Passwords didn't match", ["danger"])
  //       );
  //     }
  //   }
  // });

  //Login
  $("#loginForm").on("submit", function (e) {
    e.preventDefault();
    $("#loginModal").modal("hide");
    $("#messageModalLabel").html(
      spanText('<i class="fa fa-cog fa-spin"></i>', ["center", "info"])
    );
    $("#messageModal").modal("show");

    if ($("#loginEmail").val() != "" && $("#loginPassword").val() != "") {
      //login the user
      var data = {
        email: $("#loginEmail").val(),
        password: $("#loginPassword").val()
      };
      firebase
        .auth()
        .signInWithEmailAndPassword(data.email, data.password)
        .then(function (authData) {
          console.log("li ad", authData);
          auth = authData;
          $("#messageModalLabel").html(
            spanText(
              "Login Success!" + " " + "Welcome back " + auth.user.displayName,
              ["center", "success"]
            )
          );
          // $("#messageModal").modal("hide");
        })
        .catch(function (error) {
          console.log("Login Failed!", error);
          $("#messageModalLabel").html(
            spanText("ERROR: " + error.code, ["danger"])
          );
        });
    }
  });

  $("#logout").on("click", function (e) {
    e.preventDefault();
    firebase.auth().signOut();
  });

  //save booking
  $("#bookingForm").on("submit", function (event) {
    event.preventDefault();
    $("#bookingModal").modal("hide");
    if (auth != null) {
      if ($("#name").val() != "" || $("#mobile").val() != "") {
        bookingsRef.child(auth.uid).push({
          name: $("#name").val(),
          mobile: $("#mobile").val(),
          wash_date: $("#wash-date").val(),
          wash_time: $("#wash-time").val(),
          location: {
            door: $("#door").val(),
            street: $("#street").val(),
            sub_area: $("#sub_area").val(),
            main_area: $("#main_area").val(),
            pin: $("#pin").val()
          }
        });
        document.bookingForm.reset();
      } else {
        alert("Please fill at-lease name and mobile!");
      }
    } else {
      //inform user to login
    }
  });

  firebase.auth().onAuthStateChanged(function (user) {
    console.log("onAuthStateChanged");
    if (user) {
      console.log("namey", user.displayName);
      auth = user;
      $("body").removeClass("auth-false").addClass("auth-true");
      if (user.displayName) {
        document.getElementById("show-name").innerHTML = user.displayName;
      }
      bookingsRef.child(user.uid).on("child_added", onChildAdd);
    } else {
      // No user is signed in.
      $("body").removeClass("auth-true").addClass("auth-false");
      auth && bookingsRef.child(auth.uid).off("child_added", onChildAdd);
      $("#bookings").html("");
      auth = null;
    }
  });
});

function onChildAdd(snap) {
  $("#bookings").append(bookingHtmlFromObject(snap.key, snap.val()));
}

//prepare booking object's HTML
function bookingHtmlFromObject(key, booking) {
  return (
    '<div class="row col-md-12 justify-content-center">' +
    '<div class="card booking text-left mx-3 my-3" style="width: 90rem;" id="' +
    key +
    '">' +
    '<div class="card-body"  style="background: white;">' +
    '<h4 class="card-title">' +
    "Thank you for booking a car wash. Here are the details:" +
    "</h4>" +
    '<h5 class="card-title">' +
    "Name : " +
    booking.name +
    "</h5>" +
    '<h6 class="card-subtitle mb-2 text-muted">' +
    "Mobile : " +
    booking.mobile +
    "</h6>" +
    '<h6 class="card-subtitle mb-2 text-muted">' +
    "Wash Date : " +
    booking.wash_date +
    ", " +
    "Wash Time : " +
    booking.wash_time +
    "</h6>" +
    '<h4 class="card-title">' +
    "Our person will call you a day before to confirm" +
    "</h4>" +
    // '<p class="card-text" title="' +
    // booking.location.door +
    // '">' +
    // booking.location.street +
    // ", " +
    // booking.location.sub_area +
    // ", " +
    // booking.location.main_area +
    // ", " +
    // booking.location.pin +
    // ", " +
    // booking.location.city +
    // ", " +
    // booking.location.state +
    // "</p>" +
    // + '<a href="#" class="card-link">Card link</a>'
    // + '<a href="#" class="card-link">Another link</a>'
    "</div>" +
    "</div>" +
    "</div>"
  );
}

function spanText(textStr, textClasses) {
  var classNames = textClasses.map(c => "text-" + c).join(" ");
  return '<span class="' + classNames + '">' + textStr + "</span>";
}

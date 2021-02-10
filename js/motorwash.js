$(document).ready(function () {
  var firebaseConfig = {
    apiKey: 'AIzaSyCT5Ecw3QINV0SU7mH2zJ8j2FC_-n_pV8s',
    authDomain: 'motorwash-8e684.firebaseapp.com',
    projectId: 'motorwash-8e684',
    storageBucket: 'motorwash-8e684.appspot.com',
    messagingSenderId: '408982107627',
    appId: '1:408982107627:web:8e463163cc988d970fd5ae',
    measurementId: 'G-X9LC6PLBT9'
  }

  firebase.initializeApp(firebaseConfig)

  var Auth = firebase.auth()
  var dbRef = firebase.database()
  var bookingsRef = dbRef.ref('bookings')
  var usersRef = dbRef.ref('users')
  var auth = null

  //Register
  $('#registerForm').on('submit', function (e) {
    e.preventDefault()
    $('#registerModal').modal('hide')
    $('#messageModalLabel').html(
      spanText('<i class="fa fa-cog fa-spin"></i>', ['center', 'info'])
    )
    $('#messageModal').modal('show')
    var data = {
      email: $('#registerEmail').val(),
      firstName: $('#registerFirstName').val(),
      lastName: $('#registerLastName').val(),
      userType: 'customer'
    }
    var passwords = {
      password: $('#registerPassword').val(),
      cPassword: $('#registerConfirmPassword').val()
    }
    if (
      data.email != '' &&
      passwords.password != '' &&
      passwords.cPassword != ''
    ) {
      if (passwords.password == passwords.cPassword) {
        firebase
          .auth()
          .createUserWithEmailAndPassword(data.email, passwords.password)
          .then(function (user) {
            var user = firebase.auth().currentUser
            return user.updateProfile({
              displayName: data.firstName + ' ' + data.lastName
              // photoURL: "https://example.com/jane-q-user/profile.jpg"
            })
          })
          .then(function (user) {
            var user = firebase.auth().currentUser
            auth = user
            usersRef
              .child(user.uid)
              .set(data)
              .then(function () {
                console.log('User Information Saved:', user.uid)
              })
            document.getElementById('show-name').innerHTML = user.displayName
            $('#messageModalLabel').html(
              spanText(
                'Success! ' + 'Thank you for registering ' + user.displayName,
                ['center', 'success']
              )
            )
          })
          .catch(function (error) {
            console.log('Error creating user:', error)
            $('#messageModalLabel').html(
              spanText('ERROR: ' + error.code, ['danger'])
            )
          })
      } else {
        $('#messageModalLabel').html(
          spanText("ERROR: Passwords didn't match", ['danger'])
        )
      }
    }
  })

  //Login
  $('#loginForm').on('submit', function (e) {
    e.preventDefault()
    $('#loginModal').modal('hide')
    $('#messageModalLabel').html(
      spanText('<i class="fa fa-cog fa-spin"></i>', ['center', 'info'])
    )
    $('#messageModal').modal('show')

    if ($('#loginEmail').val() != '' && $('#loginPassword').val() != '') {
      var data = {
        email: $('#loginEmail').val(),
        password: $('#loginPassword').val()
      }
      firebase
        .auth()
        .signInWithEmailAndPassword(data.email, data.password)
        .then(function (authData) {
          console.log('li ad', authData)
          auth = authData
          console.log('userType:', auth.userType)
          console.log('uty', usersRef.child(auth.user.uid))
          $('#messageModalLabel').html(
            spanText(
              'Login Success!' + ' ' + 'Welcome back ' + auth.user.displayName,
              ['center', 'success']
            )
          )
        })
        .catch(function (error) {
          console.log('Login Failed!', error)
          $('#messageModalLabel').html(
            spanText('ERROR: ' + error.code, ['danger'])
          )
        })
    }
  })

  // Logout
  $('#logout').on('click', function (e) {
    e.preventDefault()
    firebase.auth().signOut()
  })

  //save booking
  $('#bookingForm').on('submit', function (event) {
    event.preventDefault()
    $('#addBookingModal').modal('hide')
    if (auth != null) {
      if ($('#name').val() != '' || $('#mobile').val() != '') {
        bookingsRef.child(auth.uid).push({
          name: $('#name').val(),
          mobile: $('#mobile').val(),
          wash_date: $('#wash-date').val(),
          wash_time: $('#wash-time').val(),
          location: {
            door: $('#door').val(),
            street: $('#street').val(),
            sub_area: $('#sub_area').val(),
            main_area: $('#main_area').val(),
            pin: $('#pin').val()
          }
        })
        document.bookingForm.reset()
      } else {
        alert('Please fill at-lease name and mobile!')
      }
    } else {
      //inform user to login
    }
  })

  // show bookings
  bookingsRef.on('child_added', function (snap) {
    console.log(snap.val())
    snap.forEach(function (childSnapshot) {
      var key = childSnapshot.key
      var childData = childSnapshot.val()
      console.log('cd', childData)
    })
  })

  firebase.auth().onAuthStateChanged(function (user) {
    console.log('onAuthStateChanged')
    // var cUType
    // console.log('ud', usersRef.child(user.uid))
    if (user) {
      getUserData(user.uid)
      // console.log('cUType', cUType)
      // usersRef.child(user.uid).on('child_added', onUserLogin)
      console.log('namey', user.displayName)
      auth = user
      console.log('authey', auth.displayName)
      console.log('n-a', user, auth)
      $('body').removeClass('auth-false').addClass('auth-true')
      // if (user.displayName) {
      // document.getElementById("show-name").innerHTML = "";
      document.getElementById('show-name').innerHTML = auth.displayName
      // }
      bookingsRef.child(user.uid).on('child_added', onChildAdd)
    } else {
      // No user is signed in.
      $('body').removeClass('auth-true').addClass('auth-false')
      auth && bookingsRef.child(auth.uid).off('child_added', onChildAdd)
      $('#bookings').html('')
      auth = null
    }
  })
})

var feedback = document.querySelector('.feedback')
function onChildAdd(snap) {
  $('#bookings').append(bookingHtmlFromObject(snap.key, snap.val()))
  // if (city.length === 0) {
  showFeedback('We have booked your Car Wash')
  // }
}
var curUserType
function getUserData(uid) {
  firebase
    .database()
    .ref('users/' + uid)
    .once('value', snap => {
      curUserType = snap.val().userType
      console.log('cut', curUserType)

      return curUserType
    })

  console.log('c', curUserType)
  if (curUserType === 'customer') console.log('You are  a customer')
}
// if (curUserType != 'customer') {
//   // showAllBookings()
//   bookingsRef.on('child_added', function (snap) {
//     console.log(snap.val())

//     snap.forEach(function (childSnapshot) {
//       var key = childSnapshot.key
//       var childData = childSnapshot.val()
//       console.log('cd', childData)
//     })
//   })
// }

// function showAllBookings() {
//   bookingsRef.on('child_added', function (snap) {
//     console.log(snap.val())

//     snap.forEach(function (childSnapshot) {
//       var key = childSnapshot.key
//       var childData = childSnapshot.val()
//       console.log('cd', childData)
//     })
//   })
// }

//prepare booking object's HTML
function bookingHtmlFromObject(key, booking) {
  return (
    // '<div class="row col-md-12 justify-content-center">' +
    '<div class="card booking text-left" style="width: 90rem; height= 10rem" id="' +
    key +
    '">' +
    '<div class="card-body"  style="background: white;">' +
    // '<h4 class="card-title">' +
    // 'Thank you for booking a car wash. Here are the details:' +
    // '</h4>' +
    '<h5 class="card-title" style="color: green">' +
    'Your Booking Details ' +
    '</h5>' +
    '<h5 class="card-title">' +
    'Name : ' +
    booking.name +
    '</h5>' +
    '<h6 class="card-subtitle  text-muted">' +
    'Mobile : ' +
    booking.mobile +
    '</h6>' +
    '<h6 class="card-subtitle mb-2 text-muted">' +
    'Wash Date : ' +
    booking.wash_date +
    ', ' +
    'Wash Time : ' +
    booking.wash_time +
    '</h6>' +
    '<h4 class="card-title">' +
    // 'Our person will call you a day before to confirm' +
    '</h4>' +
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
    // '</div>' +
    '</div>' +
    '</div>'
  )
}

function spanText(textStr, textClasses) {
  var classNames = textClasses.map(c => 'text-' + c).join(' ')
  return '<span class="' + classNames + '">' + textStr + '</span>'
}

function showFeedback(text) {
  feedback.classList.add('showItem')
  feedback.innerHTML = `<p>${text}</p>`

  setTimeout(() => {
    feedback.classList.remove('showItem')
  }, 3000)
}

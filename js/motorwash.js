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

  //booking date validation
  function date_validation() {
    console.log('date validation here')
    if (wash - date <= date()) wdate = false
  }

  // Logout
  $('#logout').on('click', function (e) {
    e.preventDefault()
    firebase.auth().signOut()
  })

  //save booking
  $('#bookingForm').on('submit', function (event) {
    event.preventDefault()
    // if (new Date() > $('#wash-date').val()) return false
    // if ($('#wash-date').val() <= new Date()) alert('Enter a future date')
    $('#addBookingModal').modal('hide')
    if (auth != null && new Date() < $('#wash-date').val()) {
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
      alert('Please enter a date greater than today')
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
    if (user) {
      getUserData(user.uid)
      auth = user
      $('body').removeClass('auth-false').addClass('auth-true')
      document.getElementById('show-name').innerHTML = auth.displayName
      bookingsRef.child(user.uid).on('child_added', onChildAdd)
    } else {
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
  showFeedback('We have booked your Car Wash')
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

//prepare booking object's HTML
function bookingHtmlFromObject(key, booking) {
  return (
    '<div class="card booking text-left" style="width: 90rem; height= 10rem" id="' +
    key +
    '">' +
    '<div class="card-body"  style="background: white;">' +
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
    '</h4>' +
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

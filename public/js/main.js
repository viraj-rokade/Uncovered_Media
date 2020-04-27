
function cnf_pass_check()
{
  document.getElementById('reg_btn').disabled = true;
  document.getElementById('reg_btn').classList.add('disabled');
    let password = document.getElementById("password").value;
    let confirm_password = document.getElementById("confirm_password").value;

    if(password!=confirm_password) {
        document.getElementById("err_msg").innerHTML="Passwords Don't Match";      
    } 
    else
    {
        document.getElementById("err_msg").innerHTML="";
        document.getElementById('reg_btn').disabled = false;
        document.getElementById('reg_btn').classList.remove('disabled');
    }
}

function getLocation() {
  if (navigator.geolocation) 
  {
    navigator.geolocation.getCurrentPosition(showPosition);
  } 
  else 
  {
    document.getElementById("msg").innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
    document.getElementById("latitude").value=position.coords.latitude;
    document.getElementById("longitude").value=position.coords.longitude;
    document.getElementById("msg").innerHTML = "Current Location Stored";
}



$('.form').find('input, textarea').on('keyup blur focus', function (e) {
  
    var $this = $(this),
        label = $this.prev('label');
  
        if (e.type === 'keyup') {
              if ($this.val() === '') {
            label.removeClass('active highlight');
          } else {
            label.addClass('active highlight');
          }
      } else if (e.type === 'blur') {
          if( $this.val() === '' ) {
              label.removeClass('active highlight'); 
              } else {
              label.removeClass('highlight');   
              }   
      } else if (e.type === 'focus') {
        
        if( $this.val() === '' ) {
              label.removeClass('highlight'); 
              } 
        else if( $this.val() !== '' ) {
              label.addClass('highlight');
              }
      }
  
});
  
  $('.tab a').on('click', function (e) {
    
    e.preventDefault();
    
    $(this).parent().addClass('active');
    $(this).parent().siblings().removeClass('active');
    
    target = $(this).attr('href');
  
    $('.tab-content > div').not(target).hide();
    
    $(target).fadeIn(600);
    
});

function locatorButtonPressed() {

    navigator.geolocation.getCurrentPosition(function (position) {           
            getUserAddressBy(position.coords.latitude, position.coords.longitude)
        },
        function (error) {
            locatorSection.classList.remove("loading")
            alert("The Locator was denied :( Please add your address manually")
        })
}
function getUserAddressBy(lat, long) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var address = JSON.parse(this.responseText)
            setAddressToInputField(address.results[0].formatted_address)
        }
    };
    xhttp.open("GET", "https://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+long+"&key=AIzaSyCf2jnt53nvDSmTshnibDoYnmF6Z0st72Y", true);
    xhttp.send();
}

function setAddressToInputField(address) { 
var input = document.getElementById("autocomplete");
    input.value = address
}
var defaultBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(40.750284799999996, -74.0179968),
);
var options = {
    bounds: defaultBounds
};

$("#cmnt_form").submit(function(event){
  event.preventDefault(); //prevent default action 
  var post_url = $(this).attr("action"); //get form action url
  var request_method = $(this).attr("method"); //get form GET/POST method
  var form_data = $(this).serialize(); //Encode form elements for submission
  
  $.ajax({
    url : post_url,
    type: request_method,
    data : form_data
  }).done(function(response){ //
    location.reload();
  });
});


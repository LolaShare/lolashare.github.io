$("#contactForm").validator().on("submit", function (event) {
    if (event.isDefaultPrevented()) {
        // handle the invalid form...
        formError();
        submitMSG(false, "Did you fill in the form properly?");
    } else {
        // everything looks good!
        event.preventDefault();
        submitForm();
    }
});

$(".optInForm").on("submit", function (event) {
    var email = $(".optInEmail").val();
    optIn(email, '.confirmation');
    return false;
});

$(".optInForm2").on("submit", function (event) {
    var email = $(".optInEmail2").val();
    optIn(email, '.confirmation2');
    return false;
});

function hideOptIn (msg, which) {
  $('.optInForm').addClass('fadeOutUp');
  if (typeof msg === 'undefined') {
    msg = 'Thank you, we\'ll be in touch.';
  }
  $(which).html('<h2>' + msg + '</h2>');
}

function optIn (email, resultDiv) {
  // Initiate Variables With Form Content

  $.ajax({
      type: "POST",
      url: "https://hook.io/lolashare/signups",
      data: "email=" + email,
      success : function(rsp){
          console.log(rsp, typeof rsp)
          try  {
            rsp = JSON.parse(rsp)
          } catch (err) {
            rsp = {
              message: 'error occurred'
            }
          }
          if (typeof rsp === 'object') {
            if (rsp.statusCode == 201){
              if(rsp.body.error_count === 0) {
                hideOptIn(undefined, resultDiv);
              } else {
                hideOptIn(rsp.body.errors[0].message, resultDiv);
              }
            } else {
              hideOptIn('failure', resultDiv);
            }
          } else {
            hideOptIn('failure', resultDiv);
          }
      }
  });
}

function submitForm(){
    // Initiate Variables With Form Content
    var name = $("#name").val();
    var email = $("#email").val();
    var msg_subject = $("#msg_subject").val();
    var message = $("#message").val();

    $.ajax({
        type: "POST",
        url: "https://hook.io/lolashare/contact",
        data: "name=" + name + "&email=" + email + "&subject=" + msg_subject + "&comment=" + message,
        success : function(rsp){
            console.log(rsp, typeof rsp)
            try  {
              rsp = JSON.parse(rsp)
            } catch (err) {
              rsp = {
                message: 'error occurred'
              }
            }
            if (typeof rsp === 'object') {
              if (rsp.statusCode == 202){
                  formSuccess();
              } else {
                  formError();
                  submitMSG(false,'error in signup');
              }
            } else {
              formError();
              submitMSG(false,rsp.message);
            }
        }
    });
}

function formSuccess(){
    $("#contactForm")[0].reset();
    submitMSG(true, "Message Submitted!")
}

function formError(){
    $("#contactForm").removeClass().addClass('shake animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
        $(this).removeClass();
    });
}

function submitMSG(valid, msg){
    if(valid){
        var msgClasses = "h3 text-center tada animated text-success";
    } else {
        var msgClasses = "h3 text-center text-danger";
    }
    $("#msgSubmit").removeClass().addClass(msgClasses).text(msg);
}
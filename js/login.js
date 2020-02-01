(function() {
  $(function() {
    $(".login--container").removeClass("preload");
	this.timer = window.setTimeout(() => {
		return $(".login--container").toggleClass("login--active");
    }, 5000);
	
    $(".js-toggle-login").click(() => {
      window.clearTimeout(this.timer);
      $(".login--container").toggleClass("login--active");
      return $(".login--username-container input").focus();
	});
	
	return $(".login--login-submit").click(() => {
		var name = $('#txtName').val();
		var a1 = $('#a1').val();
		var b2 = $('#b2').val();
		var c3 = $('#c3').val();
		var d4 = $('#d4').val();
		if(d4 === "7" && c3 === "7" && b2 === "7" && a1 === "7")
		{
			console.log(true);
			$(location).attr('href', 'main.html');
		}
		else
		{
			console.log(false);
		}
	});
	
  });
 
 moveOnMax =function (field, nextFieldID) {
    if (field.value.length == 1) {
        document.getElementById(nextFieldID).focus();
    }
	};

}).call(this);

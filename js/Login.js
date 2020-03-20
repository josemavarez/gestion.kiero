function logUser() {
  let email = document.getElementById("InputEmail").value;
  let password = document.getElementById("InputPassword").value;
  const path_url = "index.html"
  let datos = JSON.stringify({ "email":email, "password":password});

  $.ajax({
    type: "POST",
    url: "http://localhost:3001/api/login",
    headers: {
      "Content-Type": "application/json"
    },
    data: datos
  }).always(function(data, textStatus, xhr) {
      alert(data.users.message)
      const token = data.users.token;
      if(data.users.message === "Your token"){
        window.localStorage.setItem('acces_token', token);
        window.location.href = path_url;
      }
  });

  if (email == "") {
    alert("ingrese un email valido sapohp");
  }
  console.log(email);
}

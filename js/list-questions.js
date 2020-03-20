//Acces control
if (window.localStorage.getItem("acces_token") === null) {
  window.location.href = "login.html";
}

//Close session
function logOut() {
  window.localStorage.removeItem("acces_token");
  window.location.href = "login.html";
}

//show data into rows
var objecto;
$.ajax({
  type: "GET",
  url: "http://localhost:3001/api/open_questions",
  success: function(data) {
    objecto = data.questions;
  },
  error: function(error) {
    console.log(error);
  }
}).then(function(data) {
  console.log(objecto);
  window.localStorage.setItem('questId', objecto.questionid);
  // $("#dataTable").dataTable('<tbody><tr><td>you scream</td><td>san francisscoo</td><td>San Francisco</td><td>59</td><td>2012/08/06</td><td>$137,500</td></tr></tbody>');
  const dataShow = objecto.map((item, i) => {
    console.log(item.name);
    return (data = [
      {
        id: item.userid,
        hr: {
          name: item.name,
          date: item.createdsince,
          link:
            "https://articulo.kiero.co/product-details/?id-" +
            item.productid +
            "-"
        },
        pregunta: [item.content, item.productid],
        defaultContent: "<button>Click!</button>"
       
      }
    ]);
  });

  dataShow.map((item, i) => {
    $("#dataTablNueva").DataTable({
      data: item,
      destroy: true,
      columns: [
        {
          data: "id"
        },
        {
          data: "hr.name"
        },
        {
          data: "pregunta.0"
        },
        {
          data: "pregunta.1"
        },
        {data: "hr.link",
        "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
            $(nTd).html("<a href='"+oData.hr.link+"'>"+oData.hr.link+"</a>");
        }
        },
        {
          data: "hr.date"
        },
        {
          defaultContent: '<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">Responder</button>'
        }
      ]
    });
  });
});

//Send andswer
function postAnswer() {
  console.log(window.localStorage.getItem('questId'))
  let datos = JSON.stringify({ "email":email, "password":password});
  console.log('funCa')
  $.ajax({
    type: "POST",
    url: "http://localhost:3001/api/login",
    headers: {
      "Content-Type": "application/json"
    },
    data: datos
  }).always(function(data, textStatus, xhr) {
      
      if(data.users.message === "Your token"){
        window.localStorage.setItem('acces_token', token);
        window.location.href = 'index.html';
      }
  });
}


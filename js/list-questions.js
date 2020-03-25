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
    return (
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
        defaultContent: `<button value=${item.questionid} id="btnAnswer" type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">Responder</button>`       
      }
    );
  });
  console.log(dataShow)
  let answ = JSON.stringify(dataShow);
  console.log(answ)
    $("#dataTablNueva").DataTable({
      data: dataShow,
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
          data: "defaultContent"
        }
      ]
    });
  });


  //datatable onclick

  var table = $('#dataTablNueva').DataTable();
 
  $('#example').on( 'click', 'tr', function () {
     console.log('clickeeeed' )
  } );

 


//Send andswer
window.onload = function() {
 
 prepareButton();

};

function prepareButton()
{ 
   document.getElementById('btnAnswer').onclick = function()
   {
       alert('you clicked me');
   }
}


function postAnswer() {
  console.log(window.localStorage.getItem('questId'))
  let txtAnsw = document.getElementById('txtAnswer').value;
  
  console.log(txtAnsw)
  let datos = JSON.stringify({ "answer":txtAnsw});
  console.log('funCa')
  $.ajax({
    type: "POST",
    url: "http://localhost:3001/api/create_answer/",
    headers: {
      "Content-Type": "application/json"
    },
    data: datos
  }).always(function(data, textStatus, xhr) {
      console.log(data)
      alert(data.message);
      
  });
}


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
  headers: {
    "access_token": window.localStorage.getItem("acces_token")
  },
  success: function(data) {    
    objecto = data.questions;
  },
  error: function(error) {
    console.log(error);
  }
}).then(function(data) {
  console.log(objecto)
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

// Generar Reporte

function generateReport() {
  $.ajax({
    type: "GET",
    url: "http://localhost:3001/api/report",
    headers: {
      "Content-Type": "application/json",
      "access_token": window.localStorage.getItem("acces_token")
    }
  }).always(function(data, textStatus, xhr) {
      console.log(data)
      JSONToCSVConvertor(data.data, "Reporte preguntas respondidas", true);
  });
}

function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
  //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
  var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
  console.log(arrData[0])
  var CSV = '';
  //Set Report title in first row or line

  CSV += ReportTitle + '\r\n\n';

  //This condition will generate the Label/Header
  if (ShowLabel) {
    var row = "";
    console.log("where")
    //This loop will extract the label from 1st index of on array
    for (var index in arrData[0]) {

      //Now convert each value to string and comma-seprated
      row += index + ',';
      console.log(row)
    }

    row = row.slice(0, -1);

    //append Label row with line break
    CSV += row + '\r\n';
  }

  //1st loop is to extract each row
  for (var i = 0; i < arrData.length; i++) {
    var row = "";

    //2nd loop will extract each column and convert it in string comma-seprated
    for (var index in arrData[i]) {
      row += '"' + arrData[i][index] + '",';
    }

    row.slice(0, row.length - 1);

    //add a line break after each row
    CSV += row + '\r\n';
  }

  if (CSV == '') {
    alert("Invalid data");
    return;
  }

  //Generate a file name
  var fileName = "MyReport_";
  //this will remove the blank-spaces from the title and replace it with an underscore
  fileName += ReportTitle.replace(/ /g, "_");

  //Initialize file format you want csv or xls
  var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

  // Now the little tricky part.
  // you can use either>> window.open(uri);
  // but this will not work in some browsers
  // or you will not get the correct file extension    

  //this trick will generate a temp <a /> tag
  var link = document.createElement("a");
  link.href = uri;

  //set the visibility hidden so it will not effect on your web-layout
  link.style = "visibility:hidden";
  link.download = fileName + ".csv";

  //this part will append the anchor tag and remove it after automatic click
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
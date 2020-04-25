$.getJSON("/articles", function (data) {
    for (var i = 0; i < data.length; i++) {
      $("#articles").append(
        `<card-body id='article' class='bg-primary rounded' data-id='${
          data[i]._id
        }'><h2 class= 'text-primary bg-white rounded'>${
          data[i].title
        }</h2><br><h5>${data[i].summary}</h5><br><p>${
          data[i].link
        }</p><br><br><button id='save' data-id='${
          data[i]._id
        }' class='btn btn-success float-right rounded'>${"Save Article"}</button>
        <button id='addNote' data-id='${
          data[i]._id
        }' class='btn btn-danger float-right rounded' data-toggle="modal" data-target="#notes">${"Notes"}</button><br>
        </card-body>`
      );
    }
});


var $scrapeBtn = $("#scrape");

function scrapeArticles() {
  return $.ajax({
    url: "/scrape",
    method: "GET",
  })
}

$scrapeBtn.on("click", function () {
  scrapeArticles();
  $("#articles").empty();
 $.getJSON("/articles", function (data) {
    for (var i = 0; i < data.length; i++) {
      $("#articles").append(
        `<card-body id='article' class='bg-primary rounded' data-id='${
          data[i]._id
        }'><h2 class= 'text-primary bg-white rounded'>${
          data[i].title
        }</h2><br><h5>${data[i].summary}</h5><br><p>${
          data[i].link
        }</p><br><br><button id='save' data-id='${
          data[i]._id
        }' class='btn btn-success float-right rounded'>${"Save Article"}</button><button id='addNote' data-id='${
          data[i]._id
        }' class='btn btn-danger float-right rounded'data-toggle="modal" data-target="#notes">${"Notes"}</button><br></card-body>`
      );
    }
});
});

$("#clear").on("click", function () {
  $("#articles").empty();
})

$("#clear2").on("click", function () {
  $("#savedArticles").empty();
})

function saveArticles(id) {
  $.ajax({
    method: "GET",
    url: `/articles/${id}`,
  })
}



/*$(document).on("click", "#save", function () {
  console.log("saved article");
  var thisId = $(this).attr("data-id");
  console.log(thisId);
  saveArticles(thisId);
$.ajax({
    url: '/savedArticles/' + thisId,
  method: "POST",
  data: {
      
    }
  })*/

$(document).on("click", "#save", function () {
  saveArticles();
  console.log("saved article");
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "POST",
    url: "/savedArticles/" + thisId,
  })
    .then(function (data) {
      console.log(data);
      $("#savedArticles").append(`<card-body id='article' class='bg-primary' data-id='${data._id}'>${
        data.title
        }<br />${data.link}<br />${
        data.summary
        }</card-body>`
      );
    });
    });



$(document).on("click", "#addNote", function () {
  $("#notes").empty();
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId,
  })
    .then(function (data) {
      console.log(data);
      $("#notes").append("<h2 class='modal-title'>" + data.title + "</h2><br>");
      $("#notes").append("<input id='titleinput' placeholder='Note Title' name='title'><br>");
      $("#notes").append("<textarea id='bodyinput' placeholder='Note Text' name='body'></textarea><br>");
      $("#notes").append(
        "<button class='btn-success rounded' data-id='" + data._id + "' id='savenote' data-dismiss='modal'>Save Note</button>"
      )
      $("#notes").append(
        "<button class= 'btn-danger rounded' data-id='" + data._id + "' id='deletenote'>DeleteNote</button>"
      )
      $("#notes").append("<button type='button' class='btn btn-secondary' id='close' data-dismiss='modal'>Close</button>"
      );

      if (data.note) {
        $("#titleinput").val(data.note.title);
        $("#bodyinput").val(data.note.body);
      }
    });
});

$(document).on("click", "#savenote", function () {
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val(),
    },
  })
    .then(function (data) {
      console.log(data);
      $("#notes").empty();
      $(".modal fade").empty();
    });

  $("#titleinput").val("");
  $("#bodyinput").val("");
});




$(document).on("click", "#deletenote", function () {
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "DELETE",
    url: "/articles/" + thisId,
  }).then(function (data) {
    console.log("note deleted" + data);
    $("#notes").empty();
  });

  $("#titleinput").val("");
  $("#bodyinput").val("");
});
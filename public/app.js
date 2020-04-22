$.getJSON("/articles", function (data) {
    for (var i = 0; i < data.length; i++) {
      $("#articles").append(
        `<card-body id='article' class=bg-primary data-id='${data[i]._id}'>${
          data[i].title
        }<br />${data[i].link}<br />${
          data[i].summary
        }<br><br><button id='save' data-id='${
          data[i]._id
        }' class='saveArticle btn btn-success float-right'>${"Save Article"}</button><br></card-body>`
      );
    }
});


var $scrapeBtn = $("#scrape");

function scrapeArticles() {
  return $.ajax({
    url: "/scrape",
    type: "GET",
  })
}

$scrapeBtn.on("click", function () {
  scrapeArticles();
  $("#articles").empty();
 $.getJSON("/articles", function (data) {
    for (var i = 0; i < data.length; i++) {
      $("#articles").append(
        `<card-body id='article' class='bg-primary' data-id='${data[i]._id}'>${
          data[i].title
        }<br />${data[i].link}<br />${
          data[i].summary
        }<br><button id='save' data-id='${
          data[i]._id
        }' class='saveArticle btn btn-success float-right'>${"Save Article"}</button><br><br></card-body>`
      );
    }
});
});

$("#clear").on("click", function () {
  $("#articles").empty();
})


function saveArticles(id) {
  return $.ajax({
    url: `/savedArticles/${id}`,
    method: "POST",
  })
}

$(document).on("click", "#save", function () {
  console.log("saved article");
  var thisId = $(this).attr("data-id");
  console.log(thisId);
  saveArticles(thisId);
})
  

function deleteNote() {
 return $.ajax({
      url: "api/notes/" + id,
      type: "DELETE"
    });
}


$(document).on("click", "card-body", function () {
  $("#notes").empty();
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId,
  })
    .then(function (data) {
      console.log(data);
      $("#notes").append("<h2>" + data.title + "</h2>");
      $("#notes").append("<input id='titleinput' name='title' >");
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      $("#notes").append(
        "<button data-id='" + data._id + "' id='savenote'>Save Note</button>"
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
    });

  $("#titleinput").val("");
  $("#bodyinput").val("");
});

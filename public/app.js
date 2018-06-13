$.getJSON("/articles", function(data){
    for(var i = 0; i < data.length; i++) {
        $("#articles-list").append("<li class='eachArticle' data-id='" + data[i]._id + "'>" +"<strong>"+ data[i].title +"</strong>" + "<br />" + data[i].link + "</li>");
    }
});

$(document).on("click", "li", function() {
    $("#notes").empty();
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "GET",
        url:"/articles/" +thisId
    })

    .done(function(data){
        console.log(data);
        //Title
        $("#notes").append("<h2" + data.title + "</h2>");
        //Input for new Title
        $("#notes").append("<input id='titleinput' name = 'title'>" );
        //textarea for notes
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
          // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      //If there is a note
      if(data.note) {
          //place title and of note in input and body in textarea
          $("#titleinput").val(data.note.title);
          $("#bodyinput").val(data.not.body);
      }
    })
});

//After saving note
$(document).on("click", "#savenote", function(){
    var thisId =$(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            //value taken from title input
            title: $("#titleinput").val(),
            //value from textarea
            body: $("#bodyinput").val()
        }
    })
    .done(function(data){
        //log response
        console.log(data);
        //empty notes section
        $("#notes").empty();
    });

      // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});



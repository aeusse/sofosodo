

function editItem(path, title){
    console.log(path)
    console.log(title)
    $("#tree_container").hide();
    $("#item_edition_title").show();
    $("#item_edition_body").show();

    $("#item_edition_title").html(title);
}

editItem([1, 0, 1], "El título _1 0 1")
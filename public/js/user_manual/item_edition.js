const storageService = firebase.storage();
const storageRef = storageService.ref();

function editItem(path) {
    //console.log(path)

    let o = tree;
    for (let i = 0; i < path.length - 1; i++) {
        let n = path[i];
        o = o[n].children;
    }
    const closerParentIdx = path[path.length - 1];
    const targetObject = o[closerParentIdx];

    $("#tree_container").hide();
    $("#item_edition_title").show();
    $("#item_edition_body").show();

    $("#item_edition_title").html(targetObject.title);

    console.log(targetObject.data)
}

//editItem([1, 0, 1], "El título _1 0 1");



function handleFileUploadSubmit(e) {
    const targetIdx = $(e.target).data().idx;
    const selectedFile = $(`#file-select_${targetIdx}`)[0].files[0]
    const uploadRef = storageRef.child(`images/${selectedFile.name}`);
    const uploadTask = uploadRef.put(selectedFile); //create a child directory called images, and place the file inside this directory
    uploadTask.on('state_changed', (snapshot) => {
        // Observe state change events such as progress, pause, and resume
    }, (error) => {
        // Handle unsuccessful uploads
        console.log(error);
    }, async () => {
        // Do something once upload is complete
        console.log('success');
        const uploadedImageUrl = await uploadRef.getDownloadURL();
        $(`#content_${targetIdx} div.uploadedImageDivs`).empty();
        $(`#content_${targetIdx} div.uploadedImageDivs`).prepend(`<img src="${uploadedImageUrl}" />`);
        $(`#content_${targetIdx} div.uploadedImageDivs`).data("img_url", uploadedImageUrl);
    });
}

function addParagraph(idx) {
    const innerHtml = `<input id="where_to_show_checkbox_${idx}" type="checkbox" name="where_to_show" value="final"><label class="where_to_show_checks"> Usuario final</label><br>
      <textarea id="textarea_${idx}"></textarea>
      <br>
      <br>
      <button class="add_text_or_image_buttons" onclick="addParagraph(${idx + 1});">Texto</button>
      <button class="add_text_or_image_buttons" onclick="addImage(${idx + 1});">Imagen</button>`;
    if ($(`#content_${idx}`).length === 0) {
        const html = `<div id="content_${idx}" class="contents" data-idx="${idx}" data-type="text">` + innerHtml + `</div>`;
        $("#developer_edition_zone").append(html);
    } else {
        $(`#content_${idx}`).empty();
        $(`#content_${idx}`).html(innerHtml);
        $(`#content_${idx}`).data("type", "text");
    }
}
function addImage(idx) {
    const innerHtml = `<input id="where_to_show_checkbox_${idx}" type="checkbox" name="where_to_show" value="final"><label class="where_to_show_checks"> Usuario final</label><br>
      <div class="uploadedImageDivs"></div>
      <input id="file-select_${idx}" type="file" class="add_text_or_image_buttons" accept="image/*" />
      <button id="file-submit_${idx}" data-idx="${idx}" class="add_text_or_image_buttons">Subir</button>
      <br>
      <br>
      <button class="add_text_or_image_buttons" onclick="addParagraph(${idx + 1});">Texto</button>
      <button class="add_text_or_image_buttons" onclick="addImage(${idx + 1});">Imagen</button>`;
    if ($(`#content_${idx}`).length === 0) {
        const html = `<div id="content_${idx}" class="contents" data-idx="${idx}" data-type="image">` + innerHtml + `</div>`;
        $("#developer_edition_zone").append(html);
    } else {
        $(`#content_${idx}`).empty();
        $(`#content_${idx}`).html(innerHtml);
        $(`#content_${idx}`).data("type", "image");
    }
    $(document).on('click', `#file-submit_${idx}`, handleFileUploadSubmit);
}

function saveToLocalStorage(path){
    const elements = $(".contents");
    const data = {}
    for (let i of elements){
        const dataIdx = $(i).data().idx;
        data[dataIdx] = {type: $(i).data().type}
        if (data[dataIdx].type === "image"){
            data[dataIdx].url = $(`#content_${dataIdx} div.uploadedImageDivs`).data().img_url
            if (data[dataIdx].url === undefined){
                data[dataIdx].url = "";
            }
        }else{
            data[dataIdx].text = $(`#textarea_${dataIdx}`).val();
        }
        if($(`#where_to_show_checkbox_${dataIdx}`).is(':checked')) {
            data[dataIdx].finalUser = true;
        }else{
            data[dataIdx].finalUser = false;
        }
    }

    let o = tree;
    for (let i = 0; i < path.length - 1; i++) {
        let n = path[i];
        o = o[n].children;
    }
    const closerParentIdx = path[path.length - 1];
    const target = o[closerParentIdx];

    target.data = data;
    localStorage.setItem(tree, JSON.stringify(tree));
}

//saveToLocalStorage([3, 1, 2])
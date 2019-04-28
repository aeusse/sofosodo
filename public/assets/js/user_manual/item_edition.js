const storageService = firebase.storage();
const storageRef = storageService.ref();

const initialFields = {};
let modifiedData = {};

function editItem(path) {
    $('#final_user_viewer').empty();
    $('.contents').remove();

    let fullPathTitleText = "";
    let o = tree;
    for (let i = 0; i < path.length - 1; i++) {
        let n = path[i];
        fullPathTitleText += o[n].title + "&nbsp;&nbsp;&nbsp;->&nbsp;&nbsp;&nbsp;";
        o = o[n].children;
    }
    const closerParentIdx = path[path.length - 1];
    const targetObject = o[closerParentIdx];

    for (let idx in targetObject.data){
        const field = targetObject.data[idx];
        initialFields[idx] = field;
        if (field.type === "text"){
            addParagraph(parseInt(idx));
        }else{
            addImage(parseInt(idx));
        }
    }
    $("#tree_container").hide();
    $("#item_edition_title").show();
    $("#item_edition_body").show();
    $("#item_edition_title").html(fullPathTitleText + "<b>" + targetObject.title + "</b>");
    $('#item_edition_title').off('click');
    $("#item_edition_title").click( function(){
        saveToLocalStorage(path);
    })

}

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
        refreshEnteredData();
    });
}

function refreshBlurListeners(){
    console.log("refreshBlurListeners")
    $(".blur_trigger").unbind("blur");
    $(".blur_trigger").blur(function() {
        refreshEnteredData();
    });
    refreshEnteredData();
}
function addParagraph(idx) {
    const innerHtml = `<input id="where_to_show_checkbox_${idx}" type="checkbox" name="where_to_show" value="final" onclick="refreshEnteredData();"><label class="where_to_show_checks"> Usuario final</label><br>
      <textarea id="textarea_${idx}" class="blur_trigger"></textarea>
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
    if (initialFields[idx] && initialFields[idx].type === "text"){
        $(`#textarea_${idx}`).val(initialFields[idx].text)
        if (initialFields[idx].finalUser === true){
            $(`#where_to_show_checkbox_${idx}`).prop('checked', true);
        }
    }
    refreshBlurListeners();
}
function addImage(idx) {
    const innerHtml = `<input id="where_to_show_checkbox_${idx}" type="checkbox" name="where_to_show" value="final" onclick="refreshEnteredData();"><label class="where_to_show_checks"> Usuario final</label><br>
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
    if (initialFields[idx] && initialFields[idx].type === "image"){
        $(`#content_${idx} div.uploadedImageDivs`).empty();
        $(`#content_${idx} div.uploadedImageDivs`).prepend(`<img src="${initialFields[idx].url}" />`);
        $(`#content_${idx} div.uploadedImageDivs`).data("img_url", initialFields[idx].url);
        if (initialFields[idx].finalUser === true){
            $(`#where_to_show_checkbox_${idx}`).prop('checked', true);
        }
    }
    refreshEnteredData();
}

function refreshEnteredData(){
    console.log("refreshEnteredData")
    let finalViewHtml = "";
    const elements = $(".contents");
    modifiedData = {};
    for (let i of elements){
        const dataIdx = $(i).data().idx;
        modifiedData[dataIdx] = {type: $(i).data().type}
        if($(`#where_to_show_checkbox_${dataIdx}`).is(':checked')) {
            modifiedData[dataIdx].finalUser = true;
        }else{
            modifiedData[dataIdx].finalUser = false;
        }
        if (modifiedData[dataIdx].type === "image"){
            modifiedData[dataIdx].url = $(`#content_${dataIdx} div.uploadedImageDivs`).data().img_url
            if (modifiedData[dataIdx].url === undefined){
                modifiedData[dataIdx].url = "";
            }
            if (modifiedData[dataIdx].finalUser){
                finalViewHtml += `<div class="uploadedImageDivs"><img src="${modifiedData[dataIdx].url}" /></div><br>`;
            }
        }else{
            modifiedData[dataIdx].text = $(`#textarea_${dataIdx}`).val();
            if (modifiedData[dataIdx].finalUser){
                finalViewHtml += `<div class="finalViewParagraph"><p>${modifiedData[dataIdx].text}</p></div>`;
            }
        }
    }
    $('#final_user_viewer').html(finalViewHtml);
}

function saveToLocalStorage(path){
    refreshEnteredData();

    let o = tree;
    for (let i = 0; i < path.length - 1; i++) {
        let n = path[i];
        o = o[n].children;
    }
    const closerParentIdx = path[path.length - 1];
    const target = o[closerParentIdx];

    if ((target.data === undefined && JSON.stringify(modifiedData) !== "{}") || (target.data !== undefined && (JSON.stringify(target.data) !== JSON.stringify(modifiedData)))){
        target.data = modifiedData;
        localStorage.setItem("tree", JSON.stringify(tree));
        localStorage.setItem("need_to_save", "true");
    }

    $("#item_edition_title").hide();
    $("#item_edition_body").hide();
    $("#tree_container").show();
}
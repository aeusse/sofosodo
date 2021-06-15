const storageService = firebase.storage();
const storageRef = storageService.ref();

let modifiedData = {};
let currentPath = []

function editItem(path) {
    currentPath = path
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
        const initialField = targetObject.data[idx];
        if (initialField.type === "text"){
            addParagraph(parseInt(idx), initialField);
        }else{
            addImage(parseInt(idx), initialField);
        }
    }
    $("#tree_container").hide();
    $("#item_edition_title").show();
    $("#item_edition_body").show();
    $("#item_edition_title").html(`${fullPathTitleText}
    <b>${targetObject.titleTranslations.spanish}</b>
    (${targetObject.titleTranslations.english}) (${targetObject.titleTranslations.portuguese})
    `);
    $("#item_edition_title").addClass("pointer")
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
        const uploadedImageUrl = await uploadRef.getDownloadURL();
        $(`#content_${targetIdx} div.uploadedImageDivs`).empty();
        $(`#content_${targetIdx} div.uploadedImageDivs`).prepend(`<img src="${uploadedImageUrl}" />`);
        $(`#content_${targetIdx} div.uploadedImageDivs`).data("img_url", uploadedImageUrl);
        refreshEnteredData();
    });
}

function refreshBlurListeners(){
    $(".blur_trigger").unbind("blur");
    $(".blur_trigger").blur(function() {
        refreshEnteredData();
    });
    refreshEnteredData();
}
function addParagraph(idx, initialField) {
    const innerHtml = `<div class="container-fluid">
        <div class="row">
          <div class="col-3">
            <input id="where_to_show_checkbox_${idx}" type="checkbox" name="where_to_show" value="final" onclick="refreshEnteredData();" checked>
            <label class="where_to_show_checks"> Usuario final</label>
          </div>
          <div class="col-4">
            <select id="language_select_${idx}" class="language_selects blur_trigger custom-select">
              <option value="spanish">Español</option>
              <option value="english">Inglés</option>
              <option value="portuguese">Portugués</option>
            </select>
          </div>
          <div class="col-2">
            <button class="btn btn-sm btn-danger" onclick="removeInnerItem(${idx});">Eliminar</button>
          </div>
          <div class="col-3">
            <i class="fas fa-caret-square-up fa-2x pointer" onclick="goUpInner(${idx})"></i>
            <i class="fas fa-caret-square-down fa-2x pointer" onclick="goDownInner(${idx})"></i>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <textarea class="form-control" id="textarea_${idx}" class="blur_trigger"></textarea>
          </div>
        </div>
        <br>
        <br>
        <div class="row">
          <div class="col-12">
            <button class="add_text_or_image_buttons btn btn-outline-dark" onclick="addParagraph(${idx + 1});">Texto</button>
            <button class="add_text_or_image_buttons btn btn-outline-dark" onclick="addImage(${idx + 1});">Imagen</button>
          </div>
        </div>
      </div>`;
    if ($(`#content_${idx}`).length === 0) {
        const html = `<div id="content_${idx}" class="contents" data-idx="${idx}" data-type="text">` + innerHtml + `</div>`;
        $("#developer_edition_zone").append(html);
    } else {
        $(`#content_${idx}`).empty();
        $(`#content_${idx}`).html(innerHtml);
        $(`#content_${idx}`).data("type", "text");
    }
    if (initialField && initialField.type === "text"){
        $(`#textarea_${idx}`).val(initialField.text)
        $(`#language_select_${idx}`).val(initialField.language)
        if (initialField.finalUser === false){
            $(`#where_to_show_checkbox_${idx}`).prop('checked', false);
        }
    }
    refreshBlurListeners();
}
function addImage(idx, initialField) {
    const innerHtml = `<div class="container-fluid">
        <div class="row">
          <div class="col-7">
            <input id="where_to_show_checkbox_${idx}" type="checkbox" name="where_to_show" value="final" onclick="refreshEnteredData();" checked>
            <label class="where_to_show_checks"> Usuario final</label>
          </div>
          <div class="col-2">
            <button class="btn btn-sm btn-danger" onclick="removeInnerItem(${idx});">Eliminar</button>
          </div>
          <div class="col-3">
            <i class="fas fa-caret-square-up fa-2x pointer" onclick="goUpInner(${idx})"></i>
            <i class="fas fa-caret-square-down fa-2x pointer" onclick="goDownInner(${idx})"></i>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <div class="uploadedImageDivs"></div>
          </div>
        </div>
        <div class="row input-group">
          <div class="custom-file">
            <input id="file-select_${idx}" type="file" class="custom-file-input" accept="image/*" />
            <label class="custom-file-label" for="file-select_${idx}">Escoge un archivo</label>
          </div>
          <div class="input-group-append">
            <button id="file-submit_${idx}" data-idx="${idx}" class="input-group-text add_text_or_image_buttons" type="button">Subir</button>
          </div>
        </div>
        <br>
        <br>
        <div class="row">
          <div class="col-12">
            <button class="add_text_or_image_buttons btn btn-outline-dark" onclick="addParagraph(${idx + 1});">Texto</button>
            <button class="add_text_or_image_buttons btn btn-outline-dark" onclick="addImage(${idx + 1});">Imagen</button>
          </div>
        </div>
      </div>
      <script>
          $('#file-select_${idx}').on('change',function(){
              var fileName = $(this).val();
              $(this).next('.custom-file-label').html(fileName);
          })
      </script>
      `;
    if ($(`#content_${idx}`).length === 0) {
        const html = `<div id="content_${idx}" class="contents" data-idx="${idx}" data-type="image">` + innerHtml + `</div>`;
        $("#developer_edition_zone").append(html);
    } else {
        $(`#content_${idx}`).empty();
        $(`#content_${idx}`).html(innerHtml);
        $(`#content_${idx}`).data("type", "image");
    }
    $(document).on('click', `#file-submit_${idx}`, handleFileUploadSubmit);
    if (initialField && initialField.type === "image"){
        $(`#content_${idx} div.uploadedImageDivs`).empty();
        $(`#content_${idx} div.uploadedImageDivs`).prepend(`<img src="${initialField.url}" />`);
        $(`#content_${idx} div.uploadedImageDivs`).data("img_url", initialField.url);
        if (initialField.finalUser === false){
            $(`#where_to_show_checkbox_${idx}`).prop('checked', false);
        }
    }
    refreshEnteredData();
}

function removeInnerItem(idx){
  if (window.confirm("¿Estás segur@ de que quieres eliminar este ítem?")) {
    refreshEnteredData()
    let modifiedDataArray = Object.values(modifiedData)
    modifiedDataArray.splice(idx, 1)
    modifiedData = Object.fromEntries(modifiedDataArray.entries())
    updateTree(currentPath)
    editItem(currentPath)
  }
}

function goUpInner(idx){
  if (idx === 0 ) {
    return
  }
  let topPosition = modifiedData[idx - 1]
  let currentPos = modifiedData[idx]
  modifiedData[idx - 1] = currentPos
  modifiedData[idx] = topPosition
  updateTree(currentPath)
  editItem(currentPath)
}

function goDownInner(idx){
  if (idx === Object.keys(modifiedData).length - 1) {
    return
  }
  let downPosition = modifiedData[idx + 1]
  let currentPos = modifiedData[idx]
  modifiedData[idx + 1] = currentPos
  modifiedData[idx] = downPosition
  updateTree(currentPath)
  editItem(currentPath)
}

function refreshEnteredData(){
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
            modifiedData[dataIdx].language = $(`#language_select_${dataIdx}`).val();
            if (modifiedData[dataIdx].finalUser){
                finalViewHtml += `<div class="finalViewParagraph"><font size="2px">(${modifiedData[dataIdx].language})</font><p>${modifiedData[dataIdx].text}</p></div>`;
            }
        }
    }
    $('#final_user_viewer').html(finalViewHtml);
}

function saveToLocalStorage(path){
  refreshEnteredData();
  updateTree(path)
  $("#item_edition_title").hide();
  $("#item_edition_body").hide();
  $("#tree_container").show();
}

function updateTree(path){
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
}
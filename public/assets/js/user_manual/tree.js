
const manualName = localStorage.getItem("manual_name");
const manualId = localStorage.getItem("manual_id");

// Firebase
const firestore = firebase.firestore();
firebase.functions()._url = function (name) {
    return `/funcs/${name}`;
}

function titleInputs(currentTitles) {
    let titleTxt;
    if (currentTitles && currentTitles.spanish) {
        titleTxt = prompt("Por favor escriba el título", currentTitles.spanish);
    } else {
        titleTxt = prompt("Por favor escriba el título");
    }
    if (titleTxt === undefined || titleTxt === null || titleTxt === "") {
        return {
            success: false
        }
    }
    let englishTitle = "";
    let englishTitleTxt;
    if (currentTitles && currentTitles.english) {
        englishTitleTxt = prompt("Si tiene traducción al inglés, escríbala", currentTitles.english);
    } else {
        englishTitleTxt = prompt("Si tiene traducción al inglés, escríbala");
    }
    if (englishTitleTxt !== undefined && englishTitleTxt !== null) {
        englishTitle = englishTitleTxt;
    }
    let portugueseTitle = "";

    let portugueseTitleTxt;
    if (currentTitles && currentTitles.portuguese) {
        portugueseTitleTxt = prompt("Lo mismo con el portugués", currentTitles.portuguese);
    } else {
        portugueseTitleTxt = prompt("Lo mismo con el portugués");
    }
    if (portugueseTitleTxt !== undefined && portugueseTitleTxt !== null) {
        portugueseTitle = portugueseTitleTxt;
    }
    return {
        success: true,
        txts: {
            spanish: titleTxt,
            english: englishTitle,
            portuguese: portugueseTitle
        }
    }
}

let curRootLi = -1;
function appendItem() {
    const titles = titleInputs();
    if (titles.success === false) {
        return
    }
    curRootLi += 1;
    tree[curRootLi] = {
        title: titles.txts.spanish,
        titleTranslations: titles.txts,
        children: []
    }
    $("#root_ul").append(`<li>
        <span id="li_title_${curRootLi}" class="font-weight-bold pointer" onclick="editItem([${curRootLi}]);">${curRootLi + 1} &nbsp;&nbsp; ${titles.txts.spanish}</span>
        <button class="btn btn-outline-dark liButtons" onclick="editTitle([${curRootLi}]);">Editar título</button>
        <button class="btn btn-outline-danger liButtons" onclick="removeOuterItem([${curRootLi}])">Eliminar ítem</button>
        <button class="btn btn-outline-dark liButtons" onclick="appendSubItem([${curRootLi}]);">Agregar subitem</button>
        <i class="far fa-caret-square-up fa-lg pointer mx-2" onclick="goUpOuter([${curRootLi}])"></i>
        <i class="far fa-caret-square-down fa-lg pointer" onclick="goDownOuter([${curRootLi}])"></i>
        <ul id="sub_ul_${curRootLi}"></ul>
    </li>`);
    localStorage.setItem("tree", JSON.stringify(tree));
    localStorage.setItem("need_to_save", "true");
}

function appendSubItem(parentPath) {
    const titles = titleInputs();
    if (titles.success === false) {
        return
    }
    let o = tree;
    let parentSubUlIdPath = "";
    for (let i = 0; i < parentPath.length - 1; i++) {
        let n = parentPath[i];
        o = o[n].children;
        parentSubUlIdPath += "_" + n;
    }
    const closerParentIdx = parentPath[parentPath.length - 1];
    const curSubLiIdx = o[closerParentIdx].children.length;
    parentSubUlIdPath += "_" + closerParentIdx;

    o[closerParentIdx].children.push({
        title: titles.txts.spanish,
        titleTranslations: titles.txts,
        children: []
    })
    const nextPath = parentPath.concat(curSubLiIdx);
    const nextSubUlIdPath = parentSubUlIdPath + "_" + curSubLiIdx;

    let parentPathText = "";
    for (let i of nextPath) {
        parentPathText += (parseInt(i) + 1) + ".";
    }
    $("#sub_ul" + parentSubUlIdPath).append(`<li>
        <span id="li_title${nextSubUlIdPath}" class="pointer" onclick="editItem([${nextPath}]);">${parentPathText.slice(0, -1)} &nbsp;&nbsp; ${titles.txts.spanish}</span>
        <button class="btn btn-outline-dark liButtons" onclick="editTitle([${nextPath}]);">Editar título</button>
        <button class="btn btn-outline-danger liButtons" onclick="removeOuterItem([${nextPath}])">Eliminar ítem</button>
        <button class="btn btn-outline-dark liButtons" onclick="appendSubItem([${nextPath}]);">Agregar subitem</button>
        <i class="far fa-caret-square-up fa-lg pointer mx-2" onclick="goUpOuter([${nextPath}])"></i>
        <i class="far fa-caret-square-down fa-lg pointer" onclick="goDownOuter([${nextPath}])"></i>
        <ul id="sub_ul${nextSubUlIdPath}"></ul>
    </li>`);
    localStorage.setItem("tree", JSON.stringify(tree));
    localStorage.setItem("need_to_save", "true");
}

function editTitle(path) {
    let o = tree;
    let parentPathText = "";
    let parentPathIdSufix = "";
    for (let i = 0; i < path.length - 1; i++) {
        let n = path[i];
        o = o[n].children;
        parentPathIdSufix += n + "_";
        parentPathText += (parseInt(n) + 1) + ".";
    }
    parentPathText += (parseInt(path[path.length - 1]) + 1);
    parentPathIdSufix += path[path.length - 1];
    const target = path[path.length - 1];
    const titles = titleInputs(o[target].titleTranslations);
    if (titles.success === false) {
        return
    }
    $("#li_title_" + parentPathIdSufix).html(parentPathText + " &nbsp;&nbsp; " + titles.txts.spanish)
    o[target].title = titles.txts.spanish
    o[target].titleTranslations = titles.txts
}

function removeOuterItem(path) {
    const msg = "Se eliminará todo el contenido interno\n¿Estás segur@ de que quieres eliminar este ítem?"
    if (window.confirm(msg)) {
        let o = tree
        for (let i = 0; i < path.length - 1; i++) {
            let n = path[i]
            o = o[n].children           
        }
        const target = path[path.length - 1]
        if (path.length === 1) {
            let modifiedDataArray = Object.values(o)
            modifiedDataArray.splice(target, 1)
            tree = Object.fromEntries(modifiedDataArray.entries())
        } else {
            o.splice(target, 1)
        }        
        localStorage.setItem("tree", JSON.stringify(tree))
        localStorage.setItem("need_to_save", "true")
        curRootLi = -1
        $('#root_ul').empty()
        drawInitialTree(tree)
    }
}

function goUpOuter(path) {
    const target = path[path.length - 1]
    if (target === 0) {
        return
    }
    let o = tree
    for (let i = 0; i < path.length - 1; i++) {
        let n = path[i]
        o = o[n].children           
    }
    const topPosition = o[target - 1]
    const currentPos = o[target]
    o[target - 1] = currentPos
    o[target] = topPosition
    localStorage.setItem("tree", JSON.stringify(tree))
    localStorage.setItem("need_to_save", "true")
    curRootLi = -1
    $('#root_ul').empty()
    drawInitialTree(tree)
}

function goDownOuter(path) {
    let o = tree
    for (let i = 0; i < path.length - 1; i++) {
        let n = path[i]
        o = o[n].children           
    }
    const target = path[path.length - 1]
    if (target === (Object.keys(o).length - 1)) {
       return 
    }
    const downPosition = o[target + 1]
    const currentPos = o[target]
    o[target + 1] = currentPos
    o[target] = downPosition
    localStorage.setItem("tree", JSON.stringify(tree))
    localStorage.setItem("need_to_save", "true")
    curRootLi = -1
    $('#root_ul').empty()
    drawInitialTree(tree)
}

async function save() {
    $("button").attr("disabled", true);
    try {
        const save = firebase.functions().httpsCallable('save_user_manual');
        const result = (await save({
            software_id: softwareId,
            manual_id: manualId,
            checkpoint_tree: localStorage.getItem("checkpoint_tree"),
            tree: JSON.stringify(tree)
        })).data;
        if (result.success === true) {
            console.log("Guardado!!!");
            localStorage.removeItem("need_to_save");
            localStorage.setItem("checkpoint_tree", JSON.stringify(tree));
            $("button").attr("disabled", false);
            return {
                success: true
            }
        } else {
            alert(result.msg);
            $("button").attr("disabled", false);
            return {
                success: false
            }
        }
    } catch (error) {
        console.log(error);
        alert("No se pudo guardar!!");
        $("button").attr("disabled", false);
        return {
            success: false
        }
    }
}

function preview(lang) {
    localStorage.setItem("language_preview", lang);
    window.open('preview.html', '_blank');
}

$(async function () {
    $("#language_selection_preview").iziModal();

    $("#software_name_display").text(softwareName);
    $("#manual_name_display").text(manualName);

    const needToSave = localStorage.getItem("need_to_save");
    if (needToSave === "true") {
        const saveOldWork = confirm("Al parecer en la sesión anterior no se enviaron los cambios al servidor. Desea guardarlos? (Si cancela, esos cambios se pierden)");
        if (saveOldWork === true) {
            const result = await save();
            if (result.success !== true) {
                console.log("Paremos ahí más bien");
                return;
            }
        } else {
            localStorage.removeItem("need_to_save");
        }
    }

    try {
        $("button").attr("disabled", true);
        const getManualBodyCall = firebase.functions().httpsCallable('get_manual_body');
        const result = (await getManualBodyCall({
            software_id: softwareId,
            manual_id: manualId
        })).data;
        if (result.success === true) {
            localStorage.setItem("checkpoint_tree", result.body);
            tree = JSON.parse(result.body);
            localStorage.setItem("tree", JSON.stringify(tree));
            drawInitialTree(tree);
            $("button").attr("disabled", false);
        } else {
            alert(result.msg);
        }
    } catch (error) {
        console.log(error);
        alert("No se pudo iniciar!!");
    }
});
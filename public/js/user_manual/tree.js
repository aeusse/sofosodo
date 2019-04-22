
// Firebase
const firestore = firebase.firestore();
firebase.functions()._url = function (name) {
    return `/funcs/${name}`;
}

let curRootLi = -1;
function appendItem(){
    titleTxt = prompt("Por favor escriba el título");
    if (titleTxt === undefined || titleTxt === null || titleTxt === ""){
        return;
    }
    curRootLi += 1;
    tree[curRootLi] = {
        title: titleTxt,
        children: []
    }
    $("#root_ul").append(`<li>
        <span id="li_title_${curRootLi}" onclick="editItem([${curRootLi}]);">${titleTxt}</span>
        <button class="liButtons" onclick="editLi([${curRootLi}]);">Editar título</button>
        <button class="liButtons" onclick="appendSubItem([${curRootLi}]);">Agregar subitem</button>
        <ul id="sub_ul_${curRootLi}"></ul>
    </li>`);
    localStorage.setItem("tree", JSON.stringify(tree));
    localStorage.setItem("need_to_save", "true");
}

function appendSubItem(parentPath){
    titleTxt = prompt("Por favor escriba el título");
    if (titleTxt === undefined || titleTxt === null || titleTxt === ""){
        return;
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
        title: titleTxt,
        children: []
    })
    const nextPath = parentPath.concat(curSubLiIdx);
    const nextSubUlIdPath = parentSubUlIdPath + "_" + curSubLiIdx;

    $("#sub_ul" + parentSubUlIdPath).append(`<li>
        <span id="li_title${nextSubUlIdPath}" onclick="editItem([${nextPath}]);">${titleTxt}</span>
        <button class="liButtons" onclick="editLi([${nextPath}]);">Editar título</button>
        <button class="liButtons" onclick="appendSubItem([${nextPath}]);">Agregar subitem</button>
        <ul id="sub_ul${nextSubUlIdPath}"></ul>
    </li>`);
    localStorage.setItem("tree", JSON.stringify(tree));
    localStorage.setItem("need_to_save", "true");
}

async function save(){
    $("button").attr("disabled", true);
    try {
        const save = firebase.functions().httpsCallable('save_user_manual');
        const result = await save({checkpoint_tree: localStorage.getItem("checkpoint_tree"), tree: JSON.stringify(tree)});
        if (result.data.success === true){
            console.log("Guardado!!!");
            localStorage.removeItem("need_to_save");
            localStorage.setItem("checkpoint_tree", JSON.stringify(tree));
            $("button").attr("disabled", false);
            return{
                success: true
            }
        }else{
            alert(result.data.msg);
            $("button").attr("disabled", false);
            return{
                success: false
            }
        }
    } catch (error) {
        console.log(error);
        alert("No se pudo guardar!!");
        $("button").attr("disabled", false);
        return{
            success: false
        }
    }
}

$(async function() {
    const needToSave = localStorage.getItem("need_to_save");
    if (needToSave === "true"){
        const saveOldWork = confirm("Al parecer en la sesión anterior no se enviaron los cambios al servidor. Desea guardarlos? (Si cancela, estos cambios se pierden)");
        if (saveOldWork === true){
            const result = await save();
            if (result.success !== true){
                console.log("Paremos ahí más bien");
                return;
            }
        }else{
            localStorage.removeItem("need_to_save");
        }
    }

    try {
        $("button").attr("disabled", true);
        const getCurrent = firebase.functions().httpsCallable('get_current_user_manual');
        const result = await getCurrent();
        if (result.data.success === true){
            localStorage.setItem("checkpoint_tree", result.data.currentManual);
            tree = JSON.parse(result.data.currentManual);
            localStorage.setItem("tree", JSON.stringify(tree));
            drawInitialTree(tree);
            $("button").attr("disabled", false);
        }else{
            alert(result.data.msg);
        }
    } catch (error) {
        console.log(error);
        alert("No se pudo iniciar!!");
    }
});
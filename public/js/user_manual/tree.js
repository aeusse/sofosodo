
// Firebase
const firestore = firebase.firestore();
firebase.functions()._url = function (name) {
    return `/funcs/${name}`;
}

let curRootLi = -1;
function appendItem(){
    const text = prompt("Por favor escriba el título");
    if (text === undefined || text === null || text === ""){
        return;
    }
    curRootLi += 1;
    tree[curRootLi] = {
        title: text,
        children: []
    }
    $("#root_ul").append(`<li>
        <span id="li_title_${curRootLi}" onclick="editItem([${curRootLi}]);">${text}</span>
        <button class="liButtons" onclick="editLi([${curRootLi}]);">Editar título</button>
        <button class="liButtons" onclick="appendSubItem([${curRootLi}]);">Agregar subitem</button>
        <ul id="sub_ul_${curRootLi}"></ul>
    </li>`);
}

function appendSubItem(parentPath){
    const text = prompt("Por favor escriba el título");
    if (text === undefined || text === null || text === ""){
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
        title: text,
        children: []
    })
    const nextPath = parentPath.concat(curSubLiIdx);
    const nextSubUlIdPath = parentSubUlIdPath + "_" + curSubLiIdx;

    $("#sub_ul" + parentSubUlIdPath).append(`<li>
        <span id="li_title${nextSubUlIdPath}" onclick="editItem([${nextPath}]);">${text}</span>
        <button class="liButtons" onclick="editLi([${nextPath}]);">Editar título</button>
        <button class="liButtons" onclick="appendSubItem([${nextPath}]);">Agregar subitem</button>
        <ul id="sub_ul${nextSubUlIdPath}"></ul>
    </li>`);

}


async function save(){
    $("button").attr("disabled", true);
    const save = firebase.functions().httpsCallable('save_user_manual');
    try {
        const result = await save({initial_tree: {}, tree: tree});
        if (result.data.success === true){
            console.log("Guardado!!!");
        }else{
            alert(result.data.msg);
        }
        $("button").attr("disabled", false);
    } catch (error) {
        console.log(error);
        alert("No se pudo guardar");
        $("button").attr("disabled", false);
    }
}
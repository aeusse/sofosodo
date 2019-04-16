let curRootLi = -1;
     
function appendItem(){
    const text = prompt("prompt");
    if (text === undefined || text === null || text === ""){
        return;
    }
    curRootLi += 1;
    tree[curRootLi] = {
        title: text,
        children: []
    }
    $("#root_ul").append(`<li>
        <span onclick="editItem([${curRootLi}]);">${text}</span>
        <button class="liButtons" onclick="editLi([${curRootLi}]);">Editar título</button>
        <button class="liButtons" onclick="appendSubItem([${curRootLi}]);">Agregar subitem</button>
        <ul id="sub_ul_${curRootLi}"></ul>
    </li>`);
}

function appendSubItem(path){
    const text = prompt("prompt");
    if (text === undefined || text === null || text === ""){
        return;
    }

    let o = tree;
    let sub_ul_id_path = "";
    for (let i = 0; i < path.length - 1; i++) {
        let n = path[i];
        o = o[n].children;
        sub_ul_id_path += "_" + n;
    }
    const closerParentIdx = path[path.length - 1];
    const curSubLiIdx = o[closerParentIdx].children.length;

    sub_ul_id_path += "_" + closerParentIdx;

    o[closerParentIdx].children.push({
        title: text,
        children: []
    })
    const nextPath = path.concat(curSubLiIdx);

    $("#sub_ul" + sub_ul_id_path).append(`<li>
        <span onclick="editItem([${path}]);">${text}</span>
        <button class="liButtons" onclick="editLi([${path}]);">Editar título</button>
        <button class="liButtons" onclick="appendSubItem([${nextPath}]);">Agregar subitem</button>
        <ul id="sub_ul${sub_ul_id_path}_${curSubLiIdx}"></ul>
    </li>`);

}

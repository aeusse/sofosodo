let curRootLi = -1;
const tree = []
     
function appendItem(){
    curRootLi += 1;
    tree[curRootLi] = {
        title: "El título " + curRootLi,
        children: []
    }
    $("#root_ul").append(`<li>
        <span>El título ${curRootLi}</span>
        <button class="liButtons" onclick="editLi(${curRootLi});">Editar título</button>
        <button class="liButtons" onclick="appendSubItem([${curRootLi}]);">Agregar subitem</button>
        <ul id="sub_ul_${curRootLi}"></ul>
    </li>`);
}

function appendSubItem(path){
    let o = tree;
    let sub_ul_id_path = "";
    for (let i = 0; i < path.length - 1; i++) {
        let n = path[i];
        o = o[n].children;
        sub_ul_id_path += "_" + n;
    }
    const closerParentIdx = path[path.length - 1]
    curSubLiIdx = o[closerParentIdx].children.length

    sub_ul_id_path += "_" + closerParentIdx;

    o[closerParentIdx].children.push({
        title: "El subtítulo " + sub_ul_id_path + " " + curSubLiIdx,
        children: []
    })
    const nextPath = path.concat(curSubLiIdx);

    $("#sub_ul" + sub_ul_id_path).append(`<li>
        <span>El sub título ${sub_ul_id_path} ${curSubLiIdx}</span>
        <button class="liButtons" onclick="editLi();">Editar título</button>
        <button class="liButtons" onclick="appendSubItem([${nextPath}]);">Agregar subitem</button>
        <ul id="sub_ul${sub_ul_id_path}_${curSubLiIdx}"></ul>
    </li>`);

}
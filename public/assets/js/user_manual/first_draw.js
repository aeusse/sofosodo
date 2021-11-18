
function drawItem(titleTxt, slug) {
    curRootLi += 1; //- OJO!!! con este hack!
    $("#root_ul").append(`<li>
        <span id="li_title_${curRootLi}" class="font-weight-bold pointer" onclick="editItem([${curRootLi}]);">${curRootLi + 1} &nbsp;&nbsp; ${titleTxt}</span>
        <button class="btn btn-outline-dark liButtons" onclick="editTitle([${curRootLi}]);">Editar título</button>
        <button class="btn btn-outline-danger liButtons" onclick="removeOuterItem([${curRootLi}])">Eliminar ítem</button>
        <button class="btn btn-outline-dark liButtons" onclick="appendSubItem([${curRootLi}]);">Agregar subitem</button>
        <i class="far fa-caret-square-up fa-lg pointer mx-2" onclick="goUpOuter([${curRootLi}])"></i>
        <i class="far fa-caret-square-down fa-lg pointer" onclick="goDownOuter([${curRootLi}])"></i>
        <p id="p_slug_${curRootLi}">SLUG: ${slug}</p>
        <ul id="sub_ul_${curRootLi}"></ul>
    </li>`);
}

function drawSubItem(parentPath, titleTxt, parentSubUlIdPath, curSubLiIdx, slug) {
    const nextPath = parentPath.concat(curSubLiIdx);
    const nextSubUlIdPath = parentSubUlIdPath + "_" + curSubLiIdx;
    let parentPathText = "";
    for (let i of parentPath) {
        parentPathText += (parseInt(i) + 1) + ".";
    }
    $("#sub_ul" + parentSubUlIdPath).append(`<li>
        <span id="li_title${nextSubUlIdPath}" class="pointer" onclick="editItem([${nextPath}]);">${parentPathText}${(parseInt(curSubLiIdx) + 1)} &nbsp;&nbsp; ${titleTxt}</span>
        <button class="btn btn-outline-dark liButtons" onclick="editTitle([${nextPath}]);">Editar título</button>
        <button class="btn btn-outline-danger liButtons" onclick="removeOuterItem([${nextPath}])">Eliminar ítem</button>
        <button class="btn btn-outline-dark liButtons" onclick="appendSubItem([${nextPath}]);">Agregar subitem</button>
        <i class="far fa-caret-square-up fa-lg pointer mx-2" onclick="goUpOuter([${nextPath}])"></i>
        <i class="far fa-caret-square-down fa-lg pointer" onclick="goDownOuter([${nextPath}])"></i>
        <p id="p_slug${nextSubUlIdPath}">SLUG: ${slug}</p>
        <ul id="sub_ul${nextSubUlIdPath}"></ul>
    </li>`);
}

function loopAllSubItems(children, currentPath, currentPathUlId) {
    for (let i in children) {
        drawSubItem(currentPath, children[i].title, currentPathUlId, i, children[i].slug);
        loopAllSubItems(children[i].children, currentPath.concat([i]), (currentPathUlId + "_" + i))
    }
}

function drawInitialTree() {
    for (let i in tree) {
        drawItem(tree[i].title, tree[i].slug);
        loopAllSubItems(tree[i].children, [i], ("_" + i))
    }
}
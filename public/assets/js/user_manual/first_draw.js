
function drawItem(titleTxt){
    curRootLi += 1; //- OJO!!! con este hack!
    $("#root_ul").append(`<li>
        <span id="li_title_${curRootLi}" onclick="editItem([${curRootLi}]);"><b>${curRootLi+1} &nbsp;&nbsp; ${titleTxt}</b></span>
        <button class="liButtons" onclick="editLi([${curRootLi}]);">Editar título</button>
        <button class="liButtons" onclick="appendSubItem([${curRootLi}]);">Agregar subitem</button>
        <ul id="sub_ul_${curRootLi}"></ul>
    </li>`);
}

function drawSubItem(parentPath, titleTxt, parentSubUlIdPath, curSubLiIdx){
    const nextPath = parentPath.concat(curSubLiIdx);
    const nextSubUlIdPath = parentSubUlIdPath + "_" + curSubLiIdx;
    let parentPathText = "";
    for (let i of parentPath){
        parentPathText += (parseInt(i)+1) + ".";
    }
    $("#sub_ul" + parentSubUlIdPath).append(`<li>
        <span id="li_title${nextSubUlIdPath}" onclick="editItem([${nextPath}]);">${parentPathText}${(parseInt(curSubLiIdx)+1)} &nbsp;&nbsp; ${titleTxt}</span>
        <button class="liButtons" onclick="editLi([${nextPath}]);">Editar título</button>
        <button class="liButtons" onclick="appendSubItem([${nextPath}]);">Agregar subitem</button>
        <ul id="sub_ul${nextSubUlIdPath}"></ul>
    </li>`);
}

function loopAllSubItems(children, currentPath, currentPathUlId){
    for (let i in children){
        drawSubItem(currentPath, children[i].title, currentPathUlId, i);
        loopAllSubItems(children[i].children, currentPath.concat([i]), (currentPathUlId + "_" + i))
    }
}

function drawInitialTree(){
    for (let i in tree){
        drawItem(tree[i].title);
        loopAllSubItems(tree[i].children, [i], ("_" + i))
    }
}
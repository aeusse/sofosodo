let curRootLi = 4;

function appendLiToRootUl(){
    var text = "Algogog";
    if(text.length){
        $("#root_ul").append(`<li>
            <span class="tab">root li ${curRootLi}</span>
            <button class="liButtons" onclick="editLi(${curRootLi});">Editar título</button>
            <button class="liButtons" onclick="appendLiToSubUl(${curRootLi});">Agregar sub-item</button>
        </li>
        <ul id="root_li_${curRootLi}"></ul>`);
        curRootLi += 1;
    }
}

function appendLiToSubUl(rootLiIdx){
    var text = "Algogog";
    if(text.length){
        $("#root_li_" + rootLiIdx).append(`<li>
            <span class="tab">sub li ${rootLiIdx}</span>
        </li>`);
    }
}
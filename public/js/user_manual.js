let curRootLi = -1;
let curSubLi = -1;

/*const tree = [
    {
        title: "El título 0",
        children: [
            {
                title: "El título 0 0",
                children: []
            },
            {
                title: "El título 0 1",
                children: []
            }
        ]
    },
    {
        title: "El título 1",
        children: [
            {
                title: "El título 1 0",
                children: []
            },
            {
                title: "El título 1 1",
                children: []
            }
        ]
    }
]; */
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
        <button class="liButtons" onclick="appendSubItem(${curRootLi});">Agregar sub-item</button>
        <ul id="root_li_${curRootLi}"></ul>
    </li>`);
        


    console.log(tree)
}

function appendSubItem(itemIdx){
    curSubLi = tree[itemIdx].children.length;
    tree[itemIdx].children.push({
        title: "El título " + itemIdx + " " + curSubLi,
        children: []
    })


    $("#root_li_" + itemIdx).append(`<li>
        <span>El sub título ${itemIdx} ${curSubLi}</span>
        <button class="liButtons" onclick="editLi(${curSubLi});">Editar título</button>
        <button class="liButtons" onclick="appendSubItem(${itemIdx}, ${curSubLi});">Agregar sub-item</button>
        <ul id="root_li_${curSubLi}"></ul>
    </li>`);
}
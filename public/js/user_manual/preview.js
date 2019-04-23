
//const tree = JSON.parse('{"0":{"title":"0 asdf","children":[{"title":"0","children":[{"title":"0 0 0","children":[],"data":{"0":{"type":"text","finalUser":true,"text":"000"},"1":{"type":"image","finalUser":true,"url":"https://firebasestorage.googleapis.com/v0/b/sofosodo-dev.appspot.com/o/images%2F2404d67a-6819-494f-8080-1123a762e770.jpeg?alt=media&token=57de1bde-2901-4d47-81f1-fa13b0aecb1d"},"11":{"type":"text","finalUser":true,"text":"000 itri nan"},"12":{"type":"image","finalUser":false,"url":""}}}]}],"data":{"0":{"type":"text","finalUser":false,"text":"texto 0 del 0 asdf"}}},"1":{"title":"1","children":[{"title":"1 0","children":[]},{"title":"1 1","children":[]},{"title":"1 2","children":[{"title":"1 2 0","children":[],"data":{"0":{"type":"text","finalUser":false,"text":"texto 1or sit amet, consectetuor sit amet, consectetuor sit amet, consectetuor sit or sit amet, consectetuor sit amet, consectetuamet, consectetuor sit amet, consectetuor sit amet, consectetu"},"1":{"type":"image","finalUser":true,"url":"https://firebasestorage.googleapis.com/v0/b/sofosodo-dev.appspot.com/o/images%2FWhatsApp%20Image%202019-04-09%20at%2018.04.58.jpeg?alt=media&token=879498ef-87eb-49c5-9671-01820df4e393"},"2":{"type":"text","finalUser":true,"text":"Lorem ipsum dolor sit amet, consectetur adipisisn elit. Lorem ipsum dolor sit amet, amet, consectetur adipisisn elit. Lorem ipsum dolor sit amet, consectetur adipisisn elit."},"3":{"type":"image","finalUser":true,"url":"https://firebasestorage.googleapis.com/v0/b/sofosodo-dev.appspot.com/o/images%2FWhatsApp%20Image%202019-03-19%20at%2020.55.46.jpeg?alt=media&token=346d2ebc-6103-4f3a-b11a-cc4fdb239e20"},"4":{"type":"image","finalUser":true,"url":"https://firebasestorage.googleapis.com/v0/b/sofosodo-dev.appspot.com/o/images%2FWhatsApp%20Image%202018-11-15%20at%2015.21.10.jpeg?alt=media&token=50d11f9c-8025-4ba3-b55e-28c42b881c4d"},"5":{"type":"text","finalUser":false,"text":""}}}]},{"title":"1 3","children":[],"data":{"0":{"type":"text","finalUser":true,"text":"136"},"1":{"type":"text","finalUser":true,"text":"ah?"}}}],"data":{"0":{"type":"text","finalUser":true,"text":"texto 1or sit amet, consectetuor sit amet, consectetuor sit amet, consectetuor sit or sit amet, consectetuor sit amet, consectetuamet, consectetuor sit amet, consectetuor sit amet, consectetu"}}},"2":{"title":"2","children":[]},"3":{"title":"3","children":[]}}');
let fullHtml = "";

// Firebase
const firestore = firebase.firestore();
firebase.functions()._url = function (name) {
    return `/funcs/${name}`;
}

function drawItem(item){
    console.log("drawItem");
    console.log(item);
    fullHtml += `<div><h2><center>${item.title}</center></h2></div>`;
    for (let idx in item.data){
        const field = item.data[idx];
        console.log(field)
        if (field.finalUser === true){
            if (field.type === "image"){
                fullHtml += `<div class="imageDivs"><img src="${field.url}" /></div><br>`;
            }else{
                fullHtml += `<div><p>${field.text}</p></div>`;
            }
        }
    }

    
}

function drawSubItem(subItem){
    console.log("drawSubItem");
    console.log(subItem);
    fullHtml += `<div><h4><center>${subItem.title}</center></h4></div>`;
    for (let idx in subItem.data){
        const field = subItem.data[idx];
        console.log(field)
        if (field.finalUser === true){
            if (field.type === "image"){
                fullHtml += `<div class="imageDivs"><img src="${field.url}" /></div><br>`;
            }else{
                fullHtml += `<div><p>${field.text}</p></div>`;
            }
        }
    }
}

function loopAllSubItems(children, currentPath){
    for (let i in children){
        drawSubItem(children[i]);
        loopAllSubItems(children[i].children, currentPath.concat([i]))
    }
}

function drawInitialTree(tree){
    for (let i in tree){
        drawItem(tree[i]);
        loopAllSubItems(tree[i].children, [i], ("_" + i))
    }

    $("page").html(fullHtml);


}

//drawInitialTree(tree)

$(async function() {
    try {
        const getCurrent = firebase.functions().httpsCallable('get_current_user_manual');
        const result = await getCurrent();
        if (result.data.success === true){
            tree = JSON.parse(result.data.currentManual);
            drawInitialTree(tree);
        }else{
            alert(result.data.msg);
        }
    } catch (error) {
        console.log(error);
        alert("No se pudo iniciar!!");
    }
});

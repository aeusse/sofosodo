
let workingDBMap = {};
let savedDBMap = {};
let count = 0;

//- Firebase
const firestore = firebase.firestore();
firebase.functions()._url = function (name) {
    return `/funcs/${name}`;
}

function diffObjects(obj1, obj2) {
    obj1["states"] = {};
    obj2["states"] = {};
    for (const p in obj1) {
        if (p === "states") continue;
        obj1["states"][p] = "good";
        obj2["states"][p] = "good";
        if (obj2.hasOwnProperty(p) === false) {
            obj1["states"][p] = "extra";
            obj2["states"][p] = "missing";
            obj2[p] = obj1[p];
        } else {
            switch (typeof (obj1[p])) {
                case 'object':
                    diffObjects(obj1[p], obj2[p])
                    break;
                default:
                    if (obj1[p] !== obj2[p]) {
                        obj1["states"][p] = "different";
                        obj2["states"][p] = "different";
                    }
                    break;
            }
        }
    }
    //Check object 2 for any extra properties
    for (const p in obj2) {
        if (p === "states") continue;
        if (typeof (obj1[p]) === 'undefined') {
            obj2["states"][p] = "extra";
            obj1["states"][p] = "missing";
            obj1[p] = obj2[p];
        }
    }
    return
}

function diffAndDraw(obj1, obj2) {
    //- Primero unas copias profundas
    const a = JSON.parse(JSON.stringify(obj1))
    const b = JSON.parse(JSON.stringify(obj2))
    //- Y ahora sí la función
    diffObjects(a, b)
    const orderedA = sortObject(a);
    const orderedB = sortObject(b);
    $("#walker_result").html(renderJson(orderedA, true));
    $("#last_saved").html(renderJson(orderedB, true));
}

function renderJson(obj, states = true, start = true) {
    if (start === true) {
        count = 0;
    }
    const result = document.createElement('ul');
    let o;
    if (states) {
        o = obj["states"];
    } else {
        o = obj;
    }
    for (key in o) {
        const list = document.createElement('li')
        let liText = key;
        if (o[key] === "extra" && (typeof (obj[key]) === "object")) {
            liText += ' {...}';
        }
        const textnode = document.createTextNode(liText);
        list.dataset.string = textnode.textContent;
        list.className = "to_diff";
        list.setAttribute("id", String(count));
        list.className = o[key];
        list.appendChild(textnode);
        count += 1;
        if (typeof obj[key] === 'object') {
            list.appendChild(renderJson(obj[key], states, false));
        } else {
            textnode.textContent += ': ' + obj[key];
        }
        result.appendChild(list);
    }
    return result;
}

async function getFullDbMap() {
    try {
        $("#loading_div").show();
        $("button").attr("disabled", true);
        const fullDbMapCall = firebase.functions().httpsCallable('get_full_db_map');
        const result = (await fullDbMapCall()).data;
        if (result.success === true) {
            workingDBMap = sortObject(result.dict);
            $("#walker_result").html(renderJson(workingDBMap, false));
        } else {
            alert(result.msg);
        }
        $("#loading_div").hide();
        $("button").attr("disabled", false);
    } catch (error) {
        console.error(error);
        $("#loading_div").hide();
        alert("No se pudo obtener!!");
        $("button").attr("disabled", false);
    }
}

async function saveFullDbMap() {
    try {
        $("#loading_div").show();
        $("button").attr("disabled", true);
        const fullDbMapSave = firebase.functions().httpsCallable('save_full_db_map');
        const result = (await fullDbMapSave({
            software_id: softwareId,
            new_body: workingDBMap
        })).data;
        if (result.success === true) {
            alert("hecho!");
            savedDBMap = workingDBMap;
            $("#last_saved").html(renderJson(savedDBMap, false));
            $("button").attr("disabled", false);
        } else {
            alert(result.msg);
            $("#get_full_db_map_button").attr("disabled", false);
        }
        $("#loading_div").hide();
    } catch (error) {
        console.error(error);
        $("#loading_div").hide();
        alert("No se pudo guardar!!");
        $("#get_full_db_map_button").attr("disabled", false);
    }
}

$(async function () {
    try {
        $("button").attr("disabled", true);
        const getCurrentSavedDbMapCall = firebase.functions().httpsCallable('get_current_saved_db_map');
        const result = (await getCurrentSavedDbMapCall({ software_id: softwareId })).data;
        if (result.success === true) {
            if (result.body === null) {
                $("#last_saved").html("Todavía no has guardado nada jeje");
            } else {
                savedDBMap = result.body;
                const orderedResult = sortObject(savedDBMap);
                $("#last_saved").html(renderJson(orderedResult, false));
            }
        } else {
            alert(result.msg);
        }
        $("#loading_div").hide();
        $("#get_full_db_map_button").attr("disabled", false);
    } catch (error) {
        console.error(error);
        $("#loading_div").hide();
        alert("No se pudo obtener el último recorrido guardado!!");
    }

    $('#diff_toggle_box').change(function () {
        const checked = $(this).prop('checked');
        if (checked) {
            diffAndDraw(workingDBMap, savedDBMap);
        } else {
            const orderedResult = sortObject(savedDBMap);
            $("#last_saved").html(renderJson(orderedResult, false));
            const orderedResult2 = sortObject(workingDBMap);
            $("#walker_result").html(renderJson(orderedResult2, false));
        }
    });

});
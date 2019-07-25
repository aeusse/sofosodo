
let currentDBMap = {};

//- Firebase
const firestore = firebase.firestore();
firebase.functions()._url = function (name) {
    return `/funcs/${name}`;
}

//- Renderjson confs
renderjson.set_show_to_level("all");
renderjson.set_sort_objects(true);

async function getFullDbMap() {
    try {
        $("#loading_div").show();
        $("button").attr("disabled", true);
        const fullDbMapCall = firebase.functions().httpsCallable('get_full_db_map');
        const result = await fullDbMapCall();
        if (result.data.success === true) {
            currentDBMap = result.data.dict;
            $("#walker_result").html(renderjson(currentDBMap));
        } else {
            alert(result.data.msg);
        }
        $("#loading_div").hide();
        $("button").attr("disabled", false);
    } catch (error) {
        console.log(error);
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
        const result = await fullDbMapSave({ "dict": currentDBMap });
        if (result.data.success === true) {
            alert("hecho!");
            $("#last_saved").html(renderjson(currentDBMap));
            $("button").attr("disabled", false);
        } else {
            alert(result.data.msg);
            $("#get_full_db_map_button").attr("disabled", false);
        }
        $("#loading_div").hide();
    } catch (error) {
        console.log(error);
        $("#loading_div").hide();
        alert("No se pudo guardar!!");
        $("#get_full_db_map_button").attr("disabled", false);
    }
}

$(async function () {
    try {
        $("button").attr("disabled", true);
        const getCurrentDbMapCall = firebase.functions().httpsCallable('get_current_saved_db_map');
        const result = await getCurrentDbMapCall();
        if (result.data.success === true) {
            if (result.data.dict === null){
                $("#last_saved").html("Todavía no has guardado nada jeje");
            }else{
                $("#last_saved").html(renderjson(result.data.dict));
            }
        } else {
            alert(result.data.msg);
        }
        $("#loading_div").hide();
        $("#get_full_db_map_button").attr("disabled", false);
    } catch (error) {
        console.log(error);
        $("#loading_div").hide();
        alert("No se pudo obtener el último recorrido guardado!!");
    }
});
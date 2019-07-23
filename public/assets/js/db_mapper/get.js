
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
        $("button").attr("disabled", true);
        const fullDbMapCall = firebase.functions().httpsCallable('get_full_db_map');
        const result = await fullDbMapCall();
        if (result.data.success === true) {
            console.log("El resultado ===========")
            console.log(result.data)
            $("#walker_result").html(renderjson(result.data.json));
        } else {
            alert(result.data.msg);
        }
        $("button").attr("disabled", false);
    } catch (error) {
        console.log(error);
        alert("No se pudo obtener!!");
        $("button").attr("disabled", false);
    }
}
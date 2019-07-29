
// Firebase
const firestore = firebase.firestore();
firebase.functions()._url = function (name) {
    return `/funcs/${name}`;
}

async function createOne(name){
    console.log("vea")


    try {
        $("#loading_div").show();
        $("button").attr("disabled", true);
        const getUserManualsCall = firebase.functions().httpsCallable('get_user_manuals');
        const result = await getUserManualsCall();
        console.log("hecho!");
            console.log(result.data);
        if (result.data.success === true) {
            
        } else {
        }
        $("button").attr("disabled", false);
        $("#loading_div").hide();
    } catch (error) {
        console.log(error);
        $("button").attr("disabled", false);
        $("#loading_div").hide();
        alert("No se pudo obtener!!");
    }
}
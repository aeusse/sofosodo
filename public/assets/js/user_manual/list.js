
let magicWord = ''

//- Firebase
const firestore = firebase.firestore();
firebase.functions()._url = function (name) {
    return `/funcs/${name}`;
}

function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

async function createManual() {
    try {
        let nameTxt = prompt("Por favor escriba el nombre del manual");
        if (nameTxt === undefined || nameTxt === null || nameTxt === "") {
            return;
        }
        nameTxt = toTitleCase(nameTxt);
        $("#loading_div").show();
        $("button").attr("disabled", true);
        const createNewManualCall = firebase.functions().httpsCallable('create_new_manual');
        const result = (await createNewManualCall({ name: nameTxt, software_id: softwareId })).data;
        if (result.success === true) {
            const html = `<button onclick="goToEditor('${result.id}', '${nameTxt}');">${nameTxt}</button>
                <br>
                <br>`;
            $("#result").append(html)
        } else {
            alert(result.msg);
        }
        $("button").attr("disabled", false);
        $("#loading_div").hide();
    } catch (error) {
        console.log(error);
        $("button").attr("disabled", false);
        $("#loading_div").hide();
        alert("Error al crear ese manual!!");
    }
}

function goToEditor(id, name) {
    localStorage.setItem("manual_id", id);
    localStorage.setItem("manual_name", name);
    window.location = "editor.html"
}

async function exportManual() {
    if (confirm('¿Está seguro que desea publicar estos manuales?')) {
        try {
            $("button").attr("disabled", true);
            $("#loading_div").show();
            const exportCall = firebase.functions().httpsCallable('export_user_manuals');
            const result = (await exportCall({
                softwareId,
                magicWord
            })).data;
            if (result.success === true) {
                alert("¡HECHO!");
            } else {
                alert(result.msg);
            }
            $("#loading_div").hide();
            $("button").attr("disabled", false);
        } catch (error) {
            console.log(error);
            alert("Error no manejado al exportar!!");
        }
    }
}

$(async function () {
    $("#software_name_span_text").text(softwareName);
    try {
        $("button").attr("disabled", true);
        $("#loading_div").show();
        const getUserManualsCall = firebase.functions().httpsCallable('get_user_manuals');
        const result = (await getUserManualsCall({ software_id: softwareId })).data;
        if (result.success === true) {
            for (const id in result.manuals) {
                const html = `<button onclick="goToEditor('${id}', '${result.manuals[id].name}');">${result.manuals[id].name}</button>
                <br>
                <br>`;
                $("#result").append(html)
            }
        } else {
            alert(result.msg);
        }
        $("#loading_div").hide();
        $("button").attr("disabled", false);
    } catch (error) {
        console.log(error);
        alert("No se pudo iniciar!!");
    }
});
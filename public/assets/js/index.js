
// Firebase
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

async function createSoftware() {
    try {
        let nameTxt = prompt("Por favor escriba el nombre de la Aplicación");
        if (nameTxt === undefined || nameTxt === null || nameTxt === "") {
            return;
        }
        nameTxt = toTitleCase(nameTxt);
        $("#loading_div").show();
        $("button").attr("disabled", true);
        const registerNewSoftwareCall = firebase.functions().httpsCallable('register_new_software');
        const result = (await registerNewSoftwareCall({ name: nameTxt })).data;
        if (result.success === true) {
            const html = `<button onclick="goToTools('${result.id}', '${nameTxt}');">${nameTxt}</button>
                <br>
                <br>`;
            $("#result").append(html)
        } else {
        }
        $("button").attr("disabled", false);
        $("#loading_div").hide();
    } catch (error) {
        console.log(error);
        $("button").attr("disabled", false);
        $("#loading_div").hide();
        alert("Error al registrar ese software!!");
    }
}

function goToTools(id, name) {
    localStorage.setItem("software_id", id);
    localStorage.setItem("software_name", name);
    window.location = "tools/tools.html"
}

$(async function () {
    try {
        $("button").attr("disabled", true);
        const getSoftwaresCall = firebase.functions().httpsCallable('get_softwares');
        const result = (await getSoftwaresCall()).data;
        if (result.success === true) {
            for (const id in result.softwares) {
                const html = `<button onclick="goToTools('${id}', '${result.softwares[id].name}');">${result.softwares[id].name}</button>
                <br>
                <br>`;
                $("#result").append(html)
            }
        }
        $("button").attr("disabled", false);
        $("#loading_div").hide();
    } catch (error) {
        console.log(error);
        $("#loading_div").hide();
        alert("No se pudo obtener el listado de aplicaciones!!");
    }
});
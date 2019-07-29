
const softwareId = localStorage.getItem("software_id");
const softwareName = localStorage.getItem("software_name");

if (softwareName === null || softwareId === null){
    window.location = "/"
}
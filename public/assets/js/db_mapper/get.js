
let currentDBMap = {};

//- Firebase
const firestore = firebase.firestore();
firebase.functions()._url = function (name) {
    return `/funcs/${name}`;
}

let count = 0;
function renderJson(obj, start = false) {
    if (start === true) {
        count = 0;
    }
    const result = document.createElement('ul');
    for (key in obj) {
        const list = document.createElement('li')
        const textnode = document.createTextNode(key);
        list.dataset.string = textnode.textContent;
        list.className = "to_diff";
        list.setAttribute("id", String(count));
        list.appendChild(textnode);
        count += 1;
        if (typeof obj[key] === 'object') {
            list.appendChild(renderJson(obj[key]));
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
            currentDBMap = sortObject(result.dict);
            $("#walker_result").html(renderJson(currentDBMap, true));
        } else {
            alert(result.msg);
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

function diffThem() {
    const lastSavedItems = $("#last_saved .to_diff");
    const walkerItems = $("#walker_result .to_diff");
    count = 0;
    for (const idx in lastSavedItems) {
        count += 1;
        const liLS = $(lastSavedItems[idx]);
        const liW = $(walkerItems[idx]);
        //console.log(li);
        console.log(liLS.data("string"));
        console.log(liLS.attr('id'));
        console.log(liW.data("string"));
        console.log(liW.attr('id'));
        if (count === 10) break
    }
}

async function saveFullDbMap() {
    try {
        $("#loading_div").show();
        $("button").attr("disabled", true);
        const fullDbMapSave = firebase.functions().httpsCallable('save_full_db_map');
        const result = (await fullDbMapSave({
            software_id: softwareId,
            new_body: currentDBMap
        })).data;
        if (result.success === true) {
            alert("hecho!");
            $("#last_saved").html(renderJson(currentDBMap, true));
            $("button").attr("disabled", false);
        } else {
            alert(result.msg);
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
        /*$("button").attr("disabled", true);
        const getCurrentDbMapCall = firebase.functions().httpsCallable('get_current_saved_db_map');
        const result = (await getCurrentDbMapCall({ software_id: softwareId })).data;
        if (result.success === true) {
            if (result.body === null) {
                $("#last_saved").html("Todavía no has guardado nada jeje");
            } else {
                const orderedResult = sortObject(result.body);
                $("#last_saved").html(renderJson(orderedResult));
            }
        } else {
            alert(result.msg);
        }*/
        a = JSON.parse('{"result":{"success":true,"body":{"roles":{"fields":{"isFullAdmin":"boolean","enabled":"boolean","description":"string","hidden":"boolean","lastUpdate":"number","companyId":"string","profile":"string","ep":"string","name":"string","rules":{"update":"array","create":"array","read":"array","delete":"array"},"deleted":"boolean"}},"ownCustomers":{"subcollections":{"tickets":{"fields":{"status":"string","details":"string","name":"string","activity":{"0":{"startDate":"number","lineId":"string","name":"string","lineName":"string"}},"createdBy":{"id":"string","email":"string","name":"string"},"customer":{"docId":"string","docType":"string","docTypeId":"string","lastName":"string","name":"string"},"currentLineName":"string","currentActivity":"number","customerId":"string","issueDate":"number","lastEventDate":"number","lineBranchCustomMsg":"string","companyId":"string","origin":"string","currentLineId":"string","appId":"string","startLineName":"string","branchId":"string","branchName":"string","startLineId":"string","ownCustomerId":"string"}}},"fields":{"docType":"string","email":"string","name":"string","mobileToken":"string","mobileId":"string","lastName":"string","docNumber":"string"}},"sessions":{"fields":{"issueDate":"number","ref":"string","companyId":"string","company":{"name":"string","id":"string"},"placement":{"branch":{"id":"string","name":"string","gmt":"string"}},"userId":"string"}},"ownMobiles":{"fields":{"pushToken":"string","deviceId":"string","appName":"string"}},"companies":{"subcollections":{"mobiles":{"fields":{"pushToken":"string","deviceId":"string","appName":"string"}},"lines":{"fields":{"name":"string","deleted":"boolean","color":"string","enabled":"boolean","chars":"string","hidden":"boolean"}},"tickets":{"subcollections":{"activity":{"fields":{"startDate":"number","lineId":"string","name":"string","endDate":"number"}}},"fields":{"startLineId":"string","status":"string","details":"string","name":"string","activity":{"0":{"lineId":"string","name":"string","lineName":"string","endDate":"number","startDate":"number"},"1":{"slotRef":"string","startDate":"number","userId":"string","name":"string","lineId":"string","lineName":"string","endDate":"number"}},"createdBy":{"email":"string","name":"string","id":"string"},"currentLineName":"string","lineName":"string","currentActivity":"number","issueDate":"number","lastEventDate":"number","lineBranchCustomMsg":"string","origin":"string","currentLineId":"string","startLineName":"string","branchId":"string","branchName":"string"}},"customers":{"fields":{"docId":"string","docType":"string","docTypeId":"string"}},"apps":{"fields":{"name":"string","fcmServerKey":"string","enabled":"boolean","deleted":"boolean","hidden":"boolean"}},"printerHubEvents":{"fields":{"lineName":"string","printerInterface":"string","issueDate":"number","branchName":"string","printerName":"string","details":"string","printerId":"string","ticketIssueDate":"number","branchId":"string","ticketName":"string","lineId":"string"}},"branches":{"subcollections":{"realtime":{"fields":{"placement":{"slot":{"id":"string","name":"string","displayName":"string"},"branch":{"gmt":"string","id":"string","twentyfourSevenService":{},"name":"string"},"slotGroup":{"name":"string","id":"string"}},"user":{"firstName":"string","id":"string","lastName":"string"},"action":"string","issueDate":"number"}},"touchScreens":{"fields":{"name":"string","deleted":"boolean","similarTo":"string","docInput":{"required":"boolean","preselected":"string","ask":"boolean"},"nameInput":{"required":"boolean","ask":"boolean"},"enabled":"boolean","hidden":"boolean","sequence":"array"},"subcollections":{"lines":{"fields":{"enabled":"boolean"}}}},"screens":{"fields":{"fcm":"boolean","name":"string","deleted":"boolean","enabled":"boolean","token":"string","hidden":"boolean"}},"lines":{"fields":{"localConf":{"chars":"string","markInTransitActivity":"boolean","color":"string"},"enabled":"boolean","sequence":{"lastNumber":"number","lastEvent":"number"},"orderSettings":{"enabled":"boolean","sets":{"Todo el día":{"weekDays":"array","timeDivision":"number","workingHours":{"endMinute":"number","startHour":"number","startMinute":"number","endHour":"number"},"slotCapacity":"number"}},"cancelWindow":"number","operationRange":{"daysAhead":"number","howManyDays":"number"}},"printOnApiCreation":"boolean","appointmentSettings":{"cancelWindow":"number","operationRange":{"howManyDays":"number","daysAhead":"number"},"enabled":"boolean","sets":{"tardes":{"weekDays":"array","timeDivision":"number","workingHours":{"endMinute":"number","startHour":"number","startMinute":"number","endHour":"number"},"slotCapacity":"number"}}}},"subcollections":{"screens":{"fields":{"enabled":"boolean"}},"printers":{"fields":{"enabled":"boolean","companyHub":"boolean","branchHub":"boolean"}},"orders":{"fields":{"allOrders":"array","waitingOrders":"array"},"subcollections":{"detailed":{"fields":{"createdBy":{"email":"string","name":"string","id":"string"},"customer":{"docId":"string","docType":"string","docTypeId":"string","name":"string","lastName":"string","phoneNumbers":"array"},"customFields":{"exito":{"carnes":"array"}},"issueDate":"number","status":"string","details":"string"}}}},"stats":{"fields":{"waitingTickets":"number","inTransitTickets":"number","maxServeTime":"number","reused":"number","autodumped":"number","maxInTransitTime":"number","waitTime":"number","lastInTransitTime":"number","inTransitTime":"number","minWaitTime":"number","lastWaitTime":"number","minInTransitTime":"number","canceled":"number","successfullyServed":"number","dumped":"number","servingTickets":"number","serveTime":"number","minServeTime":"number","served":"number","maxWaitTime":"number","tickets":"number","finished":"number","lastServeTime":"number","successfullyServeTime":"number"},"subcollections":{"byHour":{"fields":{"maxWaitTime":"number","tickets":"number","finished":"number","docId":"number","minWaitTime":"number","canceled":"number","dumped":"number","successfullyServed":"number","serveTime":"number","maxServeTime":"number","reused":"number","autodumped":"number","minServeTime":"number","served":"number","waitTime":"number"}}}}}},"slotGroups":{"fields":{"name":"string","enabled":"boolean","deleted":"boolean","hidden":"boolean"}},"stats":{"subcollections":{"byHour":{"fields":{"minWaitTime":"number","canceled":"number","dumped":"number","successfullyServed":"number","serveTime":"number","maxServeTime":"number","reused":"number","autodumped":"number","minServeTime":"number","served":"number","waitTime":"number","maxWaitTime":"number","tickets":"number","finished":"number","docId":"number"}},"detailedByDay":{"fields":{"json":"string"}}},"fields":{"reused":"number","autodumped":"number","minServeTime":"number","maxInTransitTime":"number","served":"number","waitTime":"number","tickets":"number","maxWaitTime":"number","finished":"number","successfullyServeTime":"number","inTransitTime":"number","waitingTickets":"number","minWaitTime":"number","minInTransitTime":"number","canceled":"number","dumped":"number","successfullyServed":"number","serveTime":"number","servingTickets":"number","inTransitTickets":"number","maxServeTime":"number"}},"slots":{"fields":{"enabled":"boolean","slotGroupId":"string","status":"string","name":"string","deleted":"boolean","lines":"array","displayName":"string","hidden":"boolean","slotType":"string","user":{"lastName":"string","firstName":"string","id":"string"},"type":"string","lastUser":{"firstName":"string","prefs":{},"id":"string","lastName":"string"}},"subcollections":{"lines":{"fields":{"enabled":"boolean"}}}},"tactiles":{"fields":{"enabled":"boolean"}},"printers":{"fields":{"deleted":"boolean","type":"string","interface":"string","enabled":"boolean","companyHub":"boolean","hidden":"boolean","name":"string"}}},"fields":{"lastUpdate":"number","customBranchId":"string","name":"string","appId":"string","deleted":"boolean","branchGroupIds":"array","location":{"longitude":"number","name":"string","address":"string","latitude":"number"},"gmtSignedOffset":"number","enabled":"boolean","hidden":"boolean","gmt":"string"}},"touchScreens":{"fields":{"name":"string","enabled":"boolean","deleted":"boolean","hidden":"boolean"},"subcollections":{"lines":{"fields":{"enabled":"boolean"}}}}},"fields":{"thirdPartyStrings":{"customFields":{"tipo_de_carne":"string","tipo_de_corte":"string","tipo_de_empaque":"string"}},"deleted":"boolean","enabled":"boolean","token":"string","thirdPartyFrontendFolder":"string","name":"string","fcmServerKey":"string"}},"users":{"subcollections":{"branches":{"fields":{"enabled":"boolean"}}},"fields":{"docType":"string","companyId":"string","lastLogin":"string","description":"string","enabled":"boolean","password":"string","email":"string","deleted":"boolean","roleId":"string","lastName":"string","hidden":"boolean","firstName":"string","docNumber":"string","branches":"array"}},"customerDocTypes":{"fields":{"key":"string","name":"string","shortName":"string"}}}}}');
        b = JSON.parse('{"result":{"success":true,"bodi":{"roles":{"fields":{"isFullAdmin":"boolean","enabled":"boolean","description":"string","hidden":"boolean","lastUpdate":"number","companyId":"string","profile":"string","ep":"string","name":"string","rules":{"update":"array","create":"array","read":"array","delete":"array"},"deleted":"boolean"}},"ownCustomers":{"subcollections":{"tickets":{"fields":{"status":"string","details":"string","name":"string","activity":{"0":{"startDate":"number","lineId":"string","name":"string","lineName":"string"}},"createdBy":{"id":"string","email":"string","name":"string"},"customer":{"docId":"string","docType":"string","docTypeId":"string","lastName":"string","name":"string"},"currentLineName":"string","currentActivity":"number","customerId":"string","issueDate":"number","lastEventDate":"number","lineBranchCustomMsg":"string","companyId":"string","origin":"string","currentLineId":"string","appId":"string","startLineName":"string","branchId":"string","branchName":"string","startLineId":"string","ownCustomerId":"string"}}},"fields":{"docType":"string","email":"string","name":"string","mobileToken":"string","mobileId":"string","lastName":"string","docNumber":"string"}},"sessions":{"fields":{"issueDate":"number","ref":"string","companyId":"string","company":{"name":"string","id":"string"},"placement":{"branch":{"id":"string","name":"string","gmt":"string"}},"userId":"string"}},"ownMobiles":{"fields":{"pushToken":"string","deviceId":"string","appName":"string"}},"companies":{"subcollections":{"mobiles":{"fields":{"pushToken":"string","deviceId":"string","appName":"string"}},"lines":{"fields":{"name":"string","deleted":"boolean","color":"string","enabled":"boolean","chars":"string","hidden":"boolean"}},"tickets":{"subcollections":{"activity":{"fields":{"startDate":"number","lineId":"string","name":"string","endDate":"number"}}},"fields":{"startLineId":"string","status":"string","details":"string","name":"string","activity":{"0":{"lineId":"string","name":"string","lineName":"string","endDate":"number","startDate":"number"},"1":{"slotRef":"string","startDate":"number","userId":"string","name":"string","lineId":"string","lineName":"string","endDate":"number"}},"createdBy":{"email":"string","name":"string","id":"string"},"currentLineName":"string","lineName":"string","currentActivity":"number","issueDate":"number","lastEventDate":"number","lineBranchCustomMsg":"string","origin":"string","currentLineId":"string","startLineName":"string","branchId":"string","branchName":"string"}},"customers":{"fields":{"docId":"string","docType":"string","docTypeId":"string"}},"apps":{"fields":{"name":"string","enabled":"boolean","deleted":"boolean","hidden":"boolean"}},"printerHubEvents":{"fields":{"lineName":"string","printerInterface":"string","issueDate":"number","branchName":"string","printerName":"string","details":"string","printerId":"string","ticketIssueDate":"number","branchId":"string","ticketName":"string","lineId":"string"}},"branches":{"subcollections":{"realtime":{"fields":{"placement":{"slot":{"id":"string","name":"string","displayName":"string"},"branch":{"gmt":"string","id":"string","twentyfourSevenService":{},"name":"string"},"slotGroup":{"name":"string","id":"string"}},"user":{"firstName":"string","id":"string","lastName":"string"},"action":"string","issueDate":"number"}},"touchScreens":{"fields":{"name":"string","deleted":"boolean","similarTo":"string","docInput":{"required":"boolean","preselected":"string","ask":"boolean"},"nameInput":{"required":"boolean","ask":"boolean"},"enabled":"boolean","hidden":"boolean","sequence":"array"},"subcollections":{"lines":{"fields":{"enabled":"boolean"}}}},"screens":{"fields":{"fcm":"boolean","name":"string","deleted":"boolean","enabled":"boolean","token":"string","hidden":"boolean"}},"lines":{"fields":{"localConf":{"chars":"string","markInTransitActivity":"boolean","color":"string"},"enabled":"boolean","sequence":{"lastNumber":"number","lastEvent":"number"},"orderSettings":{"enabled":"boolean","sets":{"Todo el día":{"weekDays":"array","timeDivision":"number","workingHours":{"endMinute":"number","startHour":"number","startMinute":"number","endHour":"number"},"slotCapacity":"number"}},"cancelWindow":"number","operationRange":{"daysAhead":"number","howManyDays":"number"}},"printOnApiCreation":"boolean","appointmentSettings":{"cancelWindow":"number","operationRange":{"howManyDays":"number","daysAhead":"number"},"enabled":"boolean","sets":{"tardes":{"weekDays":"array","timeDivision":"number","workingHours":{"endMinute":"number","startHour":"number","startMinute":"number","endHour":"number"},"slotCapacity":"number"}}}},"subcollections":{"screens":{"fields":{"enabled":"boolean"}},"printers":{"fields":{"enabled":"boolean","companyHub":"boolean","branchHub":"boolean"}},"orders":{"fields":{"allOrders":"array","waitingOrders":"array"},"subcollections":{"detailed":{"fields":{"createdBy":{"email":"string","name":"string","id":"string"},"customer":{"docId":"string","docType":"string","docTypeId":"string","name":"string","lastName":"string","phoneNumbers":"array"},"customFields":{"exito":{"carnes":"array"}},"issueDate":"number","status":"string","details":"string"}}}},"stats":{"fields":{"waitingTickets":"number","inTransitTickets":"number","maxServeTime":"number","reused":"number","autodumped":"number","maxInTransitTime":"number","waitTime":"number","lastInTransitTime":"number","inTransitTime":"number","minWaitTime":"number","lastWaitTime":"number","minInTransitTime":"number","canceled":"number","successfullyServed":"number","dumped":"number","servingTickets":"number","serveTime":"number","minServeTime":"number","served":"number","maxWaitTime":"number","tickets":"number","finished":"number","lastServeTime":"number","successfullyServeTime":"number"},"subcollections":{"byHour":{"fields":{"maxWaitTime":"number","tickets":"number","finished":"number","docId":"number","minWaitTime":"number","canceled":"number","dumped":"number","successfullyServed":"number","serveTime":"number","maxServeTime":"number","reused":"number","autodumped":"number","minServeTime":"number","served":"number","waitTime":"number"}}}}}},"slotGroups":{"fields":{"name":"string","enabled":"boolean","deleted":"boolean","hidden":"boolean"}},"stats":{"subcollections":{"byHour":{"fields":{"minWaitTime":"number","canceled":"number","dumped":"number","successfullyServed":"number","serveTime":"number","maxServeTime":"number","reused":"number","autodumped":"number","minServeTime":"number","served":"number","waitTime":"number","maxWaitTime":"number","tickets":"number","finished":"number","docId":"number"}},"detailedByDay":{"fields":{"json":"string"}}},"fields":{"reused":"number","autodumped":"number","minServeTime":"number","maxInTransitTime":"number","served":"number","waitTime":"number","tickets":"number","maxWaitTime":"number","finished":"number","successfullyServeTime":"number","inTransitTime":"number","waitingTickets":"number","minWaitTime":"number","minInTransitTime":"number","canceled":"number","dumped":"number","successfullyServed":"number","serveTime":"number","servingTickets":"number","inTransitTickets":"number","maxServeTime":"number"}},"slots":{"fields":{"enabled":"boolean","slotGroupId":"string","status":"string","name":"string","deleted":"boolean","lines":"array","displayName":"string","hidden":"boolean","slotType":"string","user":{"lastName":"string","firstName":"string","id":"string"},"type":"string","lastUser":{"firstName":"string","prefs":{},"id":"string","lastName":"string"}},"subcollections":{"lines":{"fields":{"enabled":"boolean"}}}},"tactiles":{"fields":{"enabled":"boolean"}},"printers":{"fields":{"deleted":"boolean","type":"string","interface":"string","enabled":"boolean","companyHub":"boolean","hidden":"boolean","name":"string"}}},"fields":{"lastUpdate":"number","customBranchId":"string","name":"string","appId":"string","deleted":"boolean","branchGroupIds":"array","location":{"longitude":"number","name":"string","address":"string","latitude":"number"},"gmtSignedOffset":"number","enabled":"boolean","hidden":"boolean","gmt":"string"}},"touchScreens":{"fields":{"name":"string","enabled":"boolean","deleted":"boolean","hidden":"boolean"},"subcollections":{"lines":{"fields":{"enabled":"boolean"}}}}},"fields":{"thirdPartyStrings":{"customFields":{"tipo_de_carne":"string","tipo_de_corte":"string","tipo_de_empaque":"string"}},"deleted":"boolean","enabled":"boolean","token":"string","thirdPartyFrontendFolder":"string","name":"string"}},"users":{"subcollections":{"branches":{"fields":{"enabled":"boolean"}}},"fields":{"docType":"string","companyId":"string","lastLogin":"string","description":"string","enabled":"boolean","password":"string","email":"string","deleted":"boolean","roleId":"string","lastName":"string","hidden":"boolean","firstName":"string","docNumber":"string","branches":"array"}},"customerDocTypes":{"fields":{"key":"string","name":"string","shortName":"string"}}}}}');
        const orderedResult = sortObject(a);
        $("#last_saved").html(renderJson(orderedResult, true));
        const orderedResult2 = sortObject(b);
        $("#walker_result").html(renderJson(orderedResult2, true));
        $("#loading_div").hide();
        $("#get_full_db_map_button").attr("disabled", false);
    } catch (error) {
        console.log(error);
        $("#loading_div").hide();
        alert("No se pudo obtener el último recorrido guardado!!");
    }
});
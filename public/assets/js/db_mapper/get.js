
let workingDBMap = {};
let savedDBMap = {};
//let workingDBMap = JSON.parse('{"companies":{"fields":{"deleted":"boolean","enabled":"boolean","fcmServerKey":"string","name":"string","thirdPartyFrontendFolder":"string","thirdPartyStrings":{"customFields":{}},"token":"string"},"subcollections":{"apps":{"fields":{"deleted":"boolean","enabled":"boolean","fcmServerKey":"string","hidden":"boolean","name":"string"}},"branches":{"fields":{"appId":"string","branchGroupIds":"array","customBranchId":"string","deleted":"boolean","enabled":"boolean","gmt":"string","hidden":"boolean","lastUpdate":"number","location":{"address":"string","country":"string","latitude":"number","longitude":"number","name":"string","state":"string"},"name":"string"},"subcollections":{"branch_lines":{"fields":{"appointmentSettings":{"daysAhead":"string","enabled":"boolean"},"deleted":"boolean","localConf":{"chars":"string","color":"string"},"orderSettings":{"cancelWindow":"number","enabled":"boolean","operationRange":{"daysAhead":"string","howManyDays":"string"},"sets":{"slotCapacity":"string","timeDivision":"string","workingHours":{"endHour":"string","endMinute":"string","startHour":"string","startMinute":"string"}}},"printOnAPICreation":"boolean"}},"lines":{"fields":{"appointmentSettings":{"cancelWindow":"number","daysAhead":"number","enabled":"boolean","operationRange":{"daysAhead":"number","howManyDays":"number"},"sets":{"tardes":{"slotCapacity":"number","timeDivision":"number","weekDays":"array","workingHours":{"endHour":"number","endMinute":"number","startHour":"number","startMinute":"number"}}}},"deleted":"boolean","enabled":"boolean","id":"string","lastUpdate":"number","localConf":{"chars":"string","color":"string","markInTransitActivity":"boolean"},"markInTransitActivity":"boolean","orderSettings":{"cancelWindow":"number","enabled":"boolean","operationRange":{"daysAhead":"number","howManyDays":"number"},"reservationExpiration":"number","sets":{"1":{"slotCapacity":"number","timeDivision":"number","weekDays":{},"workingHours":{"endHour":"number","endMinute":"number","startHour":"number","startMinute":"number"}},"SET":{"slotCapacity":"number","timeDivision":"number","weekDays":"array","workingHours":{"endHour":"number","endMinute":"number","startHour":"number","startMinute":"number"}},"slotCapacity":"number","timeDivision":"number","todo el día":{"slotCapacity":"number","timeDivision":"number","weekDays":"array","workingHours":{"endHour":"number","endMinute":"number","startHour":"number","startMinute":"number"}},"Todo el día":{"slotCapacity":"number","timeDivision":"number","weekDays":"array","workingHours":{"endHour":"number","endMinute":"number","startHour":"number","startMinute":"number"}}}},"printOnAPICreation":"boolean","printOnApiCreation":"boolean","sequence":{"lastEvent":"number","lastNumber":"number"}},"subcollections":{"appointments":{"fields":{"0":{"appointmentSlotIdx":"number","calledBy":{"email":"string","id":"string","name":"string"},"createdBy":{"email":"string","id":"string","name":"string"},"customer":{"docId":"string","docType":"string","docTypeId":"string","infoLength":"number","lastName":"string","minimumInfo":"boolean","name":"string"},"details":"string","duration":"number","issueDate":"number","mobileId":"string","name":"string","status":"string","ticketId":"string"},"appointmentSet":"string","utcDueDate":"number"}},"orders":{"fields":{"allOrders":"array","waitingOrders":"array"},"subcollections":{"detailed":{"fields":{"createdBy":{"email":"string","id":"string","name":"string"},"customer":{"docId":"string","docType":"string","docTypeId":"string","lastName":"string","name":"string","phoneNumbers":"array"},"customFields":{"exito":{"carnes":"array"}},"details":"string","issueDate":"number","status":"string"}}}},"printers":{"fields":{"branchHub":"boolean","companyHub":"boolean","enabled":"boolean"}},"screens":{"fields":{"enabled":"boolean"}},"stats":{"fields":{"autodumped":"number","canceled":"number","dumped":"number","finished":"number","inTransitTickets":"number","inTransitTime":"number","lastInTransitTime":"number","lastServeTime":"number","lastWaitTime":"number","maxInTransitTime":"number","maxServeTime":"number","maxWaitTime":"number","minInTransitTime":"number","minServeTime":"number","minWaitTime":"number","reused":"number","served":"number","serveTime":"number","servingTickets":"number","successfullyServed":"number","successfullyServeTime":"number","tickets":"number","waitingTickets":"number","waitTime":"number"},"subcollections":{"byDay":{"fields":{"autodumped":"number","docId":"number","dumped":"number","finished":"number","maxServeTime":"number","maxWaitTime":"number","minServeTime":"number","minWaitTime":"number","served":"number","serveTime":"number","successfullyServed":"number","successfullyServeTime":"number","tickets":"number","unsuccessfullyServed":"number","unsuccessfullyServeTime":"number","waitTime":"number"}},"byHour":{"fields":{"autodumped":"number","canceled":"number","docId":"number","dumped":"number","finished":"number","maxServeTime":"number","maxWaitTime":"number","minServeTime":"number","minWaitTime":"number","reused":"number","served":"number","serveTime":"number","successfullyServed":"number","tickets":"number","waitTime":"number"}}}}}},"printers":{"fields":{"companyHub":"boolean","deleted":"boolean","enabled":"boolean","hidden":"boolean","interface":"string","name":"string","status":"string","type":"string"}},"realtime":{"fields":{"action":"string","issueDate":"number","placement":{"branch":{"gmt":"string","id":"string","name":"string","twentyfourSevenService":{}},"lines":"array","slot":{"displayName":"string","id":"string","name":"string"},"slotGroup":{"id":"string","name":"string"}},"user":{"firstName":"string","id":"string","lastName":"string"}}},"screens":{"fields":{"deleted":"boolean","enabled":"boolean","fcm":"boolean","hidden":"boolean","lastUpdate":"number","name":"string","token":"string"},"subcollections":{"events":{"fields":{"issueDate":"number","lineId":"string","slotDisplayName":"string","ticketId":"string","ticketName":"string"}}}},"slotGroups":{"fields":{"deleted":"boolean","enabled":"boolean","hidden":"boolean","name":"string"}},"slots":{"fields":{"deleted":"boolean","displayName":"string","enabled":"boolean","hidden":"boolean","lastUpdate":"number","lastUser":{"firstName":"string","id":"string","lastName":"string"},"lines":"array","name":"string","slotGroupId":"string","slotType":"string","status":"string","user":{"firstName":"string","id":"number","lastName":"string"}},"subcollections":{"lines":{"fields":{"enabled":"boolean"}}}},"stats":{"fields":{"autodumped":"number","canceled":"number","dumped":"number","finished":"number","inTransitTickets":"number","inTransitTime":"number","maxInTransitTime":"number","maxServeTime":"number","maxWaitTime":"number","minInTransitTime":"number","minServeTime":"number","minWaitTime":"number","reused":"number","served":"number","serveTime":"number","servingTickets":"number","successfullyServed":"number","successfullyServeTime":"number","tickets":"number","waitingTickets":"number","waitTime":"number"},"subcollections":{"byDay":{"fields":{"autodumped":"number","docId":"number","dumped":"number","finished":"number","maxServeTime":"number","maxWaitTime":"number","minServeTime":"number","minWaitTime":"number","served":"number","serveTime":"number","successfullyServed":"number","successfullyServeTime":"number","tickets":"number","unsuccessfullyServed":"number","unsuccessfullyServeTime":"number","waitTime":"number"}},"byHour":{"fields":{"autodumped":"number","canceled":"number","docId":"number","dumped":"number","finished":"number","maxServeTime":"number","maxWaitTime":"number","minServeTime":"number","minWaitTime":"number","reused":"number","served":"number","serveTime":"number","successfullyServed":"number","tickets":"number","waitTime":"number"}},"detailedByDay":{"fields":{"json":"string"}}}},"tactiles":{"fields":{"enabled":"boolean"}},"touchScreens":{"fields":{"bgImg":"string","deleted":"boolean","enabled":"boolean","hidden":"boolean","name":"string","sequence":"array","similarTo":"string"},"subcollections":{"lines":{"fields":{"enabled":"boolean"}}}}}},"branchGroups":{"fields":{"deleted":"boolean","enabled":"boolean","hidden":"boolean","name":"string"}},"customerHistory":{"fields":{"orders":{"2019-09-04T19:00:00.000Z_1567621559946":{"branchId":"string","dayOrderId":"string","lineId":"string"},"2019-09-04T19:00:00.000Z_1567621663604":{"branchId":"string","dayOrderId":"string","lineId":"string"}}}},"customers":{"fields":{"docId":"string","docType":"string","docTypeId":"string"}},"lines":{"fields":{"appointmentSettings":{"daysAhead":"string","enabled":"boolean"},"chars":"string","color":"string","deleted":"boolean","enabled":"boolean","hidden":"boolean","lastUpdate":"number","line":"string","localConf":{"chars":"string","color":"string"},"name":"string","orderSettings":{"cancelWindow":"number","enabled":"boolean","operationRange":{"daysAhead":"string","howManyDays":"string"},"sets":{"slotCapacity":"string","timeDivision":"string","workingHours":{"endHour":"string","endMinute":"string","startHour":"string","startMinute":"string"}}},"printOnAPICreation":"boolean"}},"tickets":{"fields":{"activity":{"0":{"endDate":"number","lineId":"string","lineName":"string","name":"string","startDate":"number"},"1":{"endDate":"number","lineId":"string","lineName":"string","name":"string","slotRef":"string","startDate":"number","userId":"string"}},"branchId":"string","branchName":"string","createdBy":{"email":"string","id":"string","name":"string"},"currentActivity":"number","currentLineId":"string","currentLineName":"string","details":"string","issueDate":"number","lastEventDate":"number","lineBranchCustomMsg":"string","lineName":"string","name":"string","origin":"string","startLineId":"string","startLineName":"string","status":"string"},"subcollections":{"activity":{"fields":{"endDate":"number","lineId":"string","name":"string","startDate":"number"}}}},"touchScreens":{"fields":{"deleted":"boolean","enabled":"boolean","hidden":"boolean","name":"string"},"subcollections":{"lines":{"fields":{"enabled":"boolean"}}}}}},"customerDocTypes":{"fields":{"key":"string","name":"string","shortName":"string"}},"ownCustomers":{"fields":{"docNumber":"string","docType":"string","email":"string","lastName":"string","mobileId":"string","mobileToken":"string","name":"string"}},"ownMobiles":{"fields":{"appName":"string","deviceId":"string","pushToken":"string"}},"roles":{"fields":{"companyId":"string","deleted":"boolean","description":"string","enabled":"boolean","ep":"string","hidden":"boolean","isFullAdmin":"boolean","lastUpdate":"number","name":"string","profile":"string","rules":{"create":"array","delete":"array","read":"array","update":"array"}}},"sessions":{"fields":{"company":{"id":"string","name":"string"},"companyId":"string","issueDate":"number","placement":{"branch":{"gmt":"string","id":"string","name":"string"}},"ref":"string","userId":"string"}},"users":{"fields":{"creationDate":"number","docId":"string","docType":"string","docTypeId":"string","lastName":"string","name":"string","phoneNumbers":"array"}}}');
//let savedDBMap = JSON.parse('{"ownCustomers":{"subcollections":{"tickets":{"fields":{"branchName":"string","startLineId":"string","ownCustomerId":"string","status":"string","details":"string","name":"string","activity":{"0":{"name":"string","lineName":"string","startDate":"number","lineId":"string"}},"createdBy":{"email":"string","name":"string","id":"string"},"customer":{"name":"string","docId":"string","docType":"string","docTypeId":"string","lastName":"string"},"currentLineName":"string","currentActivity":"number","customerId":"string","issueDate":"number","lastEventDate":"number","lineBranchCustomMsg":"string","companyId":"string","origin":"string","currentLineId":"string","appId":"string","startLineName":"string","branchId":"string"}}},"fields":{"docNumber":"string","docType":"string","email":"string","name":"string","mobileToken":"string","mobileId":"string","lastName":"string"}},"sessions":{"fields":{"userId":"string","issueDate":"number","ref":"string","companyId":"string","company":{"id":"string","name":"string"},"placement":{"branch":{"id":"string","name":"string","gmt":"string"}}}},"ownMobiles":{"fields":{"deviceId":"string","appName":"string","pushToken":"string"}},"companies":{"subcollections":{"touchScreens":{"subcollections":{"lines":{"fields":{"enabled":"boolean"}}},"fields":{"name":"string","enabled":"boolean","deleted":"boolean","hidden":"boolean"}},"mobiles":{"fields":{"appName":"string","pushToken":"string","deviceId":"string"}},"lines":{"fields":{"name":"string","deleted":"boolean","color":"string","enabled":"boolean","chars":"string","hidden":"boolean"}},"tickets":{"fields":{"issueDate":"number","lastEventDate":"number","lineBranchCustomMsg":"string","origin":"string","currentLineId":"string","startLineName":"string","branchId":"string","branchName":"string","startLineId":"string","status":"string","details":"string","name":"string","activity":{"0":{"lineId":"string","name":"string","lineName":"string","endDate":"number","startDate":"number"},"1":{"userId":"string","name":"string","lineId":"string","lineName":"string","endDate":"number","slotRef":"string","startDate":"number"}},"createdBy":{"id":"string","email":"string","name":"string"},"currentLineName":"string","lineName":"string","currentActivity":"number"},"subcollections":{"activity":{"fields":{"startDate":"number","lineId":"string","name":"string","endDate":"number"}}}},"customers":{"fields":{"docTypeId":"string","docId":"string","docType":"string"}},"apps":{"fields":{"deleted":"boolean","hidden":"boolean","name":"string","fcmServerKey":"string","enabled":"boolean"}},"printerHubEvents":{"fields":{"lineName":"string","printerInterface":"string","issueDate":"number","branchName":"string","printerName":"string","details":"string","printerId":"string","ticketIssueDate":"number","branchId":"string","ticketName":"string","lineId":"string"}},"branches":{"fields":{"name":"string","appId":"string","deleted":"boolean","branchGroupIds":"array","location":{"longitude":"number","name":"string","address":"string","latitude":"number"},"gmtSignedOffset":"number","enabled":"boolean","hidden":"boolean","gmt":"string","lastUpdate":"number","customBranchId":"string"},"subcollections":{"printers":{"fields":{"name":"string","deleted":"boolean","type":"string","interface":"string","enabled":"boolean","companyHub":"boolean","hidden":"boolean"}},"realtime":{"fields":{"placement":{"slot":{"name":"string","displayName":"string","id":"string"},"branch":{"id":"string","twentyfourSevenService":{},"name":"string","gmt":"string"},"slotGroup":{"id":"string","name":"string"}},"user":{"lastName":"string","firstName":"string","id":"string"},"action":"string","issueDate":"number"}},"touchScreens":{"subcollections":{"lines":{"fields":{"enabled":"boolean"}}},"fields":{"enabled":"boolean","hidden":"boolean","sequence":"array","name":"string","deleted":"boolean","similarTo":"string","docInput":{"required":"boolean","preselected":"string","ask":"boolean"},"nameInput":{"required":"boolean","ask":"boolean"}}},"screens":{"fields":{"enabled":"boolean","token":"string","hidden":"boolean","fcm":"boolean","name":"string","deleted":"boolean"}},"lines":{"subcollections":{"screens":{"fields":{"enabled":"boolean"}},"printers":{"fields":{"companyHub":"boolean","branchHub":"boolean","enabled":"boolean"}},"orders":{"subcollections":{"detailed":{"fields":{"issueDate":"number","status":"string","details":"string","createdBy":{"email":"string","name":"string","id":"string"},"customer":{"lastName":"string","phoneNumbers":"array","docId":"string","docType":"string","docTypeId":"string","name":"string"},"customFields":{"exito":{"carnes":"array"}}}}},"fields":{"allOrders":"array","waitingOrders":"array"}},"stats":{"subcollections":{"byHour":{"fields":{"maxWaitTime":"number","tickets":"number","finished":"number","docId":"number","minWaitTime":"number","canceled":"number","dumped":"number","successfullyServed":"number","serveTime":"number","maxServeTime":"number","reused":"number","autodumped":"number","minServeTime":"number","served":"number","waitTime":"number"}}},"fields":{"minServeTime":"number","served":"number","maxWaitTime":"number","tickets":"number","finished":"number","lastServeTime":"number","successfullyServeTime":"number","waitingTickets":"number","inTransitTickets":"number","maxServeTime":"number","reused":"number","autodumped":"number","maxInTransitTime":"number","waitTime":"number","lastInTransitTime":"number","inTransitTime":"number","minWaitTime":"number","lastWaitTime":"number","minInTransitTime":"number","canceled":"number","successfullyServed":"number","dumped":"number","servingTickets":"number","serveTime":"number"}}},"fields":{"appointmentSettings":{"enabled":"boolean","sets":{"tardes":{"weekDays":"array","timeDivision":"number","workingHours":{"endMinute":"number","startHour":"number","startMinute":"number","endHour":"number"},"slotCapacity":"number"}},"cancelWindow":"number","operationRange":{"daysAhead":"number","howManyDays":"number"}},"localConf":{"color":"string","chars":"string","markInTransitActivity":"boolean"},"enabled":"boolean","sequence":{"lastEvent":"number","lastNumber":"number"},"orderSettings":{"cancelWindow":"number","operationRange":{"daysAhead":"number","howManyDays":"number"},"enabled":"boolean","sets":{"Todo el día":{"weekDays":"array","timeDivision":"number","workingHours":{"endMinute":"number","startHour":"number","startMinute":"number","endHour":"number"},"slotCapacity":"number"}}},"printOnApiCreation":"boolean"}},"slotGroups":{"fields":{"name":"string","enabled":"boolean","deleted":"boolean","hidden":"boolean"}},"stats":{"subcollections":{"byHour":{"fields":{"maxServeTime":"number","reused":"number","autodumped":"number","minServeTime":"number","served":"number","waitTime":"number","maxWaitTime":"number","tickets":"number","finished":"number","docId":"number","minWaitTime":"number","canceled":"number","dumped":"number","successfullyServed":"number","serveTime":"number"}},"detailedByDay":{"fields":{"json":"string"}}},"fields":{"successfullyServeTime":"number","inTransitTime":"number","waitingTickets":"number","minWaitTime":"number","minInTransitTime":"number","canceled":"number","dumped":"number","successfullyServed":"number","serveTime":"number","servingTickets":"number","inTransitTickets":"number","maxServeTime":"number","reused":"number","autodumped":"number","minServeTime":"number","maxInTransitTime":"number","served":"number","waitTime":"number","tickets":"number","maxWaitTime":"number","finished":"number"}},"slots":{"fields":{"deleted":"boolean","lines":"array","displayName":"string","hidden":"boolean","slotType":"string","user":{"id":"string","lastName":"string","firstName":"string"},"type":"string","lastUser":{"id":"string","lastName":"string","firstName":"string","prefs":{}},"enabled":"boolean","slotGroupId":"string","status":"string","name":"string"},"subcollections":{"lines":{"fields":{"enabled":"boolean"}}}},"tactiles":{"fields":{"enabled":"boolean"}}}}},"fields":{"thirdPartyFrontendFolder":"string","name":"string","fcmServerKey":"string","thirdPartyStrings":{"customFields":{"tipo_de_carne":"string","tipo_de_corte":"string","tipo_de_empaque":"string"}},"deleted":"boolean","enabled":"boolean","token":"string"}},"users":{"subcollections":{"branches":{"fields":{"enabled":"boolean"}}},"fields":{"deleted":"boolean","roleId":"string","lastName":"string","hidden":"boolean","firstName":"string","docNumber":"string","branches":"array","docType":"string","companyId":"string","lastLogin":"string","description":"string","enabled":"boolean","password":"string","email":"string"}},"customerDocTypes":{"fields":{"shortName":"string","key":"string","name":"string"}},"roles":{"fields":{"hidden":"boolean","lastUpdate":"number","companyId":"string","profile":"string","ep":"string","name":"string","rules":{"create":"array","read":"array","delete":"array","update":"array"},"deleted":"boolean","isFullAdmin":"boolean","enabled":"boolean","description":"string"}}}');
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
        //console.log(p)
        obj1["states"][p] = "good";
        obj2["states"][p] = "good";
        if (obj2.hasOwnProperty(p) === false) {
            //console.log("missing")
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
                        //console.log("different")
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
            //console.log("missing")
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
        console.log(error);
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
        console.log(error);
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
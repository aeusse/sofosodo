
//- Por ejemplo para hacer una búsqueda en la DB hay que hacer esta validación
export function checkStringParam(paramName:string, p:any) {
    let errorWordCode:string
    let errorMsg:string
    switch (paramName) {
        case "name": {
            errorWordCode = "NAME"
            errorMsg = "el nombre"
            break
        }
        default: {
            return {
                success: false,
                code: "CHECK_NOT_IMPLEMENTED",
                msg: "Revisión no implementada"
            }
        }
    }
    if (p === undefined || typeof (p) !== "string" || p === "") {
        return {
            success: false,
            code: "INVALID_" + errorWordCode + "_IDENTIFIER",
            msg: "Identificador inválido para " + errorMsg.toLowerCase()
        }
    }
    return {
        success: true
    }
}
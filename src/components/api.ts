const googleSheetUrl = "https://script.google.com/macros/s/AKfycbz40_duA_vQhMcK5DIqwNlR8eGYRANMP-WFLW4JwyUpD_56wy77mh1Ew4dv1dJ9-vIggA/exec";

export async function saveGoogle(data:any){
    let payload = {
        "function":"createRow",
        "payload": data
    };
    let option = {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain',
        },
        body: JSON.stringify(payload),
    };
    let response = await fetch(googleSheetUrl, option);
    // let commits = await response.json();
return (response);
}

export async function loadGoogle(data:any){
    
    let payload = {
        "function":"getRowByName",
        "payload": data
    };
    let option = {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain',
        },

        body: JSON.stringify(payload),
    };
    
    let response = await fetch(googleSheetUrl, option);
    let commits = await response.json();
    
    console.log("commits: ",commits)
}

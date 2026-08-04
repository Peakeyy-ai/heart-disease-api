console.log("script.js loaded");

// Reset everything
function resetResult() {

    // Clear result
    document.getElementById("result").innerHTML = "";
    document.getElementById("result").className = "";

    // Reset risk display
    document.getElementById("risk-bar").style.width = "0%";
    document.getElementById("risk-text").innerHTML = "0%";

    // Clear recommendations
    document.getElementById("recommendation").innerHTML = "";

    // Hide loading
    document.getElementById("loading").style.display = "none";


    // Clear all input fields
    let inputs = document.querySelectorAll("input");


    inputs.forEach(function(input){

        input.value = "";

    });


    // Reset dropdowns
    let selects = document.querySelectorAll("select");

    selects.forEach(function(select){

        select.selectedIndex = 0;

    // Reset all select menus
let selects = document.querySelectorAll("select");

selects.forEach(function(select){

    select.selectedIndex = 0;

});

    // Clear patient summary
    document.getElementById("patient-details").innerHTML = "";

    // Clear AI risk analysis
    document.getElementById("risk-factors").innerHTML = "";

    // Clear risk category
    document.getElementById("risk-level").innerHTML = "";

    // Disable download button again
    document.getElementById("download-btn").disabled = true;

    });

}


// Predict
async function predict() {

    let requiredFields = [
        "age",
        "restbps",
        "chol",
        "thalach",
        "oldpeak"
    ];

    for (let field of requiredFields) {

        if (document.getElementById(field).value === "") {

            let result = document.getElementById("result");

            result.innerHTML =
            "⚠ Please fill in all required fields.";

            result.className = "danger";

            return;

        }

    }


    let data = {

        age: Number(document.getElementById("age").value),
        sex: Number(document.getElementById("sex").value),
        cp: Number(document.getElementById("cp").value),
        restbps: Number(document.getElementById("restbps").value),
        chol: Number(document.getElementById("chol").value),
        fbs: Number(document.getElementById("fbs").value),
        restecg: Number(document.getElementById("restecg").value),
        thalach: Number(document.getElementById("thalach").value),
        exang: Number(document.getElementById("exang").value),
        oldpeak: Number(document.getElementById("oldpeak").value),
        slope: Number(document.getElementById("slope").value),
        ca: Number(document.getElementById("ca").value),
        thal: Number(document.getElementById("thal").value)

    };


    let loading = document.getElementById("loading");

    let predictBtn = document.getElementById("predict-btn");

    loading.style.display = "flex";

    predictBtn.disabled = true;

    predictBtn.innerHTML =
    '<i class="fa-solid fa-spinner fa-spin"></i> Predicting...';

    try {

        let response = await fetch("https://heart-disease-api-8r93.onrender.com/predict", {

            method: "POST",

            headers: {

                "Content-Type":"application/json"

            },

            body:JSON.stringify(data)

        });


        let result = await response.json();

        let patientDetails = document.getElementById("patient-details");
        
        patientDetails.innerHTML =

        "👤 Age: " + data.age + "<br>" +

        "⚥ Sex: " + (data.sex == 1 ? "Male" : "Female") + "<br>" +

        "❤️ Chest Pain Type: " +

        (data.cp == 0 ? "Typical Angina" :

        data.cp == 1 ? "Atypical Angina" :

        data.cp == 2 ? "Non-anginal Pain" :

        "Asymptomatic")

        + "<br>" +

        "🩸 Blood Pressure: " + data.restbps + " mmHg (" +

        (data.restbps < 120 ? "Normal" :

        data.restbps < 140 ? "Elevated" :

        "High")

        + ")<br>" +

        "🧪 Cholesterol: " + data.chol + " mg/dL (" +

        (data.chol < 200 ? "Desirable" :

        data.chol < 240 ? "Borderline High" :

        "High")

        + ")<br>" +
        
        "💓 Maximum Heart Rate: " + data.thalach + " bpm";

        
        loading.style.display = "none";

        predictBtn.disabled = false;

        predictBtn.innerHTML =
        '<i class="fa-solid fa-brain"></i> Predict';

        console.log(result);

        let probability = Number(result.risk_probability);

        console.log(result);
        console.log("Probability =", probability);

        let resultBox = document.getElementById("result");

        let riskBar = document.getElementById("risk-bar");

        let gauge = document.querySelector(".gauge");

        let riskText = document.getElementById("risk-text");

        let riskFactors = document.getElementById("risk-factors");

        let riskLevel = document.getElementById("risk-level");

        let recommendation = document.getElementById("recommendation");

        let downloadBtn = document.getElementById("download-btn");

        



        riskBar.style.width = probability + "%";

        riskText.innerHTML = probability.toFixed(2) + "%";

        riskFactors.innerHTML = "";

if(data.age >= 55){

riskFactors.innerHTML +=
"Age is a cardiovascular risk factor.<br>";

}

if(data.chol >= 240){

riskFactors.innerHTML +=
"High cholesterol level detected.<br>";

}

if(data.restbps >= 140){

riskFactors.innerHTML +=
"High blood pressure detected.<br>";

}

if(data.thalach < 120){

riskFactors.innerHTML +=
"Lower maximum heart rate response detected.<br>";

}

if(riskFactors.innerHTML === ""){

riskFactors.innerHTML =
"No major risk indicators detected from provided values.";

}

        if(probability < 40){

    riskLevel.innerHTML =
    "🟢 Low Risk";

}

else if(probability < 70){

    riskLevel.innerHTML =
    "🟠 Moderate Risk";

}

else{

    riskLevel.innerHTML =
    "🔴 High Risk";

}

        let degrees = probability * 3.6;

let color = "#22c55e";

if(probability >= 40){

    color = "#f59e0b";

}

if(probability >= 70){

    color = "#ef4444";

}

if(gauge){

    let currentDegree = 0;

let animation = setInterval(() => {

    if(currentDegree >= degrees){

        clearInterval(animation);

    }
    else{

        currentDegree += 2;

        gauge.style.background =
        `conic-gradient(${color} ${currentDegree}deg,#e5e7eb ${currentDegree}deg)`;

    }

}, 10);
}



        if(probability < 40){

            riskBar.style.background = "#22c55e";

        }

        else if(probability < 70){

            riskBar.style.background = "#f59e0b";

        }

        else{

            riskBar.style.background = "#ef4444";

        }



    if(result.prediction === "Heart Disease detected"){

    resultBox.className = "danger";

    resultBox.innerHTML =

    "❤️ <b>Heart Disease Risk Detected</b><br><br>" +

    "Estimated Risk: <b>" +

    probability.toFixed(2) +

    "%</b>";


    recommendation.innerHTML =

    "<h3>🤖 AI Recommendation</h3>" +

    "<p>⚠ Consult a cardiologist.</p>" +

    "<p>💊 Continue prescribed medication.</p>" +

    "<p>🥗 Reduce saturated fat and salt intake.</p>" +

    "<p>🚶 Exercise regularly after medical advice.</p>" +

    "<p>❤️ Monitor blood pressure and cholesterol.</p>";


    downloadBtn.disabled = false;

    riskFactors.innerHTML = "";

if(Number(data.age) >= 55){

    riskFactors.innerHTML +=
    "🔴 Age is a significant cardiovascular risk factor.<br>";

}

if(Number(data.chol) >= 240){

    riskFactors.innerHTML +=
    "🔴 High cholesterol level may increase heart disease risk.<br>";

}

if(Number(data.restbps) >= 140){

    riskFactors.innerHTML +=
    "🔴 Elevated blood pressure detected.<br>";

}

if(Number(data.thalach) < 120){

    riskFactors.innerHTML +=
    "🟠 Lower maximum heart rate response considered.<br>";

}

if(Number(data.oldpeak) > 2){

    riskFactors.innerHTML +=
    "🟠 Exercise-related heart stress indicator detected.<br>";

}



}

else{

    resultBox.className = "success";

    resultBox.innerHTML =

    "💚 <b>No Heart Disease Detected</b><br><br>" +

    "Estimated Risk: <b>" +

    probability.toFixed(2) +

    "%</b>";


    recommendation.innerHTML =

    "<h3>🤖 AI Recommendation</h3>" +

    "<p>✅ Maintain a healthy balanced diet.</p>" +

    "<p>🏃 Exercise at least 150 minutes per week.</p>" +

    "<p>🩺 Attend regular medical checkups.</p>" +

    "<p>🚭 Avoid smoking.</p>" +

    "<p>😊 Maintain a healthy body weight.</p>";


    downloadBtn.disabled = false;

let historyBody = document.getElementById("history-body");

let row = historyBody.insertRow();

row.insertCell(0).innerHTML = new Date().toLocaleTimeString();

row.insertCell(1).innerHTML = data.age;

row.insertCell(2).innerHTML = probability.toFixed(2) + "%";

row.insertCell(3).innerHTML =
result.prediction === "Heart Disease detected"
? "❤️ Heart Disease"
: "💚 No Heart Disease";

}
    }

    catch(error){

        loading.style.display = "none";

        predictBtn.disabled = false;

        predictBtn.innerHTML =
        '<i class="fa-solid fa-brain"></i> Predict';

        console.log(error);

        document.getElementById("result").className="danger";

        document.getElementById("result").innerHTML=

        "❌ Unable to connect to the prediction server.";

    }

}

async function downloadReport() {

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    const date = new Date().toLocaleString();

    const prediction =
    result.prediction === "Heart Disease detected"
    ? "Heart Disease Detected"
    : "No Heart Disease Detected";

    const recommendation =
    document.getElementById("recommendation").innerText;

    const analysis =
    document.getElementById("risk-factors").innerText;

    const risk =
    document.getElementById("risk-text").innerText;

    const riskLevel =
    document.getElementById("risk-level").innerText;


    // Title

    doc.setFont("helvetica","bold");

    doc.setFontSize(20);

    doc.text(
        "Heart Disease AI Assessment Report",
        20,
        20
    );


    doc.setFontSize(11);

    doc.setFont("helvetica","normal");

    doc.text(
        "Generated: " + date,
        20,
        30
    );


    doc.line(20,35,190,35);



    // Patient Information

    doc.setFont("helvetica","bold");

    doc.text(
        "Patient Summary",
        20,
        50
    );


    doc.setFont("helvetica","normal");


    doc.text(
        "Age: " +
        document.getElementById("age").value,
        20,
        60
    );


    doc.text(
        "Sex: " +
        (document.getElementById("sex").value == "1"
        ? "Male"
        : "Female"),
        20,
        68
    );


    doc.text(
        "Blood Pressure: " +
        document.getElementById("restbps").value +
        " mmHg",
        20,
        76
    );


    doc.text(
        "Cholesterol: " +
        document.getElementById("chol").value +
        " mg/dL",
        20,
        84
    );


    doc.text(
        "Maximum Heart Rate: " +
        document.getElementById("thalach").value +
        " bpm",
        20,
        92
    );


    doc.line(20,100,190,100);



    // Prediction

    doc.setFont("helvetica","bold");

    doc.text(
    prediction.replace(/[^\x00-\x7F]/g, ""),
    20,
    125
    );
    


    doc.setFont("helvetica","normal");


    doc.text(
        prediction,
        20,
        125
    );


    doc.text(
        "Risk Probability: " + risk,
        20,
        135
    );


    doc.text(
    "Risk Category: " + riskLevel.replace(/[^\x00-\x7F]/g, ""),
    20,
    145
    );



    doc.line(20,155,190,155);



    // AI Analysis

    doc.setFont("helvetica","bold");

    doc.text(
        "AI Risk Analysis",
        20,
        170
    );


    doc.setFont("helvetica","normal");


    let analysisLines =
    doc.splitTextToSize(
        analysis,
        170
    );


    doc.text(
        analysisLines,
        20,
        180
    );



    // Recommendations

    doc.setFont("helvetica","bold");

    doc.text(
        "Recommendations",
        20,
        220
    );


    doc.setFont("helvetica","normal");


    let cleanRecommendation =
    recommendation.replace(/[^\x00-\x7F]/g, "");

    let recommendationLines =
    doc.splitTextToSize(
    cleanRecommendation,
    170
);


    doc.text(
        recommendationLines,
        20,
        230
    );



    // Disclaimer

    doc.setFontSize(9);

    doc.text(
        "Disclaimer: This AI tool is for educational support only and does not replace professional medical advice.",
        20,
        280
    );


    doc.save(
        "Heart_Disease_AI_Report.pdf"
    );

}

async function checkAPI() {

    try {

        const response = await fetch("https://heart-disease-api-8r93.onrender.com");

        if (response.ok) {

            document.getElementById("api-status").innerHTML = "API Connected";

        } else {

            document.getElementById("api-status").innerHTML = "API Offline";

        }

    }

    catch {

        document.getElementById("api-status").innerHTML = "API Offline";

    }

}

checkAPI();
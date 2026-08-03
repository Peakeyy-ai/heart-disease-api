from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import joblib
import pandas as pd
import logging

logging.basicConfig(level=logging.INFO)

app=FastAPI(
    title="Heart Disease Prediction API",
    description="An AI API that predicts heart disease risk using a decision tree model.",
    version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
model=joblib.load("decision_tree_model.pkl")
model_columns=joblib.load("model_columns.pkl")

class Patient(BaseModel):
    age:float=Field(gt=0, le=120)
    sex:float=Field(ge=0, le=1)
    cp:float=Field(ge=0, le=3)
    restbps:float=Field(gt=0, le=250)
    chol:float=Field(gt=0, le=700)
    fbs:float=Field(ge=0, le=1)
    restecg:float=Field(ge=0, le=2)
    thalach:float=Field(gt=0, le=250)
    exang:float=Field(ge=0, le=1)
    oldpeak:float=Field(ge=0, le=10)
    slope:float=Field(ge=0, le=2)
    ca:float=Field(ge=0, le=4)
    thal:float=Field(ge=0, le=3)


@app.get("/")
def home():
    return{"message": "hello paul"}

@app.post("/predict")
def predict(patient: Patient):
    if patient.age< 18:
        raise HTTPException(status_code=400,
                           detail="Age must be 18 or above for this prediction")

    try:
        df=pd.DataFrame([patient.dict()])
        
        df=pd.get_dummies(df, columns=['cp','restecg','slope','thal'])
        
        df=df.reindex(columns=model_columns, fill_value=0)
        
        prediction=model.predict(df)
        probability=model.predict_proba(df)

        risk_probability=probability[0][1]
        
        return{"prediction": "Heart Disease detected" if prediction[0]==1 else "No Heart Disease", 
               "risk_probability": round(float(risk_probability*100), 2)}

    except Exception as e:
        logging.error(str(e))
        raise HTTPException(status_code=500,
                            detail="Prediction failed")


    
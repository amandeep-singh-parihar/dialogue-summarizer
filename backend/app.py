import re
import torch
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import T5ForConditionalGeneration, T5Tokenizer

MODEL_NAME = "dexp01/dialogue-summarizer-t5-small"

app = FastAPI(
    title="Dialogue Summarizer API",
    description="API to summarize the dialogue",
    version="1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


if torch.backends.mps.is_available():
    device = torch.device("mps")
elif torch.cuda.is_available():
    device = torch.device("cuda")
else:
    device = torch.device("cpu")

model = T5ForConditionalGeneration.from_pretrained(MODEL_NAME)
tokenizer = T5Tokenizer.from_pretrained(MODEL_NAME)
model.to(device)


def clean_data(data):
    data = re.sub(r"\r\n", " ", data)
    data = re.sub(r"\s+", " ", data)
    data = re.sub(r"<.*?>", " ", data)
    data = data.strip().lower()
    return data


def summarize_dialouge(input_text: str) -> str:
    cleaned_text = clean_data(input_text)

    inputs = tokenizer(
        cleaned_text,
        padding="max_length",
        max_length=512,
        truncation=True,
        return_tensors="pt",
    )

    input_ids = inputs["input_ids"].to(device)
    attention_mask = inputs["attention_mask"].to(device)

    targets = model.generate(
        input_ids=input_ids,
        attention_mask=attention_mask,
        max_length=150,
        num_beams=4,
        early_stopping=True,
    )

    summary_text = tokenizer.decode(
        targets[0],
        skip_special_tokens=True,
    )

    return summary_text


class TextRequest(BaseModel):
    text: str


# API endpoints


@app.get("/")
def root():
    return {"message": "Welcome to the Dialogue Summarizer API"}


@app.post("/summarize")
def summarize_text(request: TextRequest):
    try:
        summary = summarize_dialouge(request.text)
        return {"summary": summary}
    except Exception as e:
        return {"error": str(e)}

import torch
from pydantic import BaseModel
from typing import List
from transformers import AutoModelForSpeechSeq2Seq, AutoProcessor, pipeline

# LLM
import requests
import json
class LlmRun:
    def __init__(self, url: str, system_promt: str = "You are a helpful assistant."):
        self.llm_url = url
        self.system_prompt = system_promt
        self.headers = {
            "Content-Type": "application/json"
        }

    def run(self, prompt, max_tokens=100, temperature=0.1, schema=None):
        data = {
            "prompt": [prompt],
            "apply_chat_template": True,
            "system_prompt": self.system_prompt,
            "max_tokens": max_tokens,
            "n": 1,
            "schema": schema,
            "temperature": temperature
        }

        response = requests.post(self.llm_url + '/generate', data=json.dumps(data), headers=self.headers)
        return response.text

class Competency(BaseModel):
    name: str
    proficiency: float

class Interview(BaseModel):
    competencies: List[Competency]

def preprocess_str(s: str):
    return s.strip().strip('(').strip(')').strip().strip("'").strip().strip('"').strip("'").replace("\n", '').replace('\\n', '').replace('\\', '')

class InterviewToText:
  def __init__(self):
    self._init_whisper_model()
    schema = Interview.schema()
    self.schema_json = json.dumps(schema, indent=2)
    self.llm_model = LlmRun(
        url="https://vk-devinsight-case-backup.olymp.innopolis.university"
    )

  def _init_whisper_model(self):
    device = "cuda:0" if torch.cuda.is_available() else "cpu"
    torch_dtype = torch.float16 if torch.cuda.is_available() else torch.float32

    model_id = "openai/whisper-large-v3-turbo"

    model = AutoModelForSpeechSeq2Seq.from_pretrained(
        model_id, torch_dtype=torch_dtype, low_cpu_mem_usage=True, use_safetensors=True
    )
    model.to(device)

    processor = AutoProcessor.from_pretrained(model_id)

    self.pipe = pipeline(
        "automatic-speech-recognition",
        model=model,
        tokenizer=processor.tokenizer,
        feature_extractor=processor.feature_extractor,
        torch_dtype=torch_dtype,
        device=device,
        return_timestamps=True
    )

  def run(self, audio_file_path: str, vacancy_dict: dict):
    audio_transcription = self.pipe(audio_file_path)
    competencies = ""
    chunk_size = 10000
    for i in range(0, len(audio_transcription['text']), chunk_size):
        # print(audio_transcription)
        prompt = f"""Используй Context это текст интервью на вакансию - {vacancy_dict['position']}, чтобы разложить на competencies - это технологии, которые он упоминал, где name - название технологии, proficiency - насколько хорошо он знает эту технологию от 0 до 1.
        Context:
        {audio_transcription['text'][i:i + chunk_size]}
        Отвечай без объяснений.
        """
        
        text = self.llm_model.run(prompt=prompt, max_tokens=500, temperature=0.5, schema=self.schema_json)
        competencies += text
    promt = f"""Сделай суммаризацию по данным о компетенциям, где даны технологии и их качество. Убери, если там есть НЕ технологии. Мне нужно вывести в таком же формате, как я тебе даю.
    Context: {competencies}
    Отвечай без объяснений. Отвечай только в формате списка json. Иначе штраф 10000000 долларов.
    """
    # final_competency = json.loads(preprocess_str(self.llm_model.run(promt, max_tokens=350, temperature=0.3)))
    final_competency = self.llm_model.run(promt, max_tokens=350, temperature=0.3, schema=self.schema_json)
    return final_competency

speech_model = InterviewToText()
def get_mp3_analyze(mp3_path: str, position: str) -> list[dict]:
    result = speech_model.run(mp3_path, {"position": position})
    return result
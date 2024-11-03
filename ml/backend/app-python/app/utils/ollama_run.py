# from langchain.llms import Ollama
# from langchain.chains import LLMChain
# from langchain.prompts import PromptTemplate
# 
# class LlamaRun:
#     def __init__(self, template: str, ollama_url, model_name="llama3.1:8b", temperature=0):
#         self.prompt = PromptTemplate.from_template(template)
#         self.model = Ollama(base_url=ollama_url,
#                             model=model_name,
#                             temperature=temperature)
# 
#     def run(self, context):
#         llm_chain = LLMChain(prompt=self.prompt,
#                              llm=self.model)
#         generated = llm_chain.run(context=context)
#         return generated
import requests
import json


class LlamaRun:
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

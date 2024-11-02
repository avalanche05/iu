from langchain.llms import Ollama
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate

class LlamaRun:
    def __init__(self, template: str, ollama_url, model_name="llama3.1:8b", temperature=0):
        self.prompt = PromptTemplate.from_template(template)
        self.model = Ollama(base_url=ollama_url,
                            model=model_name,
                            temperature=temperature)

    def run(self, **kwargs):
        llm_chain = LLMChain(prompt=self.prompt,
                             llm=self.model)
        generated = llm_chain.run(kwargs)
        return generated
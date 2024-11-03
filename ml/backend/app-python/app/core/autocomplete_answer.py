from app.utils.ollama_run import LlamaRun

def main(data):
    model = LlamaRun(
        url="https://vk-devinsight-case.olymp.innopolis.university",
        system_promt="You're an HR from big tech company."
    )

    prompt = f"""Ты HR, тебе надо дать обратную связь кандидату по Message type.
            Имя канидата: {data['nickname']}.
            Грейд кандидата: {data['grade']}.
            Message type - {data['target_action']}. Explanation what message consists of:

                - accept: поздороваться с кандидатом, похвалить отличные навыки кандидата, которые подходят нашей компании. сказать что ждём дальнейшей совместной работы;

                - reject: поблагодари кандидата, вежливо сделай отказ. 

        Отвечай кратко."""
    text = model.run(prompt=prompt, max_tokens=500, temperature=0.5)

    return text


if __name__ == "__main__":
    result = main(data={"name": "Иван Иванов", "position": "Middle python develover", "target_action": "candidateAccepted"})
    print(result)

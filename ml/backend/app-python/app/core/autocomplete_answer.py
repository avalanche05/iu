from app.utils.ollama_run import LlamaRun

def main(data):
    model = LlamaRun(
        url="https://vk-devinsight-case.olymp.innopolis.university",
        system_promt="You're an HR from big tech company."
    )

    prompt = f"""Ты HR, тебе надо дать обратную связь кандидату по Message type.
            Имя канидата: {data['name']}.
            Название вакансии: {data['position']}.
            Message type - {data['target_action']}. Explanation what message consists of:

                - pending: поздороваться с кандидатом, сказать что ждём на интервью;

                - hrAccepted: сказать что интервью будет в [ДАТА] и [ВРЕМЯ], дату и время можно в интерфейсе поменять на сайте;

                - interviewerAccepted: поздравить с пройденными интервью, спросить про зарплатные ожидания;

                - offer: напомнить кандидату, что он должен направить письмо с принятием предложения на работу;

                - candidateAccepted:  отсылаем поздравительное письмо: добро пожаловать в команду.

                - reject: поблагодари кандидата, сделать отказ.

            Вот пример для 'pending': 'Привет, [name]! Мы ждём вас на интервью на позицию [position]. До скорой встречи!'

        Отвечай кратко."""
    text = model.run(prompt=prompt, max_tokens=500, temperature=0.5)

    return text


# if __name__ == "__main__":
#     result = main(data={"name": "Иван Иванов", "position": "Middle python develover", "target_action": "candidateAccepted"})
#     print(result)

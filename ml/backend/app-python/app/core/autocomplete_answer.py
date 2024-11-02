from app.utils.ollama_run import LlamaRun


def main(data):
    template = """You are an HR. Write message to the candidate in a conversational style (for a messenger) using the following context:
        Candidate name: {name}.
        Vacancy name: {position}.
        Message type - {target_action}. Explanation what message consists of:

            - pending: поздороваться с кандидатом, сказать что ждём на интервью;

            - hrAccepted: сказать что интервью будет в [ДАТА] и [ВРЕМЯ], дату и время можно в интерфейсе поменять на сайте;

            - interviewerAccepted: поздравить с пройденными интервью, спросить про зарплатные ожидания;

            - offer: напомнить кандидату, что он должен направить письмо с принятием предложения на работу;

            - candidateAccepted:  отсылаем поздравительное письмо: добро пожаловать в команду.
            
            - reject: поблагодари кандидата, сделать отказ.

    Example for 'pending': 'Привет, [name]! Мы ждём вас на интервью на позицию [position]. До скорой встречи!'

    Answer briefly, without explanation, only in Russian. only write text that would say HR. Do not give your own comments. write the text for {target_action} type only."""
    model = LlamaRun(
        template=template,
        ollama_url="https://useful-kite-settled.ngrok-free.app",
        model_name="llama3.1:8b",
        temperature=0
    )
    text = model.run(name=data['name'],
                     position=data['position'],
                     target_action=data['target_action'])

    return text
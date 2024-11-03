import json


def get_competencies_dict(competencies: list[dict]) -> dict:
    competencies_dict = {}
    for competence in competencies:
        competencies_dict[competence.get("name")] = competence.get("proficiency")

    return competencies_dict


def transfer_to_percents(normed_sq_root_diff: float) -> float:
    return normed_sq_root_diff * 100


def calculate_compliance_metric(candidate_competencies: list[dict], vacancy_competencies: list[dict]) -> float:
    candidate_competencies_dict = get_competencies_dict(candidate_competencies)
    normed_sq_root_diff = 0

    for vacancy_competence in vacancy_competencies:
        vacancy_competence_name, vacancy_competence_proficiency = \
            vacancy_competence.get("name"), vacancy_competence.get("proficiency")

        candidate_competence_proficiency = 0
        if vacancy_competence_name in candidate_competencies_dict:
            candidate_competence_proficiency = candidate_competencies_dict.get(vacancy_competence_name)

        normed_sq_root_diff += candidate_competence_proficiency / vacancy_competence_proficiency

    return normed_sq_root_diff / len(vacancy_competencies)


def calculate_compliance_metric_percents(candidate_competencies_str: str, vacancy_competencies_str: str) -> float:
    try:
        candidate_competencies = json.loads(candidate_competencies_str)
        vacancy_competencies = json.loads(vacancy_competencies_str)
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON input: {e}")

    normed_sq_root_diff = calculate_compliance_metric(candidate_competencies, vacancy_competencies)
    return transfer_to_percents(normed_sq_root_diff)
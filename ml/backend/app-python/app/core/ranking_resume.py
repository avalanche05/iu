# import torch
# from sentence_transformers import SentenceTransformer
# from app.utils.model import SiameseFFN

# class Rank:
#     def __init__(self, weights: str):
#         device="cpu"
#         self.model = SiameseFFN(in_size=768).to(device)
#         self.model.load_state_dict(torch.load(weights, map_location=torch.device('cpu')))
#         self.model.eval()

#         self.encoder = SentenceTransformer('intfloat/multilingual-e5-base')
#         self.encoder.eval()

#     def _get_candidate_emb(self, candidates: list):
#         embeddings = []
#         for candidate in candidates:
#             if isinstance(candidate["skills"], str):
#                 embedding = self.encoder.encode(
#                     candidate["summary"][:400] + "[SEQ]" + " ".join(candidate["skills"])[:100])
#             else:
#                 embedding = self.encoder.encode(candidate["summary"])
#             embeddings.append(embedding.tolist())

#         return embeddings

#     def _get_vacancy_emb(self, vacancy_dict):
#         embedding = self.encoder.encode(
#             vacancy_dict["description"][:400] + "[SEQ]" + " ".join(vacancy_dict["skills"])[:100])
#         return embedding.tolist()

#     def rank(self, vacancy_dict, candidates):
#         vacancy_embedding = torch.tensor(self._get_vacancy_emb(vacancy_dict))
#         resume_embeddings = self._get_candidate_emb(candidates)

#         probs_positive = []
#         for emb in resume_embeddings:
#             with torch.no_grad():
#                 logits = self.model(vacancy_embedding.unsqueeze(0), torch.tensor(emb).unsqueeze(0))
#             probs = torch.softmax(logits, dim=1)
#             probs_positive.append(probs[:, 1].to('cpu').detach().numpy())

#         return probs_positive
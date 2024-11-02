import torch
from torch import nn

class SiameseFFN(nn.Module):
    def __init__(self, in_size, hid_size=128, out_size=2, dropout_rate=0.5):
        super(SiameseFFN, self).__init__()
        self.in_size = in_size
        self.hid_size = hid_size
        self.out_size = out_size
        self.dropout_rate = dropout_rate

        self.fc11 = nn.Linear(in_size, hid_size)
        self.fc12 = nn.Linear(hid_size, hid_size // 2)
        self.fc13 = nn.Linear(hid_size // 2, hid_size)

        self.fc21 = nn.Linear(in_size, hid_size)
        self.fc22 = nn.Linear(hid_size, hid_size // 2)
        self.fc23 = nn.Linear(hid_size // 2, hid_size)

        self.relu = nn.ReLU()
        self.dropout = nn.Dropout(dropout_rate)
        self.bn1 = nn.BatchNorm1d(hid_size)
        self.bn2 = nn.BatchNorm1d(hid_size // 2)

        self.classifier = nn.Linear(in_features=hid_size * 3, out_features=out_size)

    def forward(self, inp_emb1, inp_emb2):
        out11 = self.bn1(self.relu(self.fc11(inp_emb1)))
        out11 = self.dropout(out11)
        out12 = self.bn2(self.relu(self.fc12(out11)))
        out12 = self.dropout(out12)
        out13 = self.fc13(out12)

        out21 = self.bn1(self.relu(self.fc21(inp_emb2)))
        out21 = self.dropout(out21)
        out22 = self.bn2(self.relu(self.fc22(out21)))
        out22 = self.dropout(out22)
        out23 = self.fc23(out22)

        x = torch.cat([out13, out23, torch.abs(out13 - out23)], dim=1)
        x = self.classifier(x)
        return x
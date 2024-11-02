import pymupdf
from docx import Document


class ReadResume:
    def __init__(self, file_path: str):
        self.file_path = file_path
        self.file_type = None
        if file_path.endswith(("pdf")):
            self.file_type = "PDF"
        elif file_path.endswith(("docx", "doc")):
            self.file_type = "DOC"

        assert self.file_type, "reading only in pdf or docx files"

    def _extarct_text_from_doc(self):
        document = Document(self.file_path)
        text = ""

        for paragraph in document.paragraphs:
            text += paragraph.text + "\n"

        return text

    def _extract_text_from_pdf(self):
        document = pymupdf.open(self.file_path)
        text = ""

        for page_num in range(len(document)):
            page = document.load_page(page_num)
            text += page.get_text()

        return text

    def extract_text(self):
        if self.file_type == "PDF":
            return self._extract_text_from_pdf()
        if self.file_type == "DOC":
            return self._extarct_text_from_doc()
import pymupdf
# from docx import Document
import easyocr


class ReadResume:
    def __init__(self, file_path: str):
        self.file_path = file_path
        self.file_type = None
        if file_path.endswith(("pdf")):
            self.file_type = "PDF"
            self.reader = easyocr.Reader(['ru','en'])
        elif file_path.endswith(("docx", "doc")):
            self.file_type = "DOC"

        assert self.file_type, "reading only in pdf or docx files"

    # def _extarct_text_from_doc(self):
    #     document = Document(self.file_path)
    #     text = ""
    #
    #     for paragraph in document.paragraphs:
    #         text += paragraph.text + "\n"
    #
    #     return text

    def _extract_text_from_pdf(self):
        document = pymupdf.open(self.file_path)
        text = ""

        for page_num in range(len(document)):
            page = document.load_page(page_num)
            if page.get_text():
                text += page.get_text()
            else:
                pix = page.get_pixmap()
                image_path = f"page_{page_num}.png"
                pix.save(image_path)
                result = self.reader.readtext(image_path)
                for (bbox, txt, conf) in result:
                    text += txt + "\n"

        return text

    def extract_text(self):
        if self.file_type == "PDF":
            return self._extract_text_from_pdf()
        # if self.file_type == "DOC":
        #     return self._extarct_text_from_doc()
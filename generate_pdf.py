import os
import re
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether, Preformatted
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#7A8A7E"))
        
        # Header (on pages after the first)
        if self._pageNumber > 1:
            self.drawString(54, letter[1] - 36, "Ekansh Homoeopathic Clinic – Product Requirements Document (PRD v1.0.0)")
            self.setStrokeColor(colors.HexColor("#E9E4D7"))
            self.setLineWidth(0.5)
            self.line(54, letter[1] - 42, letter[0] - 54, letter[1] - 42)
            
        # Footer
        self.setStrokeColor(colors.HexColor("#E9E4D7"))
        self.setLineWidth(0.5)
        self.line(54, 45, letter[0] - 54, 45)
        
        self.drawString(54, 32, "Confidential & Proprietary – For Internal & Review Purposes Only")
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(letter[0] - 54, 32, page_str)
        self.restoreState()

def clean_inline_md(text):
    text = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    text = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', text)
    text = re.sub(r'\*(.*?)\*', r'<i>\1</i>', text)
    text = re.sub(r'`(.*?)`', r'<font name="Courier" color="#355D48">\1</font>', text)
    text = re.sub(r'\$(.*?)\$', r'\1', text)
    return text

def generate_pdf():
    pdf_filename = "docs/PRD_Ekansh_Homoeopathic_Clinic.pdf"
    doc = SimpleDocTemplate(
        pdf_filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )
    
    styles = getSampleStyleSheet()
    
    # Custom Brand Colors
    forest_green = colors.HexColor("#355D48")
    sage_green = colors.HexColor("#A3B18A")
    warm_ivory = colors.HexColor("#F6F5EF")
    soft_beige = colors.HexColor("#E9E4D7")
    muted_gold = colors.HexColor("#B9A77D")
    charcoal = colors.HexColor("#303832")
    light_green = colors.HexColor("#F0F4F1")
    
    # Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=22,
        leading=26,
        textColor=forest_green,
        spaceAfter=4
    )
    
    subtitle_style = ParagraphStyle(
        'DocSub',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=11,
        leading=15,
        textColor=charcoal,
        spaceAfter=14
    )
    
    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=forest_green,
        spaceBefore=12,
        spaceAfter=6,
        keepWithNext=True
    )
    
    h3_style = ParagraphStyle(
        'SectionH3',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=14,
        textColor=charcoal,
        spaceBefore=8,
        spaceAfter=3,
        keepWithNext=True
    )
    
    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12.5,
        textColor=charcoal,
        spaceAfter=4
    )
    
    bullet_style = ParagraphStyle(
        'BulletText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=charcoal,
        leftIndent=14,
        spaceAfter=2
    )
    
    callout_style = ParagraphStyle(
        'CalloutText',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8.5,
        leading=12,
        textColor=forest_green
    )
    
    table_cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=10.5,
        textColor=charcoal
    )
    
    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=10.5,
        textColor=colors.white
    )
    
    code_style = ParagraphStyle(
        'CodeStyle',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=7,
        leading=9,
        textColor=charcoal
    )
    
    story = []
    
    # Title & Subtitle
    story.append(Paragraph("Product Requirements Document (PRD)", title_style))
    story.append(Paragraph("Project: Ekansh Homoeopathic Clinic – Official Digital Web Platform & Patient Consultation Portal", subtitle_style))
    
    # Metadata Table
    meta_rows = [
        [Paragraph("<b>Clinic Name</b>", table_cell_style), Paragraph("Ekansh Homoeopathic Clinic", table_cell_style)],
        [Paragraph("<b>Location</b>", table_cell_style), Paragraph("Rajsamand, Rajasthan, India", table_cell_style)],
        [Paragraph("<b>Practitioner Structure</b>", table_cell_style), Paragraph("Solo Homeopathic Practitioner (Individual Practice)", table_cell_style)],
        [Paragraph("<b>Target Domain</b>", table_cell_style), Paragraph("https://ekanshclinic.in (Placeholder / Subject to Final Registration)", table_cell_style)],
        [Paragraph("<b>Document Version</b>", table_cell_style), Paragraph("1.0.0 (Baseline Architecture & Production Prototype Release)", table_cell_style)],
        [Paragraph("<b>Document Status</b>", table_cell_style), Paragraph("Approved for Frontend Prototype & Architecture Review", table_cell_style)],
        [Paragraph("<b>Lead Roles</b>", table_cell_style), Paragraph("Senior Product Manager, Lead Solutions Architect, UI/UX Principal, Senior Frontend Engineer", table_cell_style)],
        [Paragraph("<b>Technology Stack</b>", table_cell_style), Paragraph("Astro v5 / Static Architecture, Modern CSS3 Tokens, Vanilla JavaScript, Semantic HTML5, Schema.org JSON-LD", table_cell_style)]
    ]
    meta_table = Table(meta_rows, colWidths=[140, 364])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), warm_ivory),
        ('BACKGROUND', (1, 0), (1, -1), colors.white),
        ('TEXTCOLOR', (0, 0), (-1, -1), charcoal),
        ('BOX', (0, 0), (-1, -1), 0.5, soft_beige),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, soft_beige),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 12))
    
    # Read Markdown content
    with open('docs/PRD_Ekansh_Homoeopathic_Clinic.md', 'r', encoding='utf-8') as f:
        md_text = f.read()
        
    lines = md_text.split('\n')
    skip_until_exec = True
    in_table = False
    table_lines = []
    in_code = False
    code_lines = []
    
    for line in lines:
        if line.startswith('## 1. Executive Summary'):
            skip_until_exec = False
            
        if skip_until_exec:
            continue
            
        # Code block
        if line.strip().startswith('```'):
            if in_code:
                in_code = False
                c_text = '\n'.join(code_lines)
                code_p = Preformatted(c_text, code_style)
                code_table = Table([[code_p]], colWidths=[504])
                code_table.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, -1), warm_ivory),
                    ('BOX', (0, 0), (-1, -1), 0.5, soft_beige),
                    ('TOPPADDING', (0, 0), (-1, -1), 6),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
                    ('LEFTPADDING', (0, 0), (-1, -1), 8),
                    ('RIGHTPADDING', (0, 0), (-1, -1), 8),
                ]))
                story.append(code_table)
                story.append(Spacer(1, 6))
                code_lines = []
            else:
                in_code = True
                code_lines = []
            continue
            
        if in_code:
            code_lines.append(line)
            continue
            
        # Tables
        if line.strip().startswith('|'):
            if not in_table:
                in_table = True
                table_lines = [line]
            else:
                table_lines.append(line)
            continue
        else:
            if in_table:
                in_table = False
                parsed_rows = []
                for tline in table_lines:
                    if re.match(r'^\|[\s\-:]+\|$', tline.strip()):
                        continue
                    cells = [c.strip() for c in tline.strip().split('|')[1:-1]]
                    if cells:
                        parsed_rows.append(cells)
                if parsed_rows:
                    num_cols = max(len(r) for r in parsed_rows)
                    # compute column widths
                    col_width = 504 / num_cols
                    table_data = []
                    for r_idx, r_cells in enumerate(parsed_rows):
                        is_head = (r_idx == 0)
                        row_p = []
                        for cell_val in r_cells:
                            c_clean = clean_inline_md(cell_val)
                            p = Paragraph(c_clean, table_header_style if is_head else table_cell_style)
                            row_p.append(p)
                        while len(row_p) < num_cols:
                            row_p.append(Paragraph("", table_cell_style))
                        table_data.append(row_p)
                        
                    t = Table(table_data, colWidths=[col_width]*num_cols)
                    t_style = [
                        ('BACKGROUND', (0, 0), (-1, 0), forest_green),
                        ('BOX', (0, 0), (-1, -1), 0.5, soft_beige),
                        ('INNERGRID', (0, 0), (-1, -1), 0.5, soft_beige),
                        ('TOPPADDING', (0, 0), (-1, -1), 4),
                        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
                        ('LEFTPADDING', (0, 0), (-1, -1), 5),
                        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
                    ]
                    for r_i in range(1, len(table_data)):
                        if r_i % 2 == 1:
                            t_style.append(('BACKGROUND', (0, r_i), (-1, r_i), warm_ivory))
                    t.setStyle(TableStyle(t_style))
                    story.append(t)
                    story.append(Spacer(1, 6))
                table_lines = []
                
        # Callouts
        if line.startswith('>'):
            clean_callout = clean_inline_md(line.lstrip('> ').strip())
            c_p = Paragraph(clean_callout, callout_style)
            c_tbl = Table([[c_p]], colWidths=[504])
            c_tbl.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, -1), light_green),
                ('BOX', (0, 0), (-1, -1), 1, sage_green),
                ('TOPPADDING', (0, 0), (-1, -1), 6),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
                ('LEFTPADDING', (0, 0), (-1, -1), 8),
                ('RIGHTPADDING', (0, 0), (-1, -1), 8),
            ]))
            story.append(c_tbl)
            story.append(Spacer(1, 6))
            continue
            
        # Headings
        if line.startswith('## '):
            h_text = clean_inline_md(line[3:].strip())
            story.append(Paragraph(h_text, h2_style))
            continue
        elif line.startswith('### '):
            h_text = clean_inline_md(line[4:].strip())
            story.append(Paragraph(h_text, h3_style))
            continue
        elif line.startswith('#### '):
            h_text = clean_inline_md(line[5:].strip())
            story.append(Paragraph(f"<b>{h_text}</b>", h3_style))
            continue
            
        # Bullet list
        if line.strip().startswith('* ') or line.strip().startswith('- '):
            b_text = "&bull; " + clean_inline_md(line.strip()[2:].strip())
            story.append(Paragraph(b_text, bullet_style))
            continue
            
        # Numbered list
        num_m = re.match(r'^(\d+)\.\s+(.*)', line.strip())
        if num_m:
            n_text = f"{num_m.group(1)}. " + clean_inline_md(num_m.group(2).strip())
            story.append(Paragraph(n_text, bullet_style))
            continue
            
        # Regular paragraph
        if line.strip():
            p_text = clean_inline_md(line.strip())
            story.append(Paragraph(p_text, body_style))
            
    doc.build(story, canvasmaker=NumberedCanvas)
    print("PDF successfully generated at docs/PRD_Ekansh_Homoeopathic_Clinic.pdf")

if __name__ == "__main__":
    generate_pdf()

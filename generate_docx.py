import os
import re
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'''
        <w:tcMar {nsdecls("w")}>
            <w:top w:w="{top}" w:type="dxa"/>
            <w:bottom w:w="{bottom}" w:type="dxa"/>
            <w:left w:w="{left}" w:type="dxa"/>
            <w:right w:w="{right}" w:type="dxa"/>
        </w:tcMar>
    ''')
    tcPr.append(tcMar)

def generate_docx():
    doc = docx.Document()
    
    # Page setup - 0.75 in margins
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(0.75)
        section.bottom_margin = Inches(0.75)
        section.left_margin = Inches(0.75)
        section.right_margin = Inches(0.75)
        
    forest_green = RGBColor(53, 93, 72)     # #355D48
    charcoal = RGBColor(48, 56, 50)         # #303832
    muted_gold = RGBColor(185, 167, 125)    # #B9A77D
    
    # Title
    p_title = doc.add_paragraph()
    p_title.paragraph_format.space_before = Pt(0)
    p_title.paragraph_format.space_after = Pt(4)
    run_title = p_title.add_run("Product Requirements Document (PRD)")
    run_title.font.name = "Georgia"
    run_title.font.size = Pt(24)
    run_title.font.bold = True
    run_title.font.color.rgb = forest_green
    
    # Subtitle
    p_sub = doc.add_paragraph()
    p_sub.paragraph_format.space_before = Pt(0)
    p_sub.paragraph_format.space_after = Pt(14)
    run_sub = p_sub.add_run("Project: Ekansh Homoeopathic Clinic – Official Digital Web Platform & Patient Consultation Portal")
    run_sub.font.name = "Georgia"
    run_sub.font.size = Pt(13)
    run_sub.font.color.rgb = charcoal
    run_sub.font.italic = True
    
    # Meta table
    meta_data = [
        ("Clinic Name", "Ekansh Homoeopathic Clinic"),
        ("Location", "Rajsamand, Rajasthan, India"),
        ("Practitioner Structure", "Solo Homeopathic Practitioner (Individual Practice)"),
        ("Target Domain", "https://ekanshclinic.in (Placeholder / Subject to Final Registration)"),
        ("Document Version", "1.0.0 (Baseline Architecture & Production Prototype Release)"),
        ("Document Status", "Approved for Frontend Prototype & Architecture Review"),
        ("Lead Roles", "Senior Product Manager, Lead Solutions Architect, UI/UX Principal, Senior Frontend Engineer"),
        ("Technology Stack", "Astro v5 / Static Architecture, Modern CSS3 Tokens, Vanilla JavaScript, Semantic HTML5, Schema.org JSON-LD")
    ]
    
    meta_table = doc.add_table(rows=len(meta_data), cols=2)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_table.autofit = False
    
    for i, (k, v) in enumerate(meta_data):
        row = meta_table.rows[i]
        c0, c1 = row.cells[0], row.cells[1]
        c0.width = Inches(2.2)
        c1.width = Inches(4.8)
        
        set_cell_background(c0, "F6F5EF")
        set_cell_background(c1, "FFFFFF")
        set_cell_margins(c0, 100, 100, 150, 150)
        set_cell_margins(c1, 100, 100, 150, 150)
        
        p0 = c0.paragraphs[0]
        p0.paragraph_format.space_after = Pt(2)
        r0 = p0.add_run(k)
        r0.font.bold = True
        r0.font.size = Pt(9.5)
        r0.font.color.rgb = forest_green
        
        p1 = c1.paragraphs[0]
        p1.paragraph_format.space_after = Pt(2)
        r1 = p1.add_run(v)
        r1.font.size = Pt(9.5)
        r1.font.color.rgb = charcoal
        
    doc.add_paragraph().paragraph_format.space_after = Pt(12)
    
    # Read Markdown content to parse sections
    with open('docs/PRD_Ekansh_Homoeopathic_Clinic.md', 'r', encoding='utf-8') as f:
        md_text = f.read()
        
    lines = md_text.split('\n')
    
    # Skip frontmatter / header table since we already added it
    skip_until_exec = True
    in_table = False
    table_lines = []
    in_code_block = False
    code_lines = []
    
    for line in lines:
        if line.startswith('## 1. Executive Summary'):
            skip_until_exec = False
            
        if skip_until_exec:
            continue
            
        # Code block handling
        if line.strip().startswith('```'):
            if in_code_block:
                in_code_block = False
                code_text = '\n'.join(code_lines)
                cp = doc.add_paragraph()
                cp.paragraph_format.space_before = Pt(4)
                cp.paragraph_format.space_after = Pt(8)
                c_run = cp.add_run(code_text)
                c_run.font.name = "Consolas"
                c_run.font.size = Pt(8.5)
                c_run.font.color.rgb = RGBColor(48, 56, 50)
                code_lines = []
            else:
                in_code_block = True
                code_lines = []
            continue
            
        if in_code_block:
            code_lines.append(line)
            continue
            
        # Table handling
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
                # Parse markdown table
                parsed_rows = []
                for tline in table_lines:
                    if re.match(r'^\|[\s\-:]+\|$', tline.strip()):
                        continue # separator row
                    cells = [c.strip() for c in tline.strip().split('|')[1:-1]]
                    if cells:
                        parsed_rows.append(cells)
                if parsed_rows:
                    num_cols = max(len(r) for r in parsed_rows)
                    t = doc.add_table(rows=len(parsed_rows), cols=num_cols)
                    t.alignment = WD_TABLE_ALIGNMENT.CENTER
                    for r_idx, r_cells in enumerate(parsed_rows):
                        row = t.rows[r_idx]
                        is_header = (r_idx == 0)
                        for c_idx, cell_value in enumerate(r_cells):
                            if c_idx < len(row.cells):
                                cell = row.cells[c_idx]
                                bg_color = "355D48" if is_header else ("F6F5EF" if r_idx % 2 == 1 else "FFFFFF")
                                set_cell_background(cell, bg_color)
                                set_cell_margins(cell, 80, 80, 120, 120)
                                cp = cell.paragraphs[0]
                                cp.paragraph_format.space_after = Pt(2)
                                text_clean = re.sub(r'\*\*(.*?)\*\*', r'\1', cell_value)
                                text_clean = re.sub(r'\*(.*?)\*', r'\1', text_clean)
                                text_clean = re.sub(r'`(.*?)`', r'\1', text_clean)
                                text_clean = re.sub(r'\$(.*?)\$', r'\1', text_clean)
                                cr = cp.add_run(text_clean)
                                cr.font.size = Pt(8.5)
                                if is_header:
                                    cr.font.bold = True
                                    cr.font.color.rgb = RGBColor(255, 255, 255)
                                else:
                                    cr.font.color.rgb = charcoal
                                    if '**' in cell_value:
                                        cr.font.bold = True
                    doc.add_paragraph().paragraph_format.space_after = Pt(8)
                table_lines = []
                
        # Callouts (> NOTE: ...)
        if line.startswith('>'):
            callout_text = line.lstrip('> ').strip()
            tbl = doc.add_table(rows=1, cols=1)
            tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
            cell = tbl.rows[0].cells[0]
            cell.width = Inches(7.0)
            set_cell_background(cell, "F6F5EF")
            set_cell_margins(cell, 120, 120, 160, 160)
            cp = cell.paragraphs[0]
            cp.paragraph_format.space_after = Pt(2)
            clean_callout = re.sub(r'\*\*(.*?)\*\*', r'\1', callout_text)
            r = cp.add_run(clean_callout)
            r.font.name = "Georgia"
            r.font.size = Pt(9.5)
            r.font.italic = True
            r.font.color.rgb = forest_green
            doc.add_paragraph().paragraph_format.space_after = Pt(6)
            continue
            
        # Headings
        if line.startswith('## '):
            h2 = doc.add_paragraph()
            h2.paragraph_format.space_before = Pt(16)
            h2.paragraph_format.space_after = Pt(6)
            h2_text = line[3:].strip()
            r = h2.add_run(h2_text)
            r.font.name = "Georgia"
            r.font.size = Pt(15)
            r.font.bold = True
            r.font.color.rgb = forest_green
            continue
        elif line.startswith('### '):
            h3 = doc.add_paragraph()
            h3.paragraph_format.space_before = Pt(12)
            h3.paragraph_format.space_after = Pt(4)
            h3_text = line[4:].strip()
            r = h3.add_run(h3_text)
            r.font.name = "Georgia"
            r.font.size = Pt(12)
            r.font.bold = True
            r.font.color.rgb = charcoal
            continue
        elif line.startswith('#### '):
            h4 = doc.add_paragraph()
            h4.paragraph_format.space_before = Pt(8)
            h4.paragraph_format.space_after = Pt(2)
            h4_text = line[5:].strip()
            r = h4.add_run(h4_text)
            r.font.name = "Georgia"
            r.font.size = Pt(10.5)
            r.font.bold = True
            r.font.color.rgb = forest_green
            continue
            
        # Bullet points
        if line.strip().startswith('* ') or line.strip().startswith('- '):
            bp = doc.add_paragraph(style='List Bullet')
            bp.paragraph_format.space_before = Pt(1)
            bp.paragraph_format.space_after = Pt(2)
            bullet_text = line.strip()[2:].strip()
            # Simple bold parsing
            parts = re.split(r'(\*\*.*?\*\*)', bullet_text)
            for part in parts:
                if part.startswith('**') and part.endswith('**'):
                    r = bp.add_run(part[2:-2])
                    r.font.bold = True
                else:
                    clean_text = re.sub(r'`(.*?)`', r'\1', part)
                    clean_text = re.sub(r'\*(.*?)\*', r'\1', clean_text)
                    clean_text = re.sub(r'\$(.*?)\$', r'\1', clean_text)
                    r = bp.add_run(clean_text)
                r.font.name = "Calibri"
                r.font.size = Pt(10)
                r.font.color.rgb = charcoal
            continue
            
        # Numbered list
        num_match = re.match(r'^(\d+)\.\s+(.*)', line.strip())
        if num_match:
            np = doc.add_paragraph(style='List Number')
            np.paragraph_format.space_before = Pt(1)
            np.paragraph_format.space_after = Pt(2)
            n_text = num_match.group(2)
            parts = re.split(r'(\*\*.*?\*\*)', n_text)
            for part in parts:
                if part.startswith('**') and part.endswith('**'):
                    r = np.add_run(part[2:-2])
                    r.font.bold = True
                else:
                    clean_text = re.sub(r'`(.*?)`', r'\1', part)
                    clean_text = re.sub(r'\*(.*?)\*', r'\1', clean_text)
                    clean_text = re.sub(r'\$(.*?)\$', r'\1', clean_text)
                    r = np.add_run(clean_text)
                r.font.name = "Calibri"
                r.font.size = Pt(10)
                r.font.color.rgb = charcoal
            continue
            
        # Regular paragraph
        if line.strip():
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(2)
            p.paragraph_format.space_after = Pt(4)
            parts = re.split(r'(\*\*.*?\*\*)', line.strip())
            for part in parts:
                if part.startswith('**') and part.endswith('**'):
                    r = p.add_run(part[2:-2])
                    r.font.bold = True
                else:
                    clean_text = re.sub(r'`(.*?)`', r'\1', part)
                    clean_text = re.sub(r'\*(.*?)\*', r'\1', clean_text)
                    clean_text = re.sub(r'\$(.*?)\$', r'\1', clean_text)
                    r = p.add_run(clean_text)
                r.font.name = "Calibri"
                r.font.size = Pt(10)
                r.font.color.rgb = charcoal
                
    doc.save('docs/PRD_Ekansh_Homoeopathic_Clinic.docx')
    print("DOCX successfully generated at docs/PRD_Ekansh_Homoeopathic_Clinic.docx")

if __name__ == "__main__":
    generate_docx()

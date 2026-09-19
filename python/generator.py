import os
import json
import xml.etree.ElementTree as ET
from PIL import Image
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR

from font_manager import FontManager, FontManagerError

def ensure_supported_image(image_path):
    if not image_path or not isinstance(image_path, str) or not os.path.exists(image_path):
        return None
    ext = os.path.splitext(image_path)[1].lower()
    supported = ['.png', '.jpg', '.jpeg', '.bmp', '.gif', '.tiff', '.wmf']
    if ext in supported:
        return image_path
    
    try:
        converted_path = os.path.splitext(image_path)[0] + "_converted.png"
        if os.path.exists(converted_path):
            return converted_path
        with Image.open(image_path) as img:
            img.convert("RGBA").save(converted_path, "PNG")
        print(f"[PPTGenerator] Converted unsupported image '{image_path}' -> '{converted_path}'")
        return converted_path
    except Exception as e:
        print(f"[PPTGenerator] Error converting image '{image_path}': {e}")
        return image_path

from pptx.oxml.xmlchemy import OxmlElement

def apply_font_to_run(run, font_name):
    if not run or not font_name:
        return
    run.font.name = font_name
    try:
        rPr = run._r.get_or_add_rPr()
        ns = "http://schemas.openxmlformats.org/drawingml/2006/main"
        for tag in ['latin', 'ea', 'cs', 'sym']:
            elem = rPr.find(f'{{{ns}}}{tag}')
            if elem is None:
                elem = OxmlElement(f'a:{tag}')
                rPr.append(elem)
            elem.set('typeface', font_name)
    except Exception as e:
        print(f"[apply_font_to_run] Warning setting XML typeface: {e}")

def hex_to_rgb(hex_str):
    if not hex_str or not isinstance(hex_str, str):
        return None
    clean = hex_str.strip().lstrip('#')
    if len(clean) == 3:
        clean = ''.join([c * 2 for c in clean])
    if len(clean) != 6:
        return None
    try:
        return RGBColor(*(int(clean[i:i+2], 16) for i in (0, 2, 4)))
    except Exception:
        return None

def clear_shape_fill(shape):
    try:
        if hasattr(shape, "fill"):
            shape.fill.background()
    except Exception:
        pass

class PPTGenerator:
    def __init__(self, template_path=None):
        if not template_path:
            templates_dir = "templates"
            final_path = os.path.join(templates_dir, "final.pptx")
            if os.path.exists(final_path):
                template_path = final_path
            else:
                pptx_files = [f for f in os.listdir(templates_dir) if f.endswith('.pptx')]
                if not pptx_files:
                    raise FileNotFoundError(f"No .pptx template found in '{templates_dir}' directory.")
                template_path = os.path.join(templates_dir, pptx_files[0])

        print(f"[PPTGenerator] Loading master template: {template_path}")
        self.prs = Presentation(template_path)
        self.font_manager = FontManager()

    def apply_font_to_text_shape(self, shape, font_family):
        if not shape or not shape.has_text_frame or not font_family:
            return
        for paragraph in shape.text_frame.paragraphs:
            for run in paragraph.runs:
                apply_font_to_run(run, font_family)

    def replace_text_in_shape(self, shape, replacements):
        if not shape.has_text_frame:
            return
        
        for paragraph in shape.text_frame.paragraphs:
            full_text = paragraph.text
            original_text = full_text
            for key, val in replacements.items():
                if key in full_text:
                    full_text = full_text.replace(key, str(val))
            
            if original_text != full_text:
                if len(paragraph.runs) > 0:
                    paragraph.runs[0].text = full_text
                    for r in paragraph.runs[1:]:
                        r.text = ""
                else:
                    paragraph.text = full_text

    def replace_all_text(self, replacements):
        for slide in self.prs.slides:
            for shape in slide.shapes:
                if shape.has_text_frame:
                    self.replace_text_in_shape(shape, replacements)
                elif shape.has_table:
                    for row in shape.table.rows:
                        for cell in row.cells:
                            self.replace_text_in_shape(cell, replacements)

    def process_slide_1_logo(self, logo_image_path):
        slide1 = self.prs.slides[0]
        target_shape = None
        for shape in slide1.shapes:
            if shape.name == "Freeform 4" or (shape.left.inches > 5.5 and shape.top.inches < 2.0 and shape.width.inches > 4.0):
                target_shape = shape
                break

        if target_shape:
            logo_image_path = ensure_supported_image(logo_image_path)
            if logo_image_path and os.path.exists(logo_image_path):
                left, top, width, height = target_shape.left, target_shape.top, target_shape.width, target_shape.height
                sp = target_shape._element
                sp.getparent().remove(sp)
                slide1.shapes.add_picture(logo_image_path, left, top, width, height)
                print("[PPTGenerator] Slide 1 Brand Logo replaced cleanly.")
            else:
                # If no logo uploaded, clear placeholder fill/text so demo logo does not appear
                if target_shape.has_text_frame:
                    target_shape.text_frame.clear()

    def process_colors_slide_2(self, colors):
        slide2 = self.prs.slides[1]
        pri_hex = str(colors.get("primary", "") or "").strip()
        sec_hex = str(colors.get("secondary", "") or "").strip()

        # Handle dynamic accent colors array
        raw_accents = colors.get("accentColors", [])
        if not raw_accents and colors.get("accent"):
            raw_accents = [colors.get("accent")]
        if not isinstance(raw_accents, list):
            raw_accents = [str(raw_accents)]

        acc_hex_list = [str(c).strip().upper() for c in raw_accents if c and str(c).strip()]
        # Strictly limit to 3 accent slots maximum
        acc_hex_list = acc_hex_list[:3]

        pri_rgb = hex_to_rgb(pri_hex) if pri_hex else None
        sec_rgb = hex_to_rgb(sec_hex) if sec_hex else None

        for shape in slide2.shapes:
            if shape.has_text_frame:
                txt = shape.text_frame.text
                if "PRIMARY COLOR" in txt:
                    shape.width = Inches(12.0)
                    shape.text_frame.word_wrap = False
                    if pri_hex:
                        shape.text_frame.text = f"PRIMARY COLOR  {pri_hex.upper()}"
                        if len(shape.text_frame.paragraphs) > 0 and len(shape.text_frame.paragraphs[0].runs) > 0:
                            shape.text_frame.paragraphs[0].runs[0].font.name = "Quicksand"
                            shape.text_frame.paragraphs[0].runs[0].font.size = Pt(32)
                            shape.text_frame.paragraphs[0].runs[0].font.color.rgb = RGBColor(244, 244, 244)
                    else:
                        shape.text_frame.clear()
                elif "SECONDARY COLOR" in txt:
                    shape.width = Inches(12.0)
                    shape.text_frame.word_wrap = False
                    if sec_hex:
                        shape.text_frame.text = f"SECONDARY COLOR  {sec_hex.upper()}"
                        if len(shape.text_frame.paragraphs) > 0 and len(shape.text_frame.paragraphs[0].runs) > 0:
                            shape.text_frame.paragraphs[0].runs[0].font.name = "Quicksand"
                            shape.text_frame.paragraphs[0].runs[0].font.size = Pt(32)
                            shape.text_frame.paragraphs[0].runs[0].font.color.rgb = RGBColor(244, 244, 244)
                    else:
                        shape.text_frame.clear()
                elif "ACCENT COLOR" in txt:
                    shape.width = Inches(12.0)
                    shape.text_frame.word_wrap = False
                    if acc_hex_list:
                        shape.text_frame.text = f"ACCENT COLOR  {'  '.join(acc_hex_list)}"
                        if len(shape.text_frame.paragraphs) > 0 and len(shape.text_frame.paragraphs[0].runs) > 0:
                            shape.text_frame.paragraphs[0].runs[0].font.name = "Quicksand"
                            shape.text_frame.paragraphs[0].runs[0].font.size = Pt(32)
                            shape.text_frame.paragraphs[0].runs[0].font.color.rgb = RGBColor(244, 244, 244)
                    else:
                        shape.text_frame.clear()

            # Primary Color Swatch (Group 2)
            if shape.name == "Group 2":
                for child in shape.shapes:
                    if "Freeform" in child.name and hasattr(child, "fill"):
                        if pri_rgb:
                            child.fill.solid()
                            child.fill.fore_color.rgb = pri_rgb
                        else:
                            clear_shape_fill(child)

            # Secondary Color Swatch (Group 10 & Group 13)
            elif shape.name in ["Group 10", "Group 13"]:
                for child in shape.shapes:
                    if "Freeform" in child.name and hasattr(child, "fill"):
                        if sec_rgb:
                            child.fill.solid()
                            child.fill.fore_color.rgb = sec_rgb
                        else:
                            clear_shape_fill(child)

            # Accent Color Swatches:
            # Slot 1 -> Group 17
            # Slot 2 -> Group 20
            # Slot 3 -> Group 23
            elif shape.name == "Group 17":
                acc_rgb_0 = hex_to_rgb(acc_hex_list[0]) if len(acc_hex_list) >= 1 else None
                for child in shape.shapes:
                    if "Freeform" in child.name and hasattr(child, "fill"):
                        if acc_rgb_0:
                            child.fill.solid()
                            child.fill.fore_color.rgb = acc_rgb_0
                        else:
                            clear_shape_fill(child)
            elif shape.name == "Group 20":
                acc_rgb_1 = hex_to_rgb(acc_hex_list[1]) if len(acc_hex_list) >= 2 else None
                for child in shape.shapes:
                    if "Freeform" in child.name and hasattr(child, "fill"):
                        if acc_rgb_1:
                            child.fill.solid()
                            child.fill.fore_color.rgb = acc_rgb_1
                        else:
                            clear_shape_fill(child)
            elif shape.name == "Group 23":
                acc_rgb_2 = hex_to_rgb(acc_hex_list[2]) if len(acc_hex_list) >= 3 else None
                for child in shape.shapes:
                    if "Freeform" in child.name and hasattr(child, "fill"):
                        if acc_rgb_2:
                            child.fill.solid()
                            child.fill.fore_color.rgb = acc_rgb_2
                        else:
                            clear_shape_fill(child)

    def process_typography_slide_3(self, typography, year_text=""):
        slide3 = self.prs.slides[2]

        font1 = str(typography.get("display", "") or "").strip()
        font2 = str(typography.get("secondary", "") or "").strip()
        font3 = str(typography.get("tertiary", "") or "").strip()
        font4 = str(typography.get("caption", "") or "").strip()

        font_mappings = [
            ("TextBox 13", font1),
            ("TextBox 20", font2),
            ("TextBox 25", font3),
            ("TextBox 39", font4),
        ]

        # Process Year Box (TextBox 11) on Slide 3
        for s in slide3.shapes:
            if s.has_text_frame and ("2027" in s.text_frame.text or s.name == "TextBox 11"):
                if year_text:
                    s.text_frame.text = year_text
                    if len(s.text_frame.paragraphs) > 0 and len(s.text_frame.paragraphs[0].runs) > 0:
                        s.text_frame.paragraphs[0].runs[0].font.name = "Quicksand"
                        s.text_frame.paragraphs[0].runs[0].font.size = Pt(18)
                        s.text_frame.paragraphs[0].runs[0].font.color.rgb = RGBColor(244, 244, 244)
                else:
                    s.text_frame.clear()

        for shape_name, font_name in font_mappings:
            target_shape = None
            for s in slide3.shapes:
                if s.name == shape_name:
                    target_shape = s
                    break

            if target_shape and target_shape.has_text_frame:
                tf = target_shape.text_frame
                tf.word_wrap = False
                if not font_name:
                    tf.clear()
                else:
                    if len(tf.paragraphs) == 0:
                        p = tf.add_paragraph()
                    else:
                        p = tf.paragraphs[0]
                        for extra_p in tf.paragraphs[1:]:
                            extra_p.text = ""

                    if len(p.runs) == 0:
                        r = p.add_run()
                    else:
                        r = p.runs[0]
                        for extra_r in p.runs[1:]:
                            extra_r.text = ""

                    r.text = font_name
                    r.font.color.rgb = RGBColor(244, 244, 244)

                    # Dynamic font-aware size scaling to prevent line wrapping or card overflow
                    length = len(font_name)
                    if length <= 8:
                        r.font.size = Pt(48)
                    elif length <= 14:
                        r.font.size = Pt(36)
                    elif length <= 20:
                        r.font.size = Pt(28)
                    else:
                        r.font.size = Pt(22)

                    apply_font_to_run(r, font_name)

    def process_editing_slide_4(self, editing):
        slide4 = self.prs.slides[3]
        raw_pacing = editing.get("pacing")
        styles = editing.get("styles", [])
        if not isinstance(styles, list):
            styles = [str(styles)]

        # 1. Update Pacing Marker Position
        marker_shape = None
        for s in slide4.shapes:
            if s.name == "Group 5":
                marker_shape = s
                break

        if marker_shape:
            if raw_pacing is not None and raw_pacing != "":
                try:
                    pacing = float(raw_pacing)
                    track_left = 0.66
                    track_width = 11.43
                    marker_width = 0.07
                    ratio = max(0.0, min(100.0, pacing)) / 100.0
                    new_left = track_left + (track_width - marker_width) * ratio
                    marker_shape.left = Inches(new_left)
                except Exception:
                    pass

        # 2. Populate Edit Vibe Boxes (Max 3, no hardcoded defaults)
        vibe_boxes = [
            ("TextBox 24", Inches(0.66), Inches(6.60), Inches(3.20), Inches(1.30)),
            ("TextBox 25", Inches(4.10), Inches(6.60), Inches(3.40), Inches(1.30)),
            ("TextBox 26", Inches(8.01), Inches(6.60), Inches(3.60), Inches(1.30)),
        ]

        for idx, (box_name, l, t, w, h) in enumerate(vibe_boxes):
            box_shape = None
            for s in slide4.shapes:
                if s.name == box_name:
                    box_shape = s
                    break

            if box_shape and box_shape.has_text_frame:
                box_shape.left = l
                box_shape.top = t
                box_shape.width = w
                box_shape.height = h

                tf = box_shape.text_frame
                tf.word_wrap = True
                tf.vertical_anchor = MSO_ANCHOR.MIDDLE
                tf.margin_left = Inches(0.1)
                tf.margin_right = Inches(0.1)
                tf.margin_top = Inches(0.1)
                tf.margin_bottom = Inches(0.1)
                tf.clear()

                item_text = str(styles[idx]).strip() if idx < len(styles) and styles[idx] else ""

                if item_text:
                    p = tf.paragraphs[0] if len(tf.paragraphs) > 0 else tf.add_paragraph()
                    p.alignment = PP_ALIGN.CENTER
                    r = p.add_run()
                    r.text = item_text
                    r.font.name = "Quicksand"
                    r.font.color.rgb = RGBColor(244, 244, 244)

                    if len(item_text) <= 18:
                        r.font.size = Pt(34)
                    elif len(item_text) <= 26:
                        r.font.size = Pt(28)
                    else:
                        r.font.size = Pt(22)

    def process_sidebar_text(self, shape, title1, value1, title2=None, value2=None):
        if not shape or not shape.has_text_frame:
            return

        shape.left = Inches(16.35)
        shape.top = Inches(1.79)
        shape.width = Inches(3.80)
        shape.height = Inches(7.50)

        tf = shape.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.1)
        tf.margin_right = Inches(0.1)
        tf.margin_top = Inches(0.1)
        tf.margin_bottom = Inches(0.1)
        tf.clear()

        has_sec1 = bool(value1 and str(value1).strip())
        has_sec2 = bool(title2 and value2 and str(value2).strip())

        if not has_sec1 and not has_sec2:
            return

        added_first = False
        if has_sec1:
            p0 = tf.paragraphs[0] if len(tf.paragraphs) > 0 else tf.add_paragraph()
            r0 = p0.add_run()
            r0.text = title1
            r0.font.name = "Quicksand"
            r0.font.bold = True
            r0.font.size = Pt(22)
            r0.font.color.rgb = RGBColor(244, 244, 244)

            p1 = tf.add_paragraph()
            p1.space_before = Pt(6)
            r1 = p1.add_run()
            r1.text = str(value1).strip()
            r1.font.name = "Quicksand"
            r1.font.bold = False
            r1.font.size = Pt(19)
            r1.font.color.rgb = RGBColor(244, 244, 244)
            added_first = True

        if has_sec2:
            if added_first:
                p_space = tf.add_paragraph()
                p_space.space_before = Pt(22)
                p2 = tf.add_paragraph()
            else:
                p2 = tf.paragraphs[0] if len(tf.paragraphs) > 0 else tf.add_paragraph()

            r2 = p2.add_run()
            r2.text = title2
            r2.font.name = "Quicksand"
            r2.font.bold = True
            r2.font.size = Pt(22)
            r2.font.color.rgb = RGBColor(244, 244, 244)

            p3 = tf.add_paragraph()
            p3.space_before = Pt(6)
            r3 = p3.add_run()
            r3.text = str(value2).strip()
            r3.font.name = "Quicksand"
            r3.font.bold = False
            r3.font.size = Pt(19)
            r3.font.color.rgb = RGBColor(244, 244, 244)

    def process_dynamic_photo_grid(self, slide, image_paths, area_left=0.58, area_top=1.60, area_width=14.50, area_height=8.00):
        # Remove ALL template placeholder image shapes in photo region whether images provided or not
        shapes_to_remove = []
        for shape in slide.shapes:
            if shape.left.inches >= area_left - 0.2 and shape.left.inches + shape.width.inches <= area_left + area_width + 0.5:
                if shape.top.inches >= area_top - 0.2 and "TextBox" not in shape.name:
                    shapes_to_remove.append(shape)

        for s in shapes_to_remove:
            try:
                sp = s._element
                sp.getparent().remove(sp)
            except Exception:
                pass

        if not image_paths or not isinstance(image_paths, list):
            return

        valid_imgs = [ensure_supported_image(p) for p in image_paths if p and os.path.exists(p)]
        valid_imgs = [p for p in valid_imgs if p and os.path.exists(p)]
        if not valid_imgs:
            return

        count = min(len(valid_imgs), 5)
        gap = Inches(0.2)
        total_w = Inches(area_width)
        total_h = Inches(area_height)
        start_l = Inches(area_left)
        start_t = Inches(area_top)

        if count == 1:
            w = Inches(7.5)
            h = total_h
            l = start_l + (total_w - w) / 2
            slide.shapes.add_picture(valid_imgs[0], l, start_t, w, h)
        elif count == 2:
            w = (total_w - gap) / 2
            h = total_h
            for i in range(2):
                l = start_l + i * (w + gap)
                slide.shapes.add_picture(valid_imgs[i], l, start_t, w, h)
        elif count == 3:
            w = (total_w - 2 * gap) / 3
            h = total_h
            for i in range(3):
                l = start_l + i * (w + gap)
                slide.shapes.add_picture(valid_imgs[i], l, start_t, w, h)
        elif count == 4:
            w = (total_w - gap) / 2
            h = (total_h - gap) / 2
            for i in range(4):
                row = i // 2
                col = i % 2
                l = start_l + col * (w + gap)
                t = start_t + row * (h + gap)
                slide.shapes.add_picture(valid_imgs[i], l, t, w, h)
        elif count == 5:
            w3 = (total_w - 2 * gap) / 3
            w2 = (total_w - gap) / 2
            h = (total_h - gap) / 2
            for i in range(3):
                l = start_l + i * (w3 + gap)
                slide.shapes.add_picture(valid_imgs[i], l, start_t, w3, h)
            for i in range(2):
                l = start_l + i * (w2 + gap)
                t = start_t + h + gap
                slide.shapes.add_picture(valid_imgs[i + 3], l, t, w2, h)

    def process_blank_inputs(self, brand, year_text):
        """Clean all year and brand placeholder text if user submitted blank brand info."""
        brand_name = str(brand.get("name", "") or "").strip()
        project_name = str(brand.get("projectName", "") or "").strip()

        # Handle Slide 1 & year footers across all slides
        for slide in self.prs.slides:
            for s in slide.shapes:
                if s.has_text_frame:
                    t = s.text_frame.text
                    # Process year footers
                    if "2026" in t or "2027" in t or s.name in ["TextBox 10", "TextBox 8", "TextBox 11", "TextBox 6", "TextBox 9"]:
                        if not year_text:
                            # If year is blank, clear footer year shapes
                            if t in ["2026", "2027"] or s.name in ["TextBox 10", "TextBox 8", "TextBox 11"]:
                                s.text_frame.clear()

    def generate(self, data, output_path):
        brand = data.get("brand", {}) or {}
        colors = data.get("colors", {}) or {}
        typography = data.get("typography", {}) or {}
        editing = data.get("editing", {}) or {}
        wardrobe = data.get("wardrobe", {}) or {}
        background = data.get("background", {}) or {}

        # Register user font files with FontManager before slide 3 processing
        for f_key in ["display", "secondary", "tertiary", "caption"]:
            f_val = str(typography.get(f_key, "") or "").strip()
            if f_val:
                self.font_manager.register_font_with_windows(f_val)

        raw_year = brand.get("year")
        year_text = str(raw_year).strip() if raw_year is not None and str(raw_year).strip() != "" else ""

        wardrobe_tones = wardrobe.get("tone", [])
        if isinstance(wardrobe_tones, list):
            w_tone_str = " / ".join([str(t).strip() for t in wardrobe_tones if str(t).strip()])
        else:
            w_tone_str = str(wardrobe_tones).strip()

        wardrobe_colors = wardrobe.get("colors", [])
        if isinstance(wardrobe_colors, list):
            w_color_str = " / ".join([str(c).strip() for c in wardrobe_colors if str(c).strip()])
        else:
            w_color_str = str(wardrobe_colors).strip()

        bg_tones = background.get("tone", [])
        if isinstance(bg_tones, list):
            bg_tone_str = " / ".join([str(t).strip() for t in bg_tones if str(t).strip()])
        else:
            bg_tone_str = str(bg_tones).strip()

        bg_locs = background.get("locations", [])
        if isinstance(bg_locs, list):
            bg_loc_str = " / ".join([str(l).strip() for l in bg_locs if str(l).strip()])
        else:
            bg_loc_str = str(bg_locs).strip()

        replacements = {}
        if brand.get("name"):
            replacements["{{BRAND_NAME}}"] = brand.get("name")
        if brand.get("projectName"):
            replacements["{{PROJECT_NAME}}"] = brand.get("projectName")

        if year_text:
            replacements["{{YEAR}}"] = year_text
            replacements["2026"] = year_text
            replacements["2027"] = year_text

        # 1. Base text token replacements
        if replacements:
            self.replace_all_text(replacements)

        # 2. Slide 1 Brand Logo Image Replacement
        logo_path = brand.get("logoImage", "")
        if logo_path and logo_path.startswith("/uploads/"):
            uploads_dir = os.path.join(os.getcwd(), "uploads")
            logo_path = os.path.join(uploads_dir, logo_path.replace("/uploads/", ""))
        self.process_slide_1_logo(logo_path)

        # 3. Slide 2 Colors
        self.process_colors_slide_2(colors)

        # 4. Slide 3 Typography
        self.process_typography_slide_3(typography, year_text=year_text)

        # 5. Slide 4 Editing
        self.process_editing_slide_4(editing)

        # 6. Slide 5 Wardrobe
        slide5 = self.prs.slides[4]
        sidebar_shape_5 = None
        for shape in slide5.shapes:
            if shape.has_text_frame:
                if "STYLE TONE" in shape.text_frame.text:
                    sidebar_shape_5 = shape
                elif "04 / WARDROBE" in shape.text_frame.text:
                    shape.text_frame.text = "04 / WARDROBE"
                    if len(shape.text_frame.paragraphs) > 0 and len(shape.text_frame.paragraphs[0].runs) > 0:
                        shape.text_frame.paragraphs[0].runs[0].font.name = "Quicksand"
                        shape.text_frame.paragraphs[0].runs[0].font.size = Pt(37.7)
                        shape.text_frame.paragraphs[0].runs[0].font.color.rgb = RGBColor(244, 244, 244)

        self.process_sidebar_text(sidebar_shape_5, "STYLE TONE", w_tone_str, "COLOUR COMBINATIONS", w_color_str)

        w_imgs = wardrobe.get("images", [])
        self.process_dynamic_photo_grid(slide5, w_imgs, area_left=0.58, area_top=1.60, area_width=14.50, area_height=8.00)

        # 7. Slide 6 Background
        slide6 = self.prs.slides[5]
        sidebar_shape_6 = None
        for shape in slide6.shapes:
            if shape.has_text_frame:
                if "BACKGROUND TONE" in shape.text_frame.text:
                    sidebar_shape_6 = shape
                elif "05 / BACKGROUNDS" in shape.text_frame.text:
                    shape.text_frame.text = "05 / BACKGROUNDS"
                    if len(shape.text_frame.paragraphs) > 0 and len(shape.text_frame.paragraphs[0].runs) > 0:
                        shape.text_frame.paragraphs[0].runs[0].font.name = "Quicksand"
                        shape.text_frame.paragraphs[0].runs[0].font.size = Pt(37.7)
                        shape.text_frame.paragraphs[0].runs[0].font.color.rgb = RGBColor(244, 244, 244)

        self.process_sidebar_text(sidebar_shape_6, "BACKGROUND TONE", bg_tone_str, "KEY LOCATIONS", bg_loc_str)

        bg_imgs = background.get("images", [])
        self.process_dynamic_photo_grid(slide6, bg_imgs, area_left=0.58, area_top=1.60, area_width=14.50, area_height=8.00)

        # 8. Process overall blank inputs
        self.process_blank_inputs(brand, year_text)

        # 9. Save final presentation
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        self.prs.save(output_path)
        print(f"[PPTGenerator] Final presentation saved successfully to: {output_path}")


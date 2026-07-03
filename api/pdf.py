from http.server import BaseHTTPRequestHandler
import json
from io import BytesIO
from datetime import datetime
from functools import partial

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_RIGHT
from reportlab.platypus import (
    SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer,
)
from reportlab.graphics.barcode import code128

# ═══════════════════════════════════════════════════════════
# DIZAYN KONSTANTALARI
# ═══════════════════════════════════════════════════════════

PAGE_W = A4[0] - 30 * mm
HEADER_H = 22 * mm
FOOTER_H = 14 * mm

DARK = colors.HexColor("#181824")
PURPLE = colors.HexColor("#7B73FF")
MUTED_ON_DARK = colors.HexColor("#9C9AB0")
INK = colors.HexColor("#181824")
SUB = colors.HexColor("#5F5E5A")
MUTED = colors.HexColor("#B4B2A9")
BORDER = colors.HexColor("#E8E7E0")
ROW_LINE = colors.HexColor("#EFEEE8")
HEADER_BG = colors.HexColor("#F7F6F2")
ROW_ALT = colors.HexColor("#FBFAF8")
SUCCESS = colors.HexColor("#3B6D11")
DANGER = colors.HexColor("#A32D2D")
ACCENT = colors.HexColor("#185FA5")

SUCCESS_BG, SUCCESS_FG = colors.HexColor("#EAF3DE"), SUCCESS
ACCENT_BG, ACCENT_FG = colors.HexColor("#E6F1FB"), ACCENT
NEUTRAL_BG, NEUTRAL_FG = colors.HexColor("#F1EFE8"), SUB

styles = getSampleStyleSheet()
CELL = ParagraphStyle("kCell", parent=styles["Normal"], fontSize=8.5, leading=11, textColor=INK)
CELL_R = ParagraphStyle("kCellR", parent=CELL, alignment=TA_RIGHT)
CELL_MUTED = ParagraphStyle("kCellMuted", parent=CELL, textColor=MUTED)
CELL_MUTED_R = ParagraphStyle("kCellMutedR", parent=CELL_MUTED, alignment=TA_RIGHT)
CELL_BOLD = ParagraphStyle("kCellBold", parent=CELL, fontName="Helvetica-Bold")
CELL_BOLD_R = ParagraphStyle("kCellBoldR", parent=CELL_BOLD, alignment=TA_RIGHT)
TH = ParagraphStyle("kTh", parent=CELL, fontSize=8.5, textColor=SUB)
TH_R = ParagraphStyle("kThR", parent=TH, alignment=TA_RIGHT)
SECTION_TITLE = ParagraphStyle("kSection", parent=styles["Normal"], fontSize=11.5, textColor=INK, fontName="Helvetica-Bold")
STAT_LABEL = ParagraphStyle("kStatLabel", parent=styles["Normal"], fontSize=7.5, textColor=MUTED, spaceAfter=4)
STAT_VALUE = ParagraphStyle("kStatValue", parent=styles["Normal"], fontSize=15, leading=18, fontName="Helvetica-Bold")
SKU_STYLE = ParagraphStyle("kSku", parent=styles["Normal"], fontName="Courier", fontSize=7, textColor=MUTED, spaceBefore=2)
PROD_NAME = ParagraphStyle("kProdName", parent=CELL, fontName="Helvetica-Bold")


def money(v):
    try:
        return "{:,.0f}".format(float(v)).replace(",", " ")
    except (TypeError, ValueError):
        return "-"


def p(text, style=CELL):
    return Paragraph("-" if text in (None, "") else str(text), style)


# ═══════════════════════════════════════════════════════════
# BARCODE
# ═══════════════════════════════════════════════════════════

def barcode_cell(code_text):
    if not code_text:
        return p(None, CELL_MUTED)
    return code128.Code128(
        str(code_text), barWidth=0.42, barHeight=10,
        humanReadable=True, fontSize=5.5, quiet=False,
    )


def product_cell(name, sku, width):
    rows = [[p(name, PROD_NAME)]]
    if sku:
        rows.append([barcode_cell(sku)])
    t = Table(rows, colWidths=[width])
    t.setStyle(TableStyle([
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 1),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
    ]))
    return t


# ═══════════════════════════════════════════════════════════
# BO'LIM SARLAVHASI (rangli chiziq + qalin matn)
# ═══════════════════════════════════════════════════════════

def section(elements, text, color=PURPLE):
    bar = Table([[""]], colWidths=[3.2], rowHeights=[11],
                style=TableStyle([
                    ("BACKGROUND", (0, 0), (-1, -1), color),
                    ("LEFTPADDING", (0, 0), (-1, -1), 0),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                    ("TOPPADDING", (0, 0), (-1, -1), 0),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
                ]))
    row = Table([[bar, Paragraph(text, SECTION_TITLE)]], colWidths=[10, PAGE_W - 10])
    row.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (0, 0), 0),
        ("RIGHTPADDING", (0, 0), (0, 0), 0),
        ("LEFTPADDING", (1, 0), (1, 0), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
    ]))
    elements.append(Spacer(1, 6))
    elements.append(row)
    elements.append(Spacer(1, 8))


# ═══════════════════════════════════════════════════════════
# STATISTIK KARTALAR (rangli tepa chiziq)
# ═══════════════════════════════════════════════════════════

def stat_cards(items):
    n = len(items)
    w = PAGE_W / n
    header_row, value_row, style = [], [], []
    for i, (label, value, color) in enumerate(items):
        c = color or ACCENT
        header_row.append(Paragraph(label.upper(), STAT_LABEL))
        value_row.append(Paragraph(value, ParagraphStyle("v", parent=STAT_VALUE, textColor=c)))
        style += [
            ("LINEABOVE", (i, 0), (i, 0), 2, c),
            ("LINEBELOW", (i, 1), (i, 1), 0.5, BORDER),
            ("LINEBEFORE", (i, 0), (i, 1), 0.5, BORDER),
            ("LINEAFTER", (i, 0), (i, 1), 0.5, BORDER),
        ]
    t = Table([header_row, value_row], colWidths=[w] * n)
    style += [
        ("TOPPADDING", (0, 0), (-1, 0), 10),
        ("BOTTOMPADDING", (0, 1), (-1, 1), 10),
        ("TOPPADDING", (0, 1), (-1, 1), 0),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
    ]
    t.setStyle(TableStyle(style))
    return t


def status_pill(text, bg, fg):
    t = Table([[Paragraph(text, ParagraphStyle("pill", parent=CELL, fontSize=7.5, textColor=fg, alignment=1))]],
              colWidths=[52])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), bg),
        ("TOPPADDING", (0, 0), (-1, -1), 3),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
    ]))
    return t


# ═══════════════════════════════════════════════════════════
# JADVAL
# ═══════════════════════════════════════════════════════════

def data_table(headers, rows, col_widths, align_right_cols=()):
    head = []
    for i, h in enumerate(headers):
        head.append(Paragraph(h, TH_R if i in align_right_cols else TH))
    body = [head] + rows
    t = Table(body, colWidths=col_widths, repeatRows=1)
    style = [
        ("BACKGROUND", (0, 0), (-1, 0), HEADER_BG),
        ("LINEBELOW", (0, 1), (-1, -2), 0.5, ROW_LINE),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, ROW_ALT]),
    ]
    for c in align_right_cols:
        style.append(("ALIGN", (c, 0), (c, -1), "RIGHT"))
    t.setStyle(TableStyle(style))
    return t


# ═══════════════════════════════════════════════════════════
# SARLAVHA / FUTER (canvas darajasida, har sahifada)
# ═══════════════════════════════════════════════════════════

def draw_chrome(canvas_obj, doc, report_title, date_text, left_title="Kabir Exclusive", left_sub="Mebel ishlab chiqarish"):
    canvas_obj.saveState()
    pw, ph = A4

    canvas_obj.setFillColor(DARK)
    canvas_obj.rect(0, ph - HEADER_H, pw, HEADER_H, fill=1, stroke=0)

    box = 9 * mm
    bx = 15 * mm
    by = ph - HEADER_H + (HEADER_H - box) / 2
    canvas_obj.setFillColor(PURPLE)
    canvas_obj.roundRect(bx, by, box, box, 2 * mm, fill=1, stroke=0)
    canvas_obj.setFillColor(colors.white)
    canvas_obj.setFont("Helvetica-Bold", 11)
    canvas_obj.drawCentredString(bx + box / 2, by + box / 2 - 4, "K")

    tx = bx + box + 8
    ty = by + box / 2
    canvas_obj.setFillColor(colors.white)
    canvas_obj.setFont("Helvetica", 11)
    canvas_obj.drawString(tx, ty, left_title)
    canvas_obj.setFillColor(MUTED_ON_DARK)
    canvas_obj.setFont("Helvetica", 7.5)
    canvas_obj.drawString(tx, ty - 10, left_sub)

    rx = pw - 15 * mm
    canvas_obj.setFillColor(colors.white)
    canvas_obj.setFont("Helvetica", 10)
    canvas_obj.drawRightString(rx, ty, report_title)
    canvas_obj.setFillColor(MUTED_ON_DARK)
    canvas_obj.setFont("Helvetica", 7.5)
    canvas_obj.drawRightString(rx, ty - 10, date_text or "")

    canvas_obj.setStrokeColor(ROW_LINE)
    canvas_obj.setLineWidth(0.5)
    canvas_obj.line(15 * mm, FOOTER_H, pw - 15 * mm, FOOTER_H)
    canvas_obj.setFillColor(MUTED)
    canvas_obj.setFont("Helvetica", 7)
    canvas_obj.drawString(15 * mm, FOOTER_H - 10, "Kabir ERP \u00b7 avtomatik yaratildi")
    canvas_obj.drawCentredString(pw / 2, FOOTER_H - 10, "Sahifa %d" % canvas_obj.getPageNumber())
    canvas_obj.drawRightString(pw - 15 * mm, FOOTER_H - 10, datetime.now().strftime("%d.%m.%Y, %H:%M"))

    canvas_obj.restoreState()


# ═══════════════════════════════════════════════════════════
# 1. BOSH SAHIFA
# ═══════════════════════════════════════════════════════════

ACTION_COLOR = {"Sotildi": SUCCESS, "Qarz olindi": ACCENT, "Qaytarildi": DANGER}


def build_home(data):
    elements = []
    section(elements, "Barcha amallar")
    rows = []
    for r in data.get("rows", []):
        action = r.get("action", "")
        color = ACTION_COLOR.get(action, SUB)
        amount = r.get("amount")
        rows.append([
            p(r.get("date")),
            Paragraph(action, ParagraphStyle("act", parent=CELL_BOLD, textColor=color)),
            p(r.get("product")),
            p(r.get("location")),
            p(money(amount) if amount not in (None, "") else None, CELL_MUTED_R if amount in (None, "") else CELL_BOLD_R),
        ])
    elements.append(data_table(
        ["Sana", "Amal", "Mahsulot", "Qayerda", "Summa"], rows,
        [PAGE_W * 0.13, PAGE_W * 0.18, PAGE_W * 0.32, PAGE_W * 0.20, PAGE_W * 0.17],
        align_right_cols=(4,),
    ))
    return elements


# ═══════════════════════════════════════════════════════════
# 2. OMBOR
# ═══════════════════════════════════════════════════════════

def build_warehouse(data):
    elements = []
    stores = data.get("stores", [])
    n_stores = len(stores)
    name_w = PAGE_W * 0.30
    rest_w = (PAGE_W - name_w) / (3 + n_stores)
    col_widths = [name_w] + [rest_w] * (3 + n_stores)
    headers = ["Mahsulot", "Jami", "Ombor"] + list(stores) + ["Sotilgan"]

    section(elements, "Mahsulotlar bo'yicha qoldiq")
    rows = []
    for r in data.get("rows", []):
        row = [product_cell(r.get("name"), r.get("sku"), name_w - 12),
               p(r.get("total"), CELL_BOLD_R), p(r.get("warehouse"), CELL_R)]
        for v in r.get("perStore", [0] * n_stores):
            row.append(p(v, CELL_R))
        row.append(p(r.get("sold"), CELL_MUTED_R))
        rows.append(row)
    align = tuple(range(1, 3 + n_stores))
    elements.append(data_table(headers, rows, col_widths, align_right_cols=align))
    return elements


# ═══════════════════════════════════════════════════════════
# 3. DO'KONLAR
# ═══════════════════════════════════════════════════════════

def build_stores(data):
    elements = []

    section(elements, "Kelgan mahsulotlar", PURPLE)
    inc_rows = [[p(r.get("date")), p(r.get("product")), p(r.get("qty"), CELL_R)] for r in data.get("incoming", [])]
    elements.append(data_table(["Sana", "Mahsulot", "Soni"], inc_rows,
                                [PAGE_W * 0.2, PAGE_W * 0.6, PAGE_W * 0.2], align_right_cols=(2,)))

    section(elements, "Kassa tushumi", SUCCESS)
    cash_rows = []
    total_cash = 0
    for r in data.get("cash", []):
        amt = r.get("amount", 0) or 0
        total_cash += amt
        cash_rows.append([p(r.get("date")), p(r.get("product")), p(r.get("method")), p(money(amt), CELL_R)])
    cash_rows.append([
        Paragraph("Jami kassa", CELL_BOLD), "", "",
        Paragraph(money(total_cash), ParagraphStyle("totR", parent=CELL_BOLD_R, textColor=SUCCESS)),
    ])
    elements.append(data_table(["Sana", "Mahsulot", "Usul", "Summa"], cash_rows,
                                [PAGE_W * 0.15, PAGE_W * 0.4, PAGE_W * 0.2, PAGE_W * 0.25], align_right_cols=(3,)))

    section(elements, "Qarzlar", DANGER)
    debt_rows = []
    for r in data.get("debts", []):
        closed = r.get("closed")
        debt_rows.append([
            p(r.get("customer")), p(r.get("taken")),
            p(closed) if closed else p(None, CELL_MUTED),
            Paragraph(money(r.get("amount")), CELL_BOLD_R if not closed else CELL_R),
        ])
    elements.append(data_table(["Mijoz", "Olingan", "Yopilgan", "Summa"], debt_rows,
                                [PAGE_W * 0.3, PAGE_W * 0.2, PAGE_W * 0.2, PAGE_W * 0.3], align_right_cols=(3,)))
    return elements


# ═══════════════════════════════════════════════════════════
# 4. BUYURTMALAR
# ═══════════════════════════════════════════════════════════

STATUS_STYLE = {
    "Bajarildi": (SUCCESS_BG, SUCCESS_FG),
    "Jarayonda": (ACCENT_BG, ACCENT_FG),
    "Kutilmoqda": (NEUTRAL_BG, NEUTRAL_FG),
}


def build_orders(data):
    elements = []
    section(elements, "Buyurtmalar ro'yxati")
    rows = []
    for r in data.get("rows", []):
        status = r.get("status", "")
        bg, fg = STATUS_STYLE.get(status, (NEUTRAL_BG, NEUTRAL_FG))
        rows.append([
            p(r.get("product"), CELL_BOLD), p(r.get("store")), p(r.get("given")),
            p(r.get("done")) if r.get("done") else p(None, CELL_MUTED),
            p(money(r.get("price")), CELL_R),
            status_pill(status, bg, fg),
        ])
    elements.append(data_table(
        ["Mahsulot", "Do'kon", "Berildi", "Bajarildi", "Narx", "Holat"], rows,
        [PAGE_W * 0.24, PAGE_W * 0.16, PAGE_W * 0.14, PAGE_W * 0.14, PAGE_W * 0.14, PAGE_W * 0.18],
        align_right_cols=(4,),
    ))
    return elements


# ═══════════════════════════════════════════════════════════
# 5. QARZLAR
# ═══════════════════════════════════════════════════════════

def build_debts(data):
    elements = []
    elements.append(stat_cards([
        ("Ochiq qarzlar", money(data.get("openTotal", 0)), DANGER),
        ("Yopilgan (davr)", money(data.get("closedTotal", 0)), SUCCESS),
    ]))
    elements.append(Spacer(1, 14))
    section(elements, "Qarzlar ro'yxati")
    rows = []
    for r in data.get("rows", []):
        closed = r.get("closed")
        rows.append([
            p(r.get("customer"), CELL_BOLD), p(r.get("store")), p(r.get("taken")),
            p(closed) if closed else p(None, CELL_MUTED),
            Paragraph(money(r.get("amount")), CELL_BOLD_R if not closed else CELL_R),
        ])
    elements.append(data_table(
        ["Mijoz", "Do'kon", "Olingan", "Yopilgan", "Summa"], rows,
        [PAGE_W * 0.26, PAGE_W * 0.2, PAGE_W * 0.16, PAGE_W * 0.16, PAGE_W * 0.22],
        align_right_cols=(4,),
    ))
    return elements


# ═══════════════════════════════════════════════════════════
# 6. HISOBOT
# ═══════════════════════════════════════════════════════════

def build_report(data):
    elements = []
    totals = data.get("totals", {})
    elements.append(stat_cards([
        ("Jami savdo", money(totals.get("sales", 0)), None),
        ("Foyda", money(totals.get("profit", 0)), SUCCESS),
        ("Zarar (qaytgan)", money(totals.get("loss", 0)), DANGER),
    ]))
    elements.append(Spacer(1, 14))

    section(elements, "Bestsellerlar")
    name_w = PAGE_W * 0.34
    bs_rows = [[product_cell(r.get("name"), r.get("sku"), name_w - 12),
                p(r.get("sold"), CELL_R), p(money(r.get("revenue")), CELL_BOLD_R)]
               for r in data.get("bestsellers", [])]
    elements.append(data_table(["Mahsulot", "Sotildi", "Tushum"], bs_rows,
                                [name_w, PAGE_W * 0.3, PAGE_W * 0.36], align_right_cols=(1, 2)))

    section(elements, "Do'kon reytingi", SUCCESS)
    sr_rows = [[p(r.get("store"), CELL_BOLD), p(money(r.get("sales")), CELL_R),
                Paragraph(money(r.get("profit")), CELL_BOLD_R)]
               for r in data.get("storeRanking", [])]
    elements.append(data_table(["Do'kon", "Sotuv", "Foyda"], sr_rows,
                                [PAGE_W * 0.4, PAGE_W * 0.3, PAGE_W * 0.3], align_right_cols=(1, 2)))
    return elements


TITLES = {
    "home": "Umumiy faoliyat jurnali",
    "warehouse": "Ombor qoldig'i",
    "stores": "Do'kon faoliyati",
    "orders": "Buyurtmalar",
    "debts": "Qarzlar hisoboti",
    "report": "Umumiy hisobot",
}

BUILDERS = {
    "home": build_home,
    "warehouse": build_warehouse,
    "stores": build_stores,
    "orders": build_orders,
    "debts": build_debts,
    "report": build_report,
}


def build_pdf(report_type, data):
    buf = BytesIO()
    doc = SimpleDocTemplate(
        buf, pagesize=A4,
        topMargin=HEADER_H + 10 * mm, bottomMargin=FOOTER_H + 8 * mm,
        leftMargin=15 * mm, rightMargin=15 * mm,
    )
    builder = BUILDERS.get(report_type, build_report)
    data = data or {}

    left_title = data.get("storeName") or "Kabir Exclusive"
    left_sub = "Kabir Exclusive" if data.get("storeName") else "Mebel ishlab chiqarish"
    report_title = TITLES.get(report_type, "Hisobot")
    date_text = data.get("range") or data.get("asOf") or ""

    chrome = partial(draw_chrome, report_title=report_title, date_text=date_text,
                      left_title=left_title, left_sub=left_sub)

    elements = builder(data)
    doc.build(elements, onFirstPage=chrome, onLaterPages=chrome)
    buf.seek(0)
    return buf.getvalue()


# ═══════════════════════════════════════════════════════════
# VERCEL HANDLER
# ═══════════════════════════════════════════════════════════

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(204)
        self._cors()
        self.end_headers()

    def do_POST(self):
        try:
            length = int(self.headers.get("Content-Length", 0))
            raw = self.rfile.read(length) if length else b"{}"
            payload = json.loads(raw or b"{}")
        except Exception:
            self.send_response(400)
            self._cors()
            self.send_header("Content-Type", "text/plain; charset=utf-8")
            self.end_headers()
            self.wfile.write(b"Notogri JSON")
            return

        report_type = payload.get("type", "report")
        data = payload.get("data", {})

        try:
            pdf_bytes = build_pdf(report_type, data)
        except Exception as e:
            self.send_response(500)
            self._cors()
            self.send_header("Content-Type", "text/plain; charset=utf-8")
            self.end_headers()
            self.wfile.write(("PDF xato: " + str(e)).encode("utf-8"))
            return

        filename = report_type + "-hisobot.pdf"
        self.send_response(200)
        self._cors()
        self.send_header("Content-Type", "application/pdf")
        self.send_header("Content-Disposition", 'inline; filename="' + filename + '"')
        self.send_header("Content-Length", str(len(pdf_bytes)))
        self.end_headers()
        self.wfile.write(pdf_bytes)

    def _cors(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

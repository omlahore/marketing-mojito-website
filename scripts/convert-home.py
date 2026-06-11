import re
from bs4 import BeautifulSoup, NavigableString, Comment, Doctype

SRC = '/sessions/brave-trusting-wozniak/mnt/MM NEW WEBSITE/public/index.html'
OUT = '/sessions/brave-trusting-wozniak/mnt/MM NEW WEBSITE/app/HomeContent.tsx'

soup = BeautifulSoup(open(SRC).read(), 'html.parser')
main = soup.find('main', class_='main-wrapper')

ATTR_MAP = {
    'class': 'className', 'for': 'htmlFor', 'srcset': 'srcSet', 'tabindex': 'tabIndex',
    'maxlength': 'maxLength', 'minlength': 'minLength', 'autocomplete': 'autoComplete',
    'novalidate': 'noValidate', 'readonly': 'readOnly', 'colspan': 'colSpan',
    'rowspan': 'rowSpan', 'frameborder': 'frameBorder', 'allowfullscreen': 'allowFullScreen',
    'charset': 'charSet', 'crossorigin': 'crossOrigin', 'autoplay': 'autoPlay',
    'playsinline': 'playsInline', 'viewbox': 'viewBox', 'spellcheck': 'spellCheck',
    'enctype': 'encType', 'inputmode': 'inputMode', 'datetime': 'dateTime',
    'accesskey': 'accessKey', 'contenteditable': 'contentEditable',
}
VOID = {'img','br','hr','input','meta','link','source','area','base','col','embed','track','wbr','circle','path','rect','line','polyline','polygon','ellipse','stop','use'}

def camel_css(prop):
    prop = prop.strip()
    if prop.startswith('--'): return prop
    if prop.startswith('-webkit-'): base, pre = prop[8:], 'Webkit'
    elif prop.startswith('-moz-'): base, pre = prop[5:], 'Moz'
    elif prop.startswith('-ms-'): base, pre = prop[4:], 'ms'
    elif prop.startswith('-o-'): base, pre = prop[3:], 'O'
    else: base, pre = prop, ''
    parts = base.split('-')
    cam = parts[0] + ''.join(p.capitalize() for p in parts[1:])
    if pre: cam = pre + cam[0].upper() + cam[1:]
    return cam

def style_to_obj(s):
    s = s.replace('rotateY(null)', 'rotateY(0)')
    pairs = []
    for decl in s.split(';'):
        decl = decl.strip()
        if not decl or ':' not in decl: continue
        prop, val = decl.split(':', 1)
        prop, val = camel_css(prop), val.strip()
        if prop.startswith('--'):
            pairs.append(f"['{prop}' as any]: '{val}'")
        else:
            val = val.replace("\\", "\\\\").replace("'", "\\'")
            pairs.append(f"{prop}: '{val}'")
    return '{{ ' + ', '.join(pairs) + ' }}'

def attr_name(name):
    if name.startswith('data-') or name.startswith('aria-'): return name
    if name in ATTR_MAP: return ATTR_MAP[name]
    if '-' in name:  # svg dashed attrs
        parts = name.split('-')
        return parts[0] + ''.join(p.capitalize() for p in parts[1:])
    if name == 'xmlns:xlink': return 'xmlnsXlink'
    if name == 'xlink:href': return 'xlinkHref'
    return name

def fix_path(val):
    val = re.sub(r'^(images|js|css|documents|videos|fonts)/', r'/\1/', val)
    return val

def fix_srcset(val):
    return re.sub(r'(^|,\s*)(images/)', r'\1/\2', val)

def esc_text(t):
    if t.strip() == '':
        return '' if '\n' in t else t
    if any(c in t for c in '{}<>`'):
        body = t.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')
        return '{`' + body + '`}'
    return t

def esc_attr(v):
    if '"' in v:
        return "{'" + v.replace("\\", "\\\\").replace("'", "\\'") + "'}"
    return '"' + v + '"'

def serialize(node, indent=0):
    pad = '  ' * indent
    out = []
    if isinstance(node, (Comment, Doctype)): return ''
    if isinstance(node, NavigableString):
        return esc_text(str(node))
    name = node.name
    if name == 'script': return ''
    if name == 'style':
        css = (node.string or '').replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')
        return f'{pad}<style dangerouslySetInnerHTML={{{{ __html: `{css}` }}}} />\n'
    attrs = []
    for k, v in node.attrs.items():
        if isinstance(v, list): v = ' '.join(v)
        if k == 'style':
            attrs.append(f'style={style_to_obj(v)}'); continue
        n = attr_name(k)
        if k in ('src', 'href', 'data-img', 'poster', 'action') and isinstance(v, str):
            v = fix_path(v)
        if k == 'srcset': v = fix_srcset(v)
        if k == 'value' and node.name in ('input',) and node.get('type') not in ('submit','button','hidden'):
            n = 'defaultValue'
        if k in ('checked','selected'):
            n = 'defaultChecked' if k=='checked' else 'selected'
            attrs.append(f'{n}'); continue
        if v == '' or v is None:
            attrs.append(f'{n}=""')
        else:
            attrs.append(f'{n}={esc_attr(v)}')
    astr = (' ' + ' '.join(attrs)) if attrs else ''
    children = list(node.children)
    real = [c for c in children if not isinstance(c, (Comment, Doctype)) and not (isinstance(c, NavigableString) and str(c).strip()=='' and '\n' in str(c))]
    if name in VOID or not real:
        return f'{pad}<{name}{astr} />\n'
    # single text child inline
    if len(real) == 1 and isinstance(real[0], NavigableString):
        txt = esc_text(str(real[0]))
        return f'{pad}<{name}{astr}>{txt}</{name}>\n'
    inner = ''
    for c in real:
        if isinstance(c, NavigableString):
            t = esc_text(str(c))
            if t: inner += '  ' * (indent+1) + t + '\n'
        else:
            inner += serialize(c, indent+1)
    return f'{pad}<{name}{astr}>\n{inner}{pad}</{name}>\n'

# --- rebuild code-embed-7: flatten nested html doc ---
emb7 = main.find('div', class_='code-embed-7')
inner_html_doc = emb7.find('html')
styles = inner_html_doc.find_all('style') if inner_html_doc else []
# body content: everything in nested doc body except script
content_nodes = []
nested_body = inner_html_doc.find('body') if inner_html_doc else None
container = nested_body if nested_body is not None else inner_html_doc
if container:
    for ch in list(container.children):
        if getattr(ch, 'name', None) in ('script', 'style', 'head', 'meta', 'title'): continue
        if isinstance(ch, (Comment, Doctype)): continue
        if isinstance(ch, NavigableString) and str(ch).strip()=='' : continue
        content_nodes.append(ch)
new_emb = soup.new_tag('div')
new_emb['class'] = ['code-embed-7', 'w-embed', 'w-script']
for st in styles: new_emb.append(st)
for cn in content_nodes: new_emb.append(cn)
emb7.replace_with(new_emb)

roots = []
for ch in main.find_all(recursive=False):
    cls = ch.get('class', [])
    if ch.name == 'section': roots.append(ch)
    elif ch.name == 'div' and 'padding-global' in cls: roots.append(ch)
    elif ch.name == 'div' and 'whatsapp-block' in cls: roots.append(ch)

# trailing body style (line-clamp)
trail_styles = soup.body.find_all('style', recursive=False)

jsx = ''
for r in roots:
    jsx += serialize(r, 3)
for st in trail_styles:
    jsx += serialize(st, 3)

out = f'''/**
 * HomeContent — homepage body converted 1:1 from public/index.html (Webflow export).
 * data-w-id attributes and IX2 inline initial styles are intentionally preserved;
 * HomeScripts re-initializes Webflow IX2 + loads GSAP/weblocks so animations run.
 * Generated by scripts/convert-home.py — edit with care.
 */
export default function HomeContent() {{
  return (
    <>
{jsx.rstrip()}
    </>
  );
}}
'''
open(OUT, 'w').write(out)
print('written', len(out), 'chars')
import subprocess

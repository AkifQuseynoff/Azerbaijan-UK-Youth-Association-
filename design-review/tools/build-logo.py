# Assembles design-review/assets/logo-mark.svg from the traced paths (see trace-logo.py).
import json, sys
p = json.load(open(sys.argv[1]))
svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="100 140 1330 1000" role="img" aria-label="Azerbaijan-UK Youth Association">
<defs>
<linearGradient id="g-letter" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1b4793"/><stop offset="1" stop-color="#1a4088"/></linearGradient>
<linearGradient id="g-swoosh" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2f6cc0"/><stop offset="1" stop-color="#1f56a6"/></linearGradient>
</defs>
<path id="logo-a" fill="url(#g-letter)" fill-rule="evenodd" d="{p['blue_1']['d']}"/>
<path id="logo-swoosh" fill="url(#g-swoosh)" fill-rule="evenodd" d="{p['blue_2']['d']}"/>
<path id="logo-y" fill="url(#g-letter)" fill-rule="evenodd" d="{p['blue_3']['d']}"/>
<path id="logo-red" fill="#c23028" fill-rule="evenodd" d="{p['red']['d']}"/>
<path id="logo-green" fill="#3e894c" fill-rule="evenodd" d="{p['green']['d']}"/>
</svg>'''
open(sys.argv[2], 'w').write(svg)
json.dump(p, open(sys.argv[2].replace('logo-mark.svg', 'logo-paths.json'), 'w'))
print(len(svg), 'bytes')

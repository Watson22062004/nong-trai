# Gộp js/ vào index.html:  python3 build.py
import re,os
P=os.path.dirname(os.path.abspath(__file__))+'/'
ORDER=['core','art','icons','restaurant','book','progress','zones/farm','zones/market','zones/kitchen','zones/shop','zones/stall','zones/hub','zones/pets','ui','audio']
h=open(P+'index.html',encoding='utf8').read()
js=''.join('\n/* ===== %s.js ===== */\n\n%s\n'%(n.split('/')[-1],open(P+'js/%s.js'%n,encoding='utf8').read()) for n in ORDER)
a=h.index('<script>')+len('<script>\n'); b=h.rindex('</script>')
open(P+'index.html','w',encoding='utf8').write(h[:a]+js+'\n'+h[b:])
print('built')

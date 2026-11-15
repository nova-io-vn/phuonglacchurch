"""Subset an OFL Noto Serif font into Three.js outline geometry data."""
import json
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.basePen import BasePen
font=TTFont('public/fonts/source.ttf')
font=instantiateVariableFont(font,{'wght':650,'wdth':100},inplace=True)
glyphs=font.getGlyphSet()
class Outline(BasePen):
 def __init__(self): super().__init__(glyphs);self.commands=[]
 def _moveTo(self,p): self.commands+=['m',*p]
 def _lineTo(self,p): self.commands+=['l',*p]
 def _qCurveToOne(self,p1,p2): self.commands+=['q',*p2,*p1]
 def _curveToOne(self,p1,p2,p3): self.commands+=['b',*p3,*p1,*p2]
 def _closePath(self): pass
data={}
for ch in sorted(set(' GIÁO XỨ PHƯƠNG LẠC NHÀ THỜ ĐÀI ĐỨC MẸ THÁNH VINH SƠN PHAOLÔ IHS 0123456789')):
 name=font.getBestCmap().get(ord(ch));pen=Outline()
 if not name: continue
 glyphs[name].draw(pen)
 data[ch]={'ha':font['hmtx'].metrics[name][0],'x_min':0,'x_max':font['hmtx'].metrics[name][0],'o':' '.join(str(round(x,3)) if isinstance(x,(float,int)) else x for x in pen.commands)}
out={'glyphs':data,'familyName':'Noto Serif Parish Subset','ascender':font['hhea'].ascent,'descender':font['hhea'].descent,'underlinePosition':-100,'underlineThickness':50,'boundingBox':{'yMin':font['head'].yMin,'yMax':font['head'].yMax,'xMin':font['head'].xMin,'xMax':font['head'].xMax},'resolution':font['head'].unitsPerEm,'original_font_information':{'license':'SIL OFL 1.1; see OFL.txt','source':'https://github.com/google/fonts/tree/main/ofl/notoserif'}}
Path('public/fonts/parish-serif.json').write_text(json.dumps(out,ensure_ascii=False),encoding='utf-8')
print('Exported',len(data),'glyphs')

"""Render two Vega-Lite figures from the exact CSV rows used interactively."""
from pathlib import Path
import csv,json,sys,copy
import vl_convert as vlc
R=Path(__file__).resolve().parents[1]
C=R/'charts';C.mkdir(exist_ok=True)
base={'$schema':'https://vega.github.io/schema/vega-lite/v5.json','width':520,'height':230,'background':'#fbfaf7','config':{'font':'Arial','axis':{'labelFontSize':12,'titleFontSize':13},'view':{'stroke':None}}}
s1=copy.deepcopy(base);s1.update({'title':{'text':'Cognitive use: two independent readings','subtitle':'Word units marked as metaphor: 59 in A, 58 in B'},'data':{'url':'charts/1-cognitive-use.csv'},'params':[{'name':'pass_select','select':{'type':'point','fields':['pass_id']},'bind':'legend'}],'mark':'bar','encoding':{'x':{'field':'category','type':'nominal','title':'Assigned cognitive use','sort':['attributive','constitutive','mixed','uncertain'],'axis':{'labelAngle':0}},'xOffset':{'field':'pass_id','type':'nominal'},'y':{'field':'units','type':'quantitative','title':'Metaphor-marked units','axis':{'tickMinStep':1}},'color':{'field':'pass_id','type':'nominal','title':'Pass','scale':{'domain':['A','B'],'range':['#176a8a','#c36b20']}},'opacity':{'condition':{'param':'pass_select','value':1},'value':0.25},'tooltip':[{'field':'pass_id','title':'Pass'},{'field':'category','title':'Cognitive use'},{'field':'units','type':'quantitative','title':'Units'},{'field':'documents','type':'quantitative','title':'Passages containing this label'}]}})
s2=copy.deepcopy(base);s2.update({'title':{'text':'Agreement depends on the dimension','subtitle':'Common metaphor-marked units only; exact label-set agreement'},'data':{'url':'charts/2-agreement.csv'},'mark':{'type':'bar','color':'#26755b'},'encoding':{'y':{'field':'dimension','type':'nominal','sort':['cognitive','social','binding','scope'],'title':None},'x':{'field':'agreement_percent','type':'quantitative','scale':{'domain':[0,100]},'title':'Exact agreement (%)'},'tooltip':[{'field':'dimension'},{'field':'n','type':'quantitative','title':'Paired units'},{'field':'agree','type':'quantitative','title':'Agree'},{'field':'disagree','type':'quantitative','title':'Disagree'},{'field':'agreement_percent','type':'quantitative','title':'Exact agreement (%)'},{'field':'kappa','title':'Cohen’s kappa'}]}})
for name,spec in [('1-cognitive-use',s1),('2-agreement',s2)]:
 rows=list(csv.DictReader((C/f'{name}.csv').open()))
 (C/f'{name}.vl.json').write_text(json.dumps(spec,ensure_ascii=False,indent=2)+'\n')
 render=copy.deepcopy(spec);render['data']={'values':rows}
 (C/f'{name}.png').write_bytes(vlc.vegalite_to_png(render,scale=2))
 print(name,'rendered',len(rows),'rows')

from pyramid.view import view_config
from greenview import WebService as WS
import json, os.path

@view_config(route_name='home', renderer='templates/index.pt')
def home_view(request):
    return dict()


@view_config(route_name='latest_week_json', renderer='json')
def lw_view(request):
    ws = WS()
    meter_id = request.matchdict['meter_id']
    lw = ws.GraemeLatestWeek(meter_id).data()
    result = [{'time_id': lw['datetime'][i].strftime("%a%H%M"), 'value': lw['value'][i], 'datetime': lw['datetime'][i].strftime("%d/%m/%Y %H:%M:%S")} for i in range(len(lw['value']))]
    return result
    
@view_config(route_name='chart_json', renderer='json')
def chart_view(request):
    meter_id = request.matchdict['meter_id']
    ws = WS()
    lw = ws.GraemeLatestWeek(meter_id).data()
    fname = os.path.join(os.path.dirname(__file__), 'static', 'data', 'profile_%04i.json' % int(meter_id))
    with open(fname) as f:
        p = json.load(f)
    return {
        'upper': [p[lw['datetime'][i].strftime("%a%H%M")]['upper'] for i in range(len(lw['value']))],
        'lower': [p[lw['datetime'][i].strftime("%a%H%M")]['lower'] for i in range(len(lw['value']))],
        'time_id': [lw['datetime'][i].strftime("%a%H%M") for i in range(len(lw['value']))],
        'value': list(lw['value']),
        'datetime': [lw['datetime'][i].strftime("%m/%d/%Y %H:%M:%S") for i in range(len(lw['value']))]
    }

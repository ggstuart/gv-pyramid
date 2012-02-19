from pyramid.config import Configurator

def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """
    config = Configurator(settings=settings)
    config.add_static_view(name='static', path='gvpyramid:static', cache_max_age=3600)
    config.add_route('home', '/')
    config.add_route('latest_week_json', '/meter/{meter_id}/latest_week.json')
    config.add_route('chart_json', '/meter/{meter_id}/chart.json')
    config.scan()
    return config.make_wsgi_app()

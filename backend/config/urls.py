"""
URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URL configuration
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

from app.common import render_react_view
from app.views import (
    state_map_geojson,
    africa_map_geojson,
    population,
    africa_demographics_by_country,
    democracy_score_json,
    campaign_population,
)


def edx_path(route, component_name):
    """ Convenience function for paths that are edx_views """
    return path(
        route,
        render_react_view,
        {
            'component_name': component_name,
            'edx_view': True
        },
    )


urlpatterns = [
    # Django admin page
    path('admin/', admin.site.urls),

    # API endpoints
    path('api/africa_map_geojson/', africa_map_geojson),
    path('api/state_map_geojson/<str:map_name>/', state_map_geojson),
    path('api/population/', population),
    path('api/country_demographics/', africa_demographics_by_country),
    path('api/democracy_scores/', democracy_score_json),
    path('api/campaign_info/', campaign_population),

    # React views
    path('', render_react_view, {'component_name': 'IndexView'}),
    path('all_view/', render_react_view, {'component_name': 'AllView'}),
    edx_path('adventure/', 'ChooseAdventureView'),
    edx_path('map_quiz/', 'MapQuiz'),
    edx_path('budget_voting_simulation/', 'BudgetVotingSimViz'),
    edx_path('heat_map/', 'DemocracyViz'),
    edx_path('campaign_game/', 'CampaignView')
]

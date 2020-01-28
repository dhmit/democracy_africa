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
from django.conf.urls import url

from app.common import render_react_view
from app.views import (
    africa_map_geojson,
    budget_response,
    population,
    democracy_score_json,
)

urlpatterns = [
    # Django admin page
    path('admin/', admin.site.urls),

    # API endpoints
    path('api/africa_map_geojson/', africa_map_geojson),
    path('api/budget_response/', budget_response),
    path('api/population/', population),
    path('api/democracy_scores/', democracy_score_json),

    # React views
    url('/', render_react_view, {'component_name': 'DemocracyViz'}),
    url('d3/', render_react_view, {'component_name': 'MapQuizD3'}),
    url('leaflet/', render_react_view, {'component_name': 'MapQuizLeaflet'}),
    url('svg/', render_react_view, {'component_name': 'MapQuizSVG'}),
    url('budget_voting_simulation/', render_react_view, {'component_name': 'BudgetVotingSimViz'}),
    url('heat_map/', render_react_view, {'component_name': 'DemocracyViz'}),
]

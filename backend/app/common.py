"""
Miscellaneous utility functions useful throughout the system
"""
from django.shortcuts import render


def render_react_view(request, component_name=None, edx_view=False):
    """
    A view function to render views that are entirely managed
    in the frontend by a single React component. This lets us use
    Django url routing with React components.

    :param request: Django request object to pass through
    :param component_name: name of the React component to render into the 'root' div
                           of backend/templates/index.html
    :param edx_view: should we render our component inside the AppInEdXView component,
                     that lets us mock the look of an EdX modal?
    :return:
    """
    template = 'index.html'
    context = {
        'component_name': component_name,
        'edx_view': edx_view,
    }
    return render(request, template, context)

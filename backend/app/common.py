"""
Miscellaneous utility functions useful throughout the system
"""
from django.shortcuts import render
from django.views.decorators.clickjacking import xframe_options_exempt


def render_react_view(request, component_name=None, edx_view=False, xframe_exempt=False):
    """
    A view function to render views that are entirely managed
    in the frontend by a single React component. This lets us use
    Django url routing with React components.

    :param request: Django request object to pass through
    :param component_name: name of the React component to render into the 'root' div
                           of backend/templates/index.html
    :param edx_view: should we render our component inside the AppInEdXView component,
                     that lets us mock the look of an EdX modal?
    :param xframe_exempt: should we exempt this view from the xFrame blocking restrictions?
    :return:
    """
    template = 'index.html'
    context = {
        'component_name': component_name,
        'edx_view': edx_view,
    }
    if xframe_exempt:
        return render_xframe_exempt(request, template, context)
    else:
        return render(request, template, context)


@xframe_options_exempt
def render_xframe_exempt(request, template, context):
    return render(request, template, context)

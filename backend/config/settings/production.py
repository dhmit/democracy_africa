"""

Production settings for dhmit/democracy_africa

"""

from .base import *  # pylint: disable=unused-wildcard-import, wildcard-import

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

SECRET_KEY = os.environ['DJANGO_SECRET_KEY']  # set in venv activate

ADMINS = ['rahmed@mit.edu']  # Django will email Ryaan on internal server errors

ALLOWED_HOSTS = [
    'democracy-africa.dhmit.xyz',
    'democracy-africa.dhlab.mit.edu',
]

from django.conf.urls.defaults import patterns, url, include
from django.conf import settings
import os

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Example:
    # (r'^mysite/', include('mysite.foo.urls')),

    # Uncomment the admin/doc line below and add 'django.contrib.admindocs'
    # to INSTALLED_APPS to enable admin documentation:
    # (r'^admin/doc/', include('django.contrib.admindocs.urls')),

    url(r'^$', 'polls.views.main_index'),

    # Uncomment the next line to enable the admin:
    (r'^admin/', include(admin.site.urls)),

    (r'^polls/', include('mysite.polls.urls')),

    (r'^static/(?P<path>.*)$', 'django.views.static.serve',
        {'document_root': os.path.join(settings.ROOT_PATH, 'static')}),
        
    (r'^media/(?P<path>.*)$', 'django.views.static.serve',
        {'document_root': os.path.abspath(os.path.join(os.path.dirname(admin.__file__), 'media')), 'show_indexes': True}),

)

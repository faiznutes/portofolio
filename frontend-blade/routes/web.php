<?php

return [
    ['GET', '/', 'public.home'],
    ['GET', '/works', 'public.works.index'],
    ['GET', '/works/{slug}', 'public.works.show'],
    ['GET', '/services', 'public.services.index'],
    ['GET', '/cv', 'public.cv.index'],
    ['GET', '/contact', 'public.contact.index'],
    ['GET', '/admin', 'admin.dashboard'],
    ['GET', '/admin/works', 'admin.works.index'],
    ['GET', '/admin/categories', 'admin.categories.index'],
    ['GET', '/admin/tags', 'admin.tags.index'],
    ['GET', '/admin/highlights', 'admin.highlights.index'],
    ['GET', '/admin/banners', 'admin.banners.index'],
    ['GET', '/admin/services', 'admin.services.index'],
    ['GET', '/admin/testimonials', 'admin.testimonials.index'],
    ['GET', '/admin/cv', 'admin.cv.index'],
    ['GET', '/admin/leads', 'admin.leads.index'],
    ['GET', '/admin/settings', 'admin.settings.index'],
];

# from articles.api.views import ArticleViewSet
# from rest_framework.routers import DefaultRouter

# router = DefaultRouter()
# router.register(r'', ArticleViewSet, base_name='articles')
# urlpatterns = router.urls

from django.urls import path

from .views import (
    ArticleListView,
    ArticleDetailView,
    ArticleCreateView,
    ArticleUpdateView,
    ArticleDeleteView,
    DuelCreateView, UserListView, DatasetListView, DatasetDetailView, DuelUserListView, DuelDetailView)

urlpatterns = [
    path('', ArticleListView.as_view()),
    path('create/', ArticleCreateView.as_view()),
    path('<pk>', ArticleDetailView.as_view()),
    path('<pk>/update/', ArticleUpdateView.as_view()),
    path('<pk>/delete/', ArticleDeleteView.as_view()),

    path('duel/create/', DuelCreateView.as_view()),
    path('duel/user/', DuelUserListView.as_view()),
    path('duel/<pk>', DuelDetailView.as_view()),

    path('dataset/', DatasetListView.as_view()),
    path('dataset/<pk>', DatasetDetailView.as_view()),

    path('user/', UserListView.as_view()),
    path('user/', UserListView.as_view()),


]

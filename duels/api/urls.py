from django.urls import path

from .views import (
    DuelCreateView, UserListView, DatasetListView, DatasetDetailView, DuelUserListView, DuelDetailView,
    DatasetCreateView, DuelUpdateView, AlgorithmCreateView, AlgorithmListView, DuelDeleteView)

urlpatterns = [
    path('duel/create/', DuelCreateView.as_view()),
    path('duel/user/', DuelUserListView.as_view()),
    path('duel/<pk>', DuelDetailView.as_view()),
    path('duel/<pk>/update/', DuelUpdateView.as_view()),
    path('duel/<pk>/delete/', DuelDeleteView.as_view()),

    path('dataset/', DatasetListView.as_view()),
    path('dataset/<pk>', DatasetDetailView.as_view()),
    path('dataset/create/', DatasetCreateView().as_view()),

    path('algorithm/create/', AlgorithmCreateView().as_view()),
    path('algorithm/', AlgorithmListView.as_view()),


    path('user/', UserListView.as_view()),
]

from decimal import Decimal
from math import floor

import pandas
from django.conf import settings
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import GaussianNB
from sklearn.neighbors import KNeighborsClassifier
from sklearn.neural_network import MLPClassifier
from sklearn.svm import LinearSVC
from sklearn.tree import DecisionTreeClassifier

MEDIA_ROOT = settings.MEDIA_ROOT


def count_percentage(duel, algorithm):
    dataset = pandas.read_csv(f'{MEDIA_ROOT}/{duel.dataset.dataset}')

    if len(duel.user1_percentage) + len(duel.user2_percentage) < 2:
        dataset = dataset[0:floor(len(dataset) / 3)]
    elif len(duel.user1_percentage) + len(duel.user2_percentage) < 4:
        dataset = dataset[0:floor(2 * len(dataset) / 3)]

    x = dataset.values[:, 0:3]
    y = dataset.values[:, 3]
    x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2,
                                                        random_state=0)
    algorithms = {
        'KNeighborsClassifier': KNeighborsClassifier,
        'LogisticRegression': LogisticRegression,
        'LinearSVC': LinearSVC,
        'GaussianNB': GaussianNB,
        'DecisionTreeClassifier': DecisionTreeClassifier,
        'RandomForestClassifier': RandomForestClassifier,
        'GradientBoostingClassifier': GradientBoostingClassifier,
        'MLPClassifier': MLPClassifier,
    }

    model = algorithms[algorithm.get_name_display()](**algorithm.parameters, random_state=0)
    model.fit(x_train, y_train)
    return float(Decimal(100 * model.score(x_test, y_test)).quantize(Decimal('.001')))

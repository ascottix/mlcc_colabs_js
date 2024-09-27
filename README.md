# JavaScript implementation of Machine Learning Crash Course Colabs

This is a from-scratch implementation of the Colabs from Google's [Machine Learning Crash Course](https://developers.google.com/machine-learning/crash-course).

It uses no external libraries and has no dependencies.

## Motivation

The programming exercises in the course are great, but there is very little to program because all the code is already there for you to run. Moreover, the most interesting parts are hidden in libraries like Keras, so you don't get to see how things really work.

In this project, everything has been implemented from scratch, so it's possible to see how things work and experiment with everything. However, the main goal here is to try and learn, so don't expect production-quality stuff, many things are very rudimentary.

## Charting

Some of the experiments generate charts. Charts are saved as PPM files, which is a simple text-based format. They can be previewed like any other file in MacOS, haven't tried yet on other systems.

## Programing exercise #1

In [this exercise](https://colab.research.google.com/github/google/eng-edu/blob/main/ml/cc/exercises/linear_regression_taxi.ipynb?utm_source=mlcc&utm_campaign=colab-external&utm_medium=referral&utm_content=linear_regression), you build a linear regression model that predicts taxi fares. There are two experiments:
* experiment #1 uses only one feature (the trip miles)
* experiment #2 uses two features (trip miles and trip duration) and gets a better result

Only one experiment is run at a time, it must be set in the source code.

### Setup

Download [the Chicago Taxi simplified dataset](https://dl.google.com/mlcc/mledu-datasets/chicago_taxi_train.csv) and put it into the data folder. The dataset contains 2 days worth of data from the [City of Chicago Taxi Trips dataset](https://www.google.com/url?q=https%3A%2F%2Fdata.cityofchicago.org%2FTransportation%2FTaxi-Trips%2Fwrvz-psew).

## Programming exercise #2

In [this exercise](https://colab.research.google.com/github/google/eng-edu/blob/main/ml/cc/exercises/binary_classification_rice.ipynb?utm_source=mlcc&utm_campaign=colab-external&utm_medium=referral&utm_content=binary_classification), you build a binary classification model that classifies rice grains based on three features.

### Setup

Download [the Cinar and Koklu 2019 Osmancik and Cammeo rice dataset](https://download.mlcc.google.com/mledu-datasets/Rice_Cammeo_Osmancik.csv) and put it into the data folder. The authors have also published several other datasets in their [repository](https://www.muratkoklu.com/datasets/).

**Citation**

Cinar, I. and Koklu, M., (2019). “Classification of Rice Varieties Using Artificial Intelligence Methods.” International Journal of Intelligent Systems and Applications in Engineering, 7(3), 188-194.

DOI: https://doi.org/10.18201/ijisae.2019355381

## License

MIT.

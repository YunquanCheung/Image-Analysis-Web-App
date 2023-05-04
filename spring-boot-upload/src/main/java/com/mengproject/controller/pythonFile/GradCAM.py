
from PIL import Image, ImageChops
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model, Sequential, Model, Sequential
from tensorflow.keras.preprocessing import image
from tensorflow.keras import Model
import requests
import os
import cv2
import numpy as np
from PIL import Image
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import random
from tensorflow.keras import models
import matplotlib.pyplot as plt
import matplotlib.cm as cm
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from tensorflow.keras import backend as K
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout, BatchNormalization, Input
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.losses import binary_crossentropy
from tensorflow.keras.layers import GlobalAveragePooling2D
import glob

from tensorflow.keras.models import load_model


def grad_cam(model, img,
             layer_name="block5_conv3", label_name=None,
             category_id=None):
    """Get a heatmap by Grad-CAM.
    Args:
        model: A model object, build from tf.keras 2.X.
        img: An image ndarray.
        layer_name: A string, layer name in model.
        label_name: A list or None,
            show the label name by assign this argument,
            it should be a list of all label names.
        category_id: An integer, index of the class.
            Default is the category with the highest score in the prediction.
    Return:
        A heatmap ndarray(without color).
    """
    img_tensor = np.expand_dims(img, axis=0)

    conv_layer = model.get_layer(layer_name)
    heatmap_model = Model([model.inputs], [conv_layer.output, model.output])

    with tf.GradientTape() as gtape:
        conv_output, predictions = heatmap_model(img_tensor)
        if category_id == None:
            category_id = np.argmax(predictions[0])
        if label_name:
            print(label_name[category_id])
        output = predictions[:, category_id]
        grads = gtape.gradient(output, conv_output)
        pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))

    heatmap = tf.reduce_mean(tf.multiply(pooled_grads, conv_output), axis=-1)
    heatmap = np.maximum(heatmap, 0)
    max_heat = np.max(heatmap)
    if max_heat == 0:
        max_heat = 1e-10
    heatmap /= max_heat

    return np.squeeze(heatmap)


def grad_cam_plus(model, img,
                  layer_name="block5_conv3", label_name=None,
                  category_id=None):
    """Get a heatmap by Grad-CAM++.
    Args:
        model: A model object, build from tf.keras 2.X.
        img: An image ndarray.
        layer_name: A string, layer name in model.
        label_name: A list or None,
            show the label name by assign this argument,
            it should be a list of all label names.
        category_id: An integer, index of the class.
            Default is the category with the highest score in the prediction.
    Return:
        A heatmap ndarray(without color).
    """
    img_tensor = np.expand_dims(img, axis=0)

    conv_layer = model.get_layer(layer_name)
    heatmap_model = Model([model.inputs], [conv_layer.output, model.output])

    with tf.GradientTape() as gtape1:
        with tf.GradientTape() as gtape2:
            with tf.GradientTape() as gtape3:
                conv_output, predictions = heatmap_model(img_tensor)
                if category_id == None:
                    category_id = np.argmax(predictions[0])
                if label_name:
                    print(label_name[category_id])
                output = predictions[:, category_id]
                conv_first_grad = gtape3.gradient(output, conv_output)
            conv_second_grad = gtape2.gradient(conv_first_grad, conv_output)
        conv_third_grad = gtape1.gradient(conv_second_grad, conv_output)

    global_sum = np.sum(conv_output, axis=(0, 1, 2))

    alpha_num = conv_second_grad[0]
    alpha_denom = conv_second_grad[0]*2.0 + conv_third_grad[0]*global_sum
    alpha_denom = np.where(alpha_denom != 0.0, alpha_denom, 1e-10)

    alphas = alpha_num/alpha_denom
    alpha_normalization_constant = np.sum(alphas, axis=(0, 1))
    alphas /= alpha_normalization_constant

    weights = np.maximum(conv_first_grad[0], 0.0)

    deep_linearization_weights = np.sum(weights*alphas, axis=(0, 1))
    grad_CAM_map = np.sum(deep_linearization_weights*conv_output[0], axis=2)

    heatmap = np.maximum(grad_CAM_map, 0)
    max_heat = np.max(heatmap)
    if max_heat == 0:
        max_heat = 1e-10
    heatmap /= max_heat

    return heatmap


def preprocess_image(img_path, target_size=(400, 400)):
    """Preprocess the image by reshape and normalization.
    Args:
        img_path:  A string.
        target_size: A tuple, reshape to this size.
    Return:
        An image ndarray.
    """
    img = image.load_img(img_path, target_size=target_size)
    img = image.img_to_array(img)
    img /= 255

    return img


def show_imgwithheat(img_path, heatmap, alpha=0.4, return_array=False):
    """Show the image with heatmap.
    Args:
        img_path: string.
        heatmap:  image array, get it by calling grad_cam().
        alpha:    float, transparency of heatmap.
        return_array: bool, return a superimposed image array or not.
    Return:
        None or image array.
    """
    img = cv2.imread(img_path)
    heatmap = cv2.resize(heatmap, (img.shape[1], img.shape[0]))
    heatmap = (heatmap*255).astype("uint8")
    heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
    superimposed_img = heatmap * alpha + img
    superimposed_img = np.clip(superimposed_img, 0, 255).astype("uint8")
    superimposed_img = cv2.cvtColor(superimposed_img, cv2.COLOR_BGR2RGB)

    # print(type(superimposed_img))
    imgwithheat = Image.fromarray(superimposed_img)
    plt.imshow(imgwithheat)
    plt.show()
    # print(type(imgwithheat))
    # cv2.imwrite('messigray.png', imgwithheat)
    # cv2.imshow('imgwithheat',imgwithheat)
    # display(imgwithheat)

    if return_array:
        return superimposed_img


def save_imgwithheat(img_path, heatmap, saved_path, alpha=0.4, return_array=False):
    """Show the image with heatmap.
    Args:
        img_path: string.
        heatmap:  image array, get it by calling grad_cam().
        alpha:    float, transparency of heatmap.
        return_array: bool, return a superimposed image array or not.
        saved_path: string
    Return:
        None or image array.
    """
    img = cv2.imread(img_path)
    heatmap = cv2.resize(heatmap, (img.shape[1], img.shape[0]))
    heatmap = (heatmap*255).astype("uint8")
    heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
    superimposed_img = heatmap * alpha + img
    superimposed_img = np.clip(superimposed_img, 0, 255).astype("uint8")
    superimposed_img = cv2.cvtColor(superimposed_img, cv2.COLOR_BGR2RGB)

    # print(type(superimposed_img))
    imgwithheat = Image.fromarray(superimposed_img)
    imgwithheat.save(saved_path)

    if return_array:
        return superimposed_img

print('hello_python')
current_directory = os.getcwd()
model_path = current_directory + \
    '/spring-boot-upload/src/main/java/com/mengproject/controller/pythonFile/VGG16 25 categorical.hdf5'

model = load_model(model_path)
# model.summary()

root_path = current_directory + '/spring-boot-upload/src/main/resources/static'

print(root_path)

img_path = current_directory + \
    '/spring-boot-upload/src/main/resources/static/images/test1.jpeg'

img = preprocess_image(img_path)
heatmap = grad_cam(model, img,
                   label_name=['PE', 'PS'],
                   #category_id = 0
                   )


save_imgwithheat(img_path, heatmap,
                 saved_path=root_path + '/images/GCAM_imgwithheat.jpg')

heatmap_plus = grad_cam_plus(model, img)
save_imgwithheat(img_path, heatmap,
                 saved_path=root_path + '/images/GCAM++_imgwithheat.jpg')

heatmap = cv2.resize(heatmap, (img.shape[1], img.shape[0]))
heatmap = (heatmap*255).astype("uint8")
heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
heatmap = np.clip(heatmap, 0, 255).astype("uint8")
heatmap = cv2.cvtColor(heatmap, cv2.COLOR_BGR2RGB)
heatmap = Image.fromarray(heatmap)

heatmap.save(root_path + '/images/GCAM_heat.jpg')

heatmap_plus = cv2.resize(heatmap_plus, (img.shape[1], img.shape[0]))
heatmap_plus = (heatmap_plus*255).astype("uint8")
heatmap_plus = cv2.applyColorMap(heatmap_plus, cv2.COLORMAP_JET)
heatmap_plus = np.clip(heatmap_plus, 0, 255).astype("uint8")
heatmap_plus = cv2.cvtColor(heatmap_plus, cv2.COLOR_BGR2RGB)
heatmap_plus = Image.fromarray(heatmap_plus)

heatmap_plus.save(root_path + '/images/GCAM++_heat.jpg')
img1, img2 = Image.open(
    root_path + '/images/GCAM_heat.jpg'), Image.open(root_path + '/images/GCAM++_heat.jpg')
diff = ImageChops.difference(img1, img2)

diff.save(root_path + '/images/Difference.jpg')
print("finished")

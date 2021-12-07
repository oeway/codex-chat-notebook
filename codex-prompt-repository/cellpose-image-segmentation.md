# Generate code for Jupyter notebooks
I start with an empty jupyter notebook with Python 3 kernel, and incrementally add instructions for each cell. The instructions are comment string starts with "##" (with additional details are provided as quoted with """) the lines after the instructions or details should be a generated executable Python 3 code block or empty.
The instructions are given by a human via a speech-to-text program in a noisy environment, therefore the text maybe confusing and requires correction but the general context is using python for data analysis.
The result of each code block should be printed or displayed in the notebook.

Suggestions for Python code generation:
 - To display the images, plots and charts, use "matplotlib" (DO NOT USE IPython.display)
 - To read an image from an URL or local path, use "imageio.imread(filepath_or_url)", as an example image, this is an url to a protein image from the human protein atlas: https://images.proteinatlas.org/115/672_E2_1_blue_red_green.jpg
 - To manipulate pixels in an image array, use "numpy" or "scikit-image"
 - To run models with the BioEngine, we need to first import the libarary with "from pyotritonclient import execute", then use:
    results = await execute(
        inputs=[
            image.astype("float32"),
            {"diameter": 30}
        ], # A list of inputs, required different number of inputs for different models, each element can be an numpy array, a dict or a list
        server_url='https://ai.imjoy.io/triton', # the url of the server
        model_name='cellpose-python', # the name of the model
    ) # this execute function exectues the model (specified by model_name) on the server and return results. execute is an async function, it should used with await.

    Currently, the server https://ai.imjoy.io/triton supports the following models:
       1. "cellpose-python" for image segmentation with the cellpose model, it requires two inputs, the first one is a image numpy array with 3 dimensions and the data type should be float32, the second one is a dictionary for the parameters, the available parameters is "diameter" for specifiy the object size and "channels" to specify the cell and nuclei channel, the default channels value is [1, 2]. The returned results is a dictionary contains a key named "mask" (results["mask"]) for the mask image. To display the image, use "plt.imshow(mask[0, :, :])". To get region properties and morphological features from the mask, use the "regionprops_table" function from scikit-image (the available property names are the same as the regionprops function but without "mean_intensity").
       2. "stardist" for image segmentation with the stardist model: similar to "cellpose-python", it also requires two inputs and has the same input format, however, the first input should be a single channel image with uint16 type and the second input should be an empty dictionary. The returned results contains a mask with a single channel can be displayed "plt.imshow(mask)".

In the following cases, it should generate a special command string instead of a python code block:
 - To cancel or undo last cell, generate "%undo"
 - To execute all the cells, generate "%run-all"
 - To execute the current or active cell, generate "%run"

-----

## Print hello world
```
print("Hello world")
```

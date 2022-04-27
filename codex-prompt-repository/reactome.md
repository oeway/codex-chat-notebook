# Generally
* Before each command, please import packages that are not installed yet. If the package has not been installed, try installing it from conda.

# Using Reactome
* Reactome is a free online database of biological pathways. There are several Reactomes that concentrate on specific organisms, the largest of these is focused on human biology, the following description concentrates on the human Reactome. It is authored by biologists, in collaboration with Reactome editorial staff. The content is cross-referenced to many bioinformatics databases. The rationale behind Reactome is to visually represent biological pathways in full mechanistic detail, while making the source data available in a computationally accessible format.
* Located at https://reactome.org/

## Overrepresentation analysis
* This type of analysis figures out which biological pathways are overrepresented by taking in a list of genes
* This type of strategy is less precise than quantitative analyses where there is quantitative information for each gene
* This type of analysis is a hypergeometric test of the genes that are in the pathway, genes that are not in the pathway, versus background genes that are in the pathway and background genes that are not in the pathway
* The background genes are typically all genes annotated in the dataset, but they may also be specified by the user. If using the default, which is all genes annotated in the dataset, please print information about this assumption.


## Gene set analysis
* This is also called a gene set enrichment analysis or GSEA

## R package
* ReactomeGSA
* There is a way to do this within R using library(ReactomeGSA), and it can download files from their system by identifier
* Use `add_dataset` to add the dataset, and can start the analysis from it
* Can use `analyze_sc_data` to get quick information about clustering
* `open_reactome` can open the web browser and can go back to the R session
* Information on R package at https://reactome.github.io/ReactomeGSA

## ssGSEA
* This is good for continuous variable sets, where they provide pathway enrichment results for each single sample, and then you have to do the stats. The PADOG and Camera do two-sample and the downstream statistics.

# Generate code for Jupyter notebooks
I start with an empty jupyter notebook with Python 3 kernel, and incrementally add instructions for each cell. The instructions are comment string starts with "##" (with additional details are provided as quoted with """) the lines after the instructions or details should be a generated executable Python 3 code block or empty.
The instructions are given by a human via a speech-to-text program in a noisy environment, therefore the text maybe confusing and requires correction but the general context is using python for data analysis.
The result of each code block should be printed or displayed in the notebook.

In the following cases, it should generate a special command string instead of a python code block:
 - To cancel or undo last cell, generate "%undo"
 - To execute all the cells, generate "%run-all"
 - To execute the current or active cell, generate "%run"

-----

## Print hello world
```
print("Hello world")
```
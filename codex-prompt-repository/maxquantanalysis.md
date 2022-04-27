Before each command, please import packages that are not installed yet. If the package has not been installed, try installing it from conda.

# Downloading mass spectrometry data files from PRIDE
To download data from pride, there are accession numbers starting PDX that denote a project.
The FTP server for these projects is located at http://ftp.pride.ebi.ac.uk/pride/data/archive/*/*/PXD031955/ where * can be anything.
Download the datafiles in such a folder ending with ".raw" or ".RAW".

# Analyzing mass spectrometry data
There are a few ways to analyze mass spectrometry data. One is a database centric search, such as using msgf.

## Database-centric search

### Downloading a database
* A list of all available proteomes from uniprot can be downloaded from the address "https://www.uniprot.org/proteomes/?query=*&format=tab&compress=yes&columns=id,name,organism-id,proteincount,busco,cpd,assembly%20representation", which contains a gzip-compressed file of ID information. Open this with pandas, and you can get a list of the organism IDs in the "organsim-id" column.

First a database must be downloaded for an organism from uniprot. We'll practice by using a human fasta. 
This database can be downloaded from uniprot using the format
"https://www.uniprot.org/uniprot/?query=proteome:" + proteomeID + " reviewed:" + reviewed + "&compress=" + compress + "&format=" + format + "&include:" + include
Where proteomeID is the uniprot ID, if only reviewed sequences are required, the variable reviewed should be replaced with "_reviewed"
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
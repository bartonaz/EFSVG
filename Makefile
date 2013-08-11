# Directory with source files [Contains all the code of the library]
srcDir = src

# Main EFSVG script 
ef = ${srcDir}/efsvg.js

# EFSVG Modules directory
efDir = ${srcDir}/efsvg

# EFSVG Modules
# efMod = 


# Main utility script
ut = ${srcDir}/utils.js

# Utility Modules diretory
utDir = ${srcDir}/utils

# Utility Modules
# utMod = 


# Building full list of files to be merged
fileList = ${ef} ${ut}

# Setting 2 versions to be built: development and minified
all: EFSVG_dev.js EFSVG.js doc
dev: EFSVG_dev.js doc

# Combining raw files into development version
EFSVG_dev.js: ${fileList}
	$(info ** Building development version of the library)
	cat > $@ $^

# Compressing development version into minified version
EFSVG.js: EFSVG_dev.js
	$(info ** Building the minified version of the library [Using Google Closure Compiler])
	java -jar gcc.jar --js $^ --js_output_file $@

# Building documentation with YUIDoc tool
doc: ${srcDir}
	$(info ** Generating documentation by YUIDoc)
	yuidoc -o $@ $^

clean:
	rm -r EFSVG_dev.js EFSVG.js doc/
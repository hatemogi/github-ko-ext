chrome_dir = chrome

all: compile zip

compile: ${chrome_dir}/github-ko.ts
	tsc --lib es6,dom,esnext -t ES2015 ${chrome_dir}/github-ko.ts

zip: compile
	cd ${chrome_dir} && zip -r ../github-ko.zip *

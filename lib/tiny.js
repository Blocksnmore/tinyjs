class Tiny {
    static _vars = new Map();
    static _postRender = [];

    static bulkSet(json){
        for (const [key, value] of Object.entries(json)) {
            this._vars.set(key, value);
        }
        this.render();
    }

    static set(key, value) {
        this._vars.set(key, value);
        this.render();
    }

    static get(key) {
        return this._vars.get(key);
    }

    static postRender(func) {
        this._postRender.push(func);
    }

    static render() {
        /**
         * @type {HTMLElement[]}
         */
        const varElements = document.querySelectorAll("[t]");
        for (const element of varElements) {
            const template = element.getAttribute("data-tiny-template") ?? element.innerText;
            let str = template;
            if (element.getAttribute("data-tiny-template") == undefined) {
                element.setAttribute("data-tiny-template", template);
            }

            for (const [key, value] of this._vars.entries()){
                str = str.split(`$\{${key}}`).join(value);
            }

            if (str != template) {
                element.textContent = str;
            }
        }

        const supportedMethods = [
            {
                id: "class",
                change: (elm, value) => {
                    elm.className = value;
                }
            },
            {
                id: "style",
                change: (elm, value) => {
                    elm.style = value;
                }
            }
        ];

        /**
         * @param {string} str 
         */
        const validation = (str) => {
            let [variable, input] = str.split("==").map((v) => v.trim());
            if (variable.startsWith("${") && variable.endsWith("}")) {
                variable = Tiny.get(variable.substring(2, variable.length-1));
            }
            return variable.toLowerCase() == input.toLowerCase();
        }

        for (const method of supportedMethods) {
            /**
             * @type {HTMLElement[]}
             */
            const validatorElms = document.querySelectorAll(`[t-if-${method.id}]`);
            for (const elm of validatorElms) {
                const validator = elm.getAttribute(`t-if-${method.id}`);
                const ifTrue = elm.getAttribute(`t-then:${method.id}`);
                const ifFalse = elm.getAttribute(`t-else:${method.id}`) ?? "";

                if (validation(validator)) {
                    method.change(elm, ifTrue);
                } else {
                    method.change(elm, ifFalse);
                }
            }
        }

        for (const func of this._postRender) {
            try {
                func();
            } catch {
                // Ignore
            }
        }
    }
}

(() => {
    /**
     * @type {HTMLInputElement[]}
     */
    const boundElements = document.querySelectorAll("[t-bind]");
    for (const element of boundElements) {
        const key = element.getAttribute("t-bind");
        const fallback = element.getAttribute("t-bind:default") ?? "";

        if (Tiny.get(key) == undefined) {
            Tiny.set(key, fallback);
        }

        element.oninput = () => {
            Tiny.set(key, element.value == "" ? fallback : element.value);
        }
    }
})();
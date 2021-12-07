
class InputField {

    // Values
    maxLength = 9;
    minLength = 1;

    fieldId = "student__number";
    cookieId = "studentNumber";
    #jqueryObject;

    // Constructor
    constructor() {
        this.#jqueryObject = $(`#${this.fieldId}`);
        this.#jqueryObject.get(0).addEventListener("keydown", function(e) {
            if (["-", "+", "e", "E"].includes(e.key)) {
                e.preventDefault();
            }

        });
    }

    // Setters & Getters
    #setFieldValue = (value) => this.#jqueryObject.val(value);
    setCookieValue = (value) => {
        if (value.length < this.minLength) {
            return;
        }
        Cookies.set(this.cookieId, value);
    };
    getFieldValue = () => this.#jqueryObject.val();
    getCookieValue = () => Cookies.get(this.cookieId) || null;

    // Update Values
    updateInputBox(value) {

        // Invalid Cookie
        if (value == null || value.trim() === "") {
            return;
        }

        this.#setFieldValue(value);
        this.setCookieValue(value);

    }


    // Update Edit Event
    updateEditEvent(fn) {
        this.#jqueryObject.on("input", () => {
            let currentValue = this.getFieldValue();
            if (currentValue.length > this.maxLength) {
                this.updateInputBox(currentValue.substring(0, this.maxLength))
                return;
            }

            fn();

        });
    }

}

class Barcode {
    #fieldId = "barcode";
    #jqueryObject;
    minLength = 1;

    constructor() {
        this.#jqueryObject = $(`#barcode`);
    }

    setFieldValue(value) {

        if (value.trim().length < this.minLength) {
            return;
        }

        JsBarcode(`#${this.#fieldId}`, `0${value}`, {
            lineColor: "#3d3d3d",
            displayValue: false
        });
    }

}


$(document).on("ready", () => {

    const inputField = new InputField();
    const barcode = new Barcode();

    // Load Saved Values
    {
        let initialValue = inputField.getCookieValue();
        if (initialValue !== null) {
            inputField.updateInputBox(initialValue);
            barcode.setFieldValue(initialValue);
        } else {

        }
    }

    // Change Future Values
    inputField.updateEditEvent(() => {
        let currentValue = inputField.getFieldValue();
        inputField.setCookieValue(currentValue);
        barcode.setFieldValue(currentValue);
    });

})
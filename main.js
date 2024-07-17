// Cách 2 thì thêm tham số Options
function Validator(formSelector) {
   var _this = this;
   // gán giá trị mặc định
   // if (!options) options = {};
   // Nguyên tắc tìm kiếm từ bên trong đâm ra ngoài tìm thẻ cha
   function getParent(element, selector) {
      while (element.parentElement) {
         if (element.parentElement.matches(selector))
            return element.parentElement;
      }
      element = element.parentElement;
   }

   // định dạng cho rules trong form
   // fullname: "required",
   // email: "required|email",
   var formRules = {};

   /**
    * Hàm quy ước tạo rule:
    * - Nếu có lỗi thì return 'error message'
    * - Nếu không có lỗi thì return 'undefined'
    */

   var validatorRules = {
      required: function (value) {
         return value ? undefined : "Vui lòng nhập trường này";
      },
      email: function (value) {
         var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
         return regex.test(value)
            ? undefined
            : "Vui lòng nhập đúng định dạng email";
      },
      min: function (min) {
         return function (value) {
            return value.length >= min
               ? undefined
               : `Vui lòng nhập tối thiệu ${min} ký tự`;
         };
      },
      max: function (max) {
         return function (value) {
            return value.length <= max
               ? undefined
               : `Vui lòng nhập tối thiệu ${max} ký tự`;
         };
      },
   };
   // lấy function trong object
   //    console.log(validatorRules["required"]);

   // Lấy ra form element từ selector truyền vào
   var formElement = document.querySelector(formSelector);

   // Có Form Element thì mới thực hiện validation
   if (formElement) {
      // lấy input trong form
      var inputs = formElement.querySelectorAll("[name][rules]");
      for (var input of inputs) {
         // thực hiện cắt chuỗi "|" trong rules
         var rules = input.getAttribute("rules").split("|");
         for (var rule of rules) {
            var ruleInfo;
            var isRuleHasValue = rule.includes(":");

            if (isRuleHasValue) {
               ruleInfo = rule.split(":");
               rule = ruleInfo[0];
            }

            var ruleFunc = validatorRules[rule];
            if (isRuleHasValue) {
               ruleFunc = ruleFunc(ruleInfo[1]);
            }

            // chuyển đổi chuỗi thành function
            if (Array.isArray(formRules[input.name])) {
               formRules[input.name].push(ruleFunc);
            } else {
               formRules[input.name] = [ruleFunc];
            }
         }
         // Lắng nghe sự kiện để validation (blur, change, ....)
         input.onblur = handleValidate;
         input.oninput = handleClearError;

         // Hàm thực hiện validate
         function handleValidate(e) {
            var rules = formRules[e.target.name];
            var errorMessage;

            for (var rule of rules) {
               errorMessage = rule(e.target.value);
               if (errorMessage) break;
            }

            // nếu có lỗi thì sẽ hiển thị ra UI
            if (errorMessage) {
               var formGroup = getParent(e.target, ".form-group");
               // if (!formGroup) return
               if (formGroup) {
                  formGroup.classList.add("invalid");
                  var formMessage = formGroup.querySelector(".form-message");
                  if (formMessage) {
                     formMessage.innerText = errorMessage;
                  }
               }
            }
            return !errorMessage;
         }

         // Hàm clear message lỗi
         function handleClearError(e) {
            var formGroup = getParent(e.target, ".form-group");
            if (formGroup.classList.contains("invalid")) {
               formGroup.classList.remove("invalid");
               var formMessage = formGroup.querySelector(".form-message");
               if (formMessage) {
                  formMessage.innerText = "";
               }
            }
         }
      }
   }

   // Xử lý hành vi submit form
   formElement.onsubmit = (e) => {
      e.preventDefault();

      var inputs = formElement.querySelectorAll("[name][rules]");
      var isValid = true;

      for (var input of inputs) {
         if (handleValidate({ target: input })) {
            isValid = false;
         }
      }

      // khi không có lỗi thì submit form
      if (!isValid) {
         if (typeof _this.onSubmit === "function") {
            var enableInput = formElement.querySelectorAll(
               "[name]:not([disabled])"
            );
            var formValue = Array.from(enableInput).reduce((values, input) => {
               switch (input.type) {
                  case "radio":
                     values[input.name] = formElement.querySelector(
                        'input[name="' + input.name + '"]:checked'
                     ).value;
                     break;
                  case "checkbox":
                     if (!input.matches(":checked")) {
                        values[input.name] = "";
                        return values;
                     }
                     if (!Array.isArray(values[input.name])) {
                        values[input.name] = [];
                     }
                     values[input.name].push(input.value);
                     break;
                  case "file":
                     values[input.name] = input.file;
                     break;
                  default:
                     values[input.name] = input.value;
               }

               return values;
            }, {});
            _this.onSubmit(formValue);
         } else {
            formElement.submit();
         }
      }
   };
}

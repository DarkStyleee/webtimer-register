$(document).ready(function() {
    var email;
    var phone;
    var internationalFormat;
    var password;
    var passwordConfirm;

    var mass = ['<p>Некорректный email адрес</p>','<p>Некорректный номер</p>','<p>Некорректный пароль</p>','<p>Пароли не совпадают</p>'];


    function validEmail() {
        let access_key = '5a5f667ebbd6793a1a0f13ead55efeea';
        let email_address = email;
        let score;
        let valid;
        let disposable;
        let smtp;

        $.ajax({
            url: 'http://apilayer.net/api/check?access_key=' + access_key + '&email=' + email_address,   
            dataType: 'jsonp',
            success: function(json) {
                disposable = json.disposable;
                valid = json.format_valid;
                score = json.score;
                smtp = json.smtp_check;
                validFormEmail(disposable,valid,score,smtp);
            }
        });
    }

    function validPhone() {
        let access_key = 'b2f8bc236ce43ab8a3702c3342dbf6e6';
        let phone_number = phone;

        let valid;
        let country;

        $.ajax({
            url: 'http://apilayer.net/api/validate?access_key=' + access_key + '&number=' + phone_number,   
            dataType: 'jsonp',
            success: function(json) {

                valid = json.valid;
                country = json.country_code;
                internationalFormat = json.international_format;

                validFormPhone(valid,country);
                return internationalFormat;
            }
        });
    }

    function validPassword() {
        let str = password;
    
        let abc = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let nums = "1234567890";
    
        let regexNum = new RegExp(/\d{3,}/g);
        let regexStr = new RegExp(/[a-zA-Z]{3,}/g);
        let regexPass = new RegExp(/(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{6,}/g);
    
        let reg = (regEx,dictionary) => {
            let result = str.match(regEx);
            if (result != null) {
                for(let i = 0; i < result.length; i++) {
                    if(dictionary.includes(result[i])) {
                        return true;
                    }
                }
            }
        };
    
        if (reg(regexNum,nums) || reg(regexStr,abc) || str.match(regexPass) == null) {
            $('#password').after('<span class="error">Неккоректный пароль</span>');
            $('#password').css("border", "1px solid red");
            mass[2] = '<p>Некорректный пароль</p>';
            validConfirmPassword();


        } else {
            $('#password').css("border", "1px solid green");
            validConfirmPassword();
            delete mass[2];

        }
    }

    function validConfirmPassword() {
        if (passwordConfirm == password) {
            $('#confirm_password').css("border", "1px solid green");
            delete mass[3];
        } else {
            $('#confirm_password').after('<span class="error">Пароли не совпадают</span>');
            $('#confirm_password').css("border", "1px solid red");
            mass[3] = '<p>Пароли не совпадают</p>';
        }
    }

    function validFormEmail(disposable,valid,score,smtp) {
        if (score > 0.5 && valid && smtp && !disposable) {
            $('#email').css("border", "1px solid green");
            delete mass[0];
        } else {
            $('#email').after('<span class="error">Неккоректный email</span>');
            $('#email').css("border", "1px solid red");
            mass[0] = '<p>Некорректный email адрес</p>';

        }
    }

    function validFormPhone(valid,country) {
        if (valid && phone.length > 7) {
            $('#phone').css("border", "1px solid green");
            $('.country').text(country);
            $('.country').show();
            delete mass[1];

        } else {
            $('#phone').after('<span class="error">Неккоректный номер</span>');
            $('#phone').css("border", "1px solid red");
            $('.country').hide();
            mass[1] = '<p>Некорректный телефон</p>';

        }
    }

    $('#email').change(function() {
        $(".error").remove();
        email = $(this).val();
        validEmail();
    });

    $('#phone').change(function() {
        $(".error").remove();
        phone = $(this).val();
        validPhone();
    });

    $('#phone').keypress(function(e) {
        if (e.which != 8 && e.which != 0 && e.which != 46 && (e.which < 48 || e.which > 57)) {
            $('#phone').val('+');
            return false;
        }
        else{
            if($('#phone').val()[0] != '+')
            {
                $('#phone').val('+');
            }
        }
    });

    $('#password').change(function() {
        $(".error").remove();
        password = $(this).val();
        validPassword();
    });

    $('#confirm_password').change(function () {
        $(".error").remove();
        passwordConfirm = $(this).val();
        validConfirmPassword();
    });

    

    function allFieldsValid() {
        var allFilled = false;
        $("#register__form input").each(function () {
            if ($(this).val() == "") {
                allFilled = true;
            }
        });
        return allFilled;
    }

    $('#checkbox_input').click(function () {
        if($('#checkbox_input').is(":checked")) {
            $('#subscribe-btn').prop('disabled', allFieldsValid());
        } else {
            $('#subscribe-btn').prop('disabled', true);
        }
    });
    

    $('#tooltip').mouseover(function() {
        allFieldsValid();
        if (mass[0] != null || mass[1] != null || mass[2] != null || mass[3] != null) {
            $('#subscribe-btn').html('Зарегистрироваться<span class="tooltiptext">'+mass[0]+mass[1]+mass[2]+mass[3]+'</span>');
        } else {
            $('#show-error').hide();
            $('.tooltiptext').hide();
        }
    });

    $('#subscribe-btn').click(function (e) {
        e.preventDefault();
        alert('Email адрес: '+email+'\n'+'Номер телефона: '+internationalFormat+'\n'+'Пароль: '+password);
    });
    
    
    $('#show-password').click(function () {
        if ($('#password').attr('type') == 'text') {
            $('#password').attr('type', 'password');
        } else {
            $('#password').attr('type', 'text');
        } 
    });    

    $('#show-confirm_password').click(function () {
        if ($('#confirm_password').attr('type') == 'text') {
            $('#confirm_password').attr('type', 'password');
        } else {
            $('#confirm_password').attr('type', 'text');
        } 
    });

    tippy('.show-password-tooltip', {
        content: '<span style="color:#e3465b;">Password<br>(!@#$%^&*(),.)<br>abcde 1-A 2-a<br>123</span>',
        arrow: true,
        theme: 'light',
        trigger: 'click',
        arrowType: 'round',
        animation: 'fade',
    });
  

});
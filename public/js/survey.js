$(function (){
    if (auth_id == -1){
        $("#modalLogin").modal('show');
        $('#modalLogin').data('bs.modal')._config.backdrop = 'static';
        $('#modalLogin').data('bs.modal')._config.keyboard = false;
    }
})

function validateFormTest(){
    let valid = false;
    const unFinishedStyle = {
        'color': '#a94442!important',
        'background-color': '#f2dede',
        'border-color': '#ebccd1',
        'border-radius': '5px',
        'padding-bottom': '20px',
        'margin': '10px 0'
    };

    const finishedStyle={
        'color': 'black',
        'background-color': 'white',
        'border-color': 'none',
        'border-radius': '0',
        'padding-bottom': '0',
        'margin': '0'
    }
    $(".box-question").each(function (){
        //check radio
        if ($(this).find("input[type=radio]").length){
            if ( !$(this).find("input[type=radio]:checked").length ){
                $(this).css(unFinishedStyle);
                $(window).scrollTop($(this).offset().top);
                valid = false;
                return false;
            }
            else {
                $(this).css(finishedStyle);
                valid = true;
            }
        }

        //check checkbox
        else if ($(this).find(".answers-checkbox").length){
            if (!$(this).find(".answers-checkbox li input[type=checkbox]:checked").length){
                $(window).scrollTop($(this).offset().top);
                $(this).css(unFinishedStyle);
                valid = false;
                return  false;
            } else {
                $(this).css(finishedStyle);
                valid = true;
            }
        }

        //textarea
        else {
            if ($(this).find("textarea").val() == ""){
                $(this).find("textarea").focus();
                $(this).css(unFinishedStyle);
                valid = false;
                return  false;
            }
            else {
                $(this).css(finishedStyle);
                valid = true;
            }
        }
    })

    return valid;
}

function getAnswers(){
    let answers = [];

    $.each($(".box-question"), function (){
        if ($(this).find(".answers-textarea").length){
            const value = $(this).find("textarea").val();
            answers.push(value)
        }

        if ($(this).find(".answers-checkbox").length){
            let arr_checkbox = [];
            $.each($(this).find("input[type=checkbox]:checked"), function (){
                const value = $(this).val();
                arr_checkbox.push(parseInt(value))
            })
            if (arr_checkbox.length){
                answers.push(arr_checkbox)
            }
        }

        if ($(this).find(".answers-radio").length){
            const value = $(this).find("input[type=radio]:checked").val();
            answers.push(parseInt(value))
        }
    })

    return answers;
}

function submitExamTest(survey_id){
    const validate = validateFormTest();
    if (validate){
        let answers = getAnswers();
        console.log(answers)
        $("#submitTest").attr("disabled", "disabled")
            .val("Đang lưu");
        axios.post(`/web-api/auth/v1/survey/${survey_id}`, {
            survey_content: answers
        })
            .then((res)=>{
                console.log(res);
                $("#submitTest").val("Đã lưu");
                $("#alertSuccessTest").show();
            })
            .catch(e=>{
                console.log(e);
                toastr.error("Có lỗi xảy ra");
                $("#submitTest").attr("disabled", false)
                    .val("Hoàn thành");
            })
    } else {
        toastr.error("Bạn vui lòng hoàn thành tất cả các câu hỏi");
    }
}

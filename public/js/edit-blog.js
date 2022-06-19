function updateBlog(data,product_id) {
    $("#save-data").attr('disabled', 'disabled');
    $("#save-data").html("Đang lưu...");
    axios.put("/web-api/auth/v1/blogs/" + product_id, data)
        .then((res) => {
            toastr.success("Chỉnh sửa blog thành công");
            window.location.href = `/blog/${data.slug}`;
        })
        .catch((e) => {
            console.log(e)
            quickToastMixin("error", "Có lỗi xảy ra, chưa thể chỉnh sửa blog lúc này")
        })
        .finally(() => {
                $("#save-data").removeAttr('disabled');
                $("#save-data").html("Save")
            }
        )
}

function saveEditBlog(product_id){
    let data = getDataBlog();
    const isValidate = checkValidateBlog(data);
    if (data.slug){
        console.log(data.slug)
    }
    if (isValidate) {
        updateBlog(data, product_id);
    }else toastr.error("Vui lòng điền đầy đủ thông tin")
}
